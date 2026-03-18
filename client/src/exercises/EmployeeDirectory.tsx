import { useEffect, useReducer, useState } from "react";

const ACTION = {
  ADD: "add",
  DELETE: "delete",
  EDIT: "edit",
  SET: "set",
};

type Employees = {
  id: string;
  name: string;
  department: string;
  role: string;
  isRemote?: boolean;
};

type ActionType = {
  type: string;
  payload: Employees | Employees[] | { id: string | undefined };
};

const reduce = (employees: Employees[], action: ActionType): Employees[] => {
  switch (action.type) {
    case ACTION.ADD: {
      const payload = action.payload as Employees;

      return [...employees, { ...payload }];
    }

    case ACTION.DELETE: {
      const payload = action.payload as { id: string };
      return employees.filter((e) => e.id !== payload.id);
    }

    case ACTION.EDIT: {
      const payload = action.payload as Employees;

      return employees.map((e) => {
        return e.id === payload.id ? { ...e, ...payload } : e;
      });
    }

    case ACTION.SET: {
      const payload = action.payload as Employees[];

      return [...payload];
    }

    default: {
      return employees;
    }
  }
};

const EmployeeDirectory = () => {
  const [employees, dispatch] = useReducer(reduce, []);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [employeeDept, setEmployeeDept] = useState<string>("");
  const [employeeRole, setEmployeeRole] = useState<string>("");
  const [employeeRemoteStatus, setEmployeeRemoteStatus] =
    useState<boolean>(false);
  const [editEmployeeId, setEditEmployeeId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [filteredDept, setFilteredDept] = useState<string>("All");
  const [externalUsers, setExternalUsers] = useState<
    { name: string; email: string }[]
  >([]);

  useEffect(() => {
    const getEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3006/api/employees");
        if (!response.ok) throw new Error("Unable to fetch data");

        const { employees: data } = (await response.json()) as {
          employees: Employees[];
        };
        if (!data) throw new Error("No employee data");

        dispatch({ type: ACTION.SET, payload: data });
      } catch (e) {
        setIsError(true);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    getEmployees();
  }, []);

  useEffect(() => {
    const getExternalUsers = async () => {
      const response = await fetch("http://localhost:3006/api/external-users");
      if (!response.ok) throw new Error("Unable to fetch users");

      const { users } = (await response.json()) as {
        users: { name: string; email: string }[];
      };

      setExternalUsers(users);
    };

    getExternalUsers();
  }, []);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editEmployeeId) {
      try {
        const response = await fetch("http://localhost:3006/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: employeeName,
            department: employeeDept,
            role: employeeRole,
            isRemote: employeeRemoteStatus,
          }),
        });
        if (!response.ok) throw new Error("Unable to fetch employees");

        const data = (await response.json()) as { employee: Employees };

        dispatch({
          type: ACTION.ADD,
          payload: data.employee,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const response = await fetch(
          `http://localhost:3006/api/employees/${editEmployeeId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: employeeName,
              department: employeeDept,
              role: employeeRole,
              isRemote: employeeRemoteStatus,
            }),
          },
        );

        if (!response.ok) throw new Error("Unable to fetch employees");

        const { employee } = await response.json();

        dispatch({ type: ACTION.EDIT, payload: employee });
      } catch (e) {
        console.error(e);
      }
    }
    setEmployeeName("");
    setEmployeeDept("");
    setEmployeeRole("");
    setEmployeeRemoteStatus(false);
    setEditEmployeeId("");
  };

  if (isError) {
    return <div>Error ....</div>;
  }

  if (isLoading) {
    return <div>Loading ....</div>;
  }
  console.log(filteredDept);

  const filteredEmployees = employees.filter((e) =>
    filteredDept === "All"
      ? true
      : e.department.toLowerCase() === filteredDept.toLocaleLowerCase(),
  );
  return (
    <>
      <h2>Employee Directory</h2>
      <form onSubmit={onSubmitHandler}>
        <input
          value={employeeName}
          placeholder="Employee Name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmployeeName(e.target.value)
          }
        />
        <input
          value={employeeDept}
          placeholder="Employee Deptartment"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmployeeDept(e.target.value)
          }
        />
        <input
          value={employeeRole}
          placeholder="Employee Role"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmployeeRole(e.target.value)
          }
        />
        <select
          value={filteredDept}
          onChange={(e) => setFilteredDept(e.target.value)}
        >
          <option value={"All"}>All</option>
          <option value={"Engineering"}> Engineering</option>
          <option value={"Design"}> Design </option>
          <option value={"Marketing"}> Marketing</option>
        </select>{" "}
        <label>
          IsRemote Checkbox:
          <input
            type="checkbox"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmployeeRemoteStatus(e.target.checked)
            }
            checked={employeeRemoteStatus}
          />
        </label>
        <button type="submit">{editEmployeeId ? "Edit" : "Add"}</button>
      </form>
      {filteredEmployees && filteredEmployees.length > 0 ? (
        <ul>
          {filteredEmployees.map((e) => {
            return (
              <div key={e.id}>
                <li>
                  {e.name} - {e.department} - {e.role} -{" "}
                  {`Is Remote  ${e.isRemote ? "Yes" : "No"}`}
                </li>

                <button
                  onClick={() => {
                    setEmployeeName(e.name);
                    setEmployeeDept(e.department);
                    setEmployeeRole(e.role);
                    setEmployeeRemoteStatus(e.isRemote || false);
                    setEditEmployeeId(e.id);
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        `http://localhost:3006/api/employees/${e.id}`,
                        {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                        },
                      );
                      if (!response.ok)
                        throw new Error("Unable to fetch employees");

                      const { id } = await response.json();
                      dispatch({ type: ACTION.DELETE, payload: { id } });
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </ul>
      ) : (
        <div>No Employees yet!</div>
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {externalUsers.length > 0 ? (
            externalUsers.map((e) => {
              return (
                <tr key={e.name}>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>No Data</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default EmployeeDirectory;
