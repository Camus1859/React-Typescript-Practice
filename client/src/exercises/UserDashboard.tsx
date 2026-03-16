import { useEffect, useState } from "react";

type UsersType = {
  name: string;
  email: string;
  id: string;
  role: string;
  department: string;
  projects: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  isActive: boolean;
};

const UserDashBoard = () => {
  const [users, setUsers] = useState<UsersType[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nameValue, setNameValue] = useState<string>("");
  const [emailValue, setEmailValue] = useState<string>("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3001/api/users");
        if (!response.ok) throw new Error("Unable to fetch data");

        const { users: usersData } = await response.json();
        setUsers(usersData);
      } catch (e) {
        setIsError(true);
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    getUsers();
  }, []);

  if (isError) {
    return <div>Theres an error ....</div>;
  }

  if (isLoading) {
    return <div>Data is loading</div>;
  }

  console.log(users);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ name: nameValue, email: emailValue }),
      });
      if (!response.ok) throw new Error("Unable to add users!");

      const { user: newUser } = await response.json();

      setUsers([...users, newUser]);
      setEmailValue("");
      setNameValue("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <form onSubmit={onSubmitHandler}>
        <input
          value={nameValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNameValue(e.target.value)
          }
        />
        <input
          value={emailValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmailValue(e.target.value)
          }
        />
        <button
          disabled={nameValue.trim() === "" || emailValue.trim() === ""}
          type="submit"
        >
          Add New User
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.department}</td>
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

export default UserDashBoard;
