// Build a Todo List using useReducer:
//
// Features:
// - Add a todo (text input + submit button)
// - Delete a todo
// - Toggle a todo complete/incomplete
// - Show "No todos yet" when the list is empty
//
// Requirements:
// - Use useReducer, NOT useState for the todo list
// - Each todo has: id (number), text (string), completed (boolean)
// - Type everything: state, action, reducer, component
// - Key prop on every list item
// - Completed todos should look different (strikethrough or dimmed)
// - Don't allow adding empty todos

import { useReducer, useState } from "react";

const ACTION = {
  ADD: "add",
  DELETE: "delete",
  TOGGLE: "toggle",
};

type ActionType = {
  type: string;
  payload: string | number;
};

const reducer = (todos: Todo[], action: ActionType): Todo[] => {
  switch (action.type) {
    case ACTION.ADD:
      return [
        ...todos,
        { id: Math.random(), text: action.payload as string, completed: false },
      ];

    case ACTION.DELETE:
      return todos.filter((s) => s.id !== (action.payload as number));

    case ACTION.TOGGLE:
      return todos.map((s) => {
        return {
          ...s,
          completed: s.id === action.payload ? !s.completed : s.completed,
        };
      });

    default:
      return todos;
  }
};

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const TodoReducer = () => {
  const [todos, dispatch] = useReducer(reducer, []);
  const [todoValue, setTodoValue] = useState<string>("");

  console.log(todos);

  return (
    <>
      <input value={todoValue} onChange={(e) => setTodoValue(e.target.value)} />
      <button
        disabled={todoValue.trim().length === 0}
        onClick={() => {
          setTodoValue("");
          dispatch({ type: ACTION.ADD, payload: todoValue });
        }}
      >
        Add
      </button>
      {todos && todos.length > 0 ? (
        todos.map((todo) => {
          return (
            <div key={todo.id}>
              <button
                onClick={() =>
                  dispatch({ type: ACTION.DELETE, payload: todo.id })
                }
              >
                Delete
              </button>
              <button
              onClick={()=> 
                dispatch({type: ACTION.TOGGLE, payload: todo.id})
              }
              >Toggle</button>
              <p
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                Todo text is: {todo.text}
              </p>
            </div>
          );
        })
      ) : (
        <p>No Todos</p>
      )}
    </>
  );
};

export default TodoReducer;
