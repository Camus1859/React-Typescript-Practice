// Build a Counter component with:
// - A number displayed on screen (starts at 0)
// - An "Increment" button that adds 1
// - A "Decrement" button that subtracts 1
// - A "Reset" button that sets it back to 0
//
// Use useState. Type everything.

import { useState } from "react";

const Counter = () => {
  const [counter, setCounter] = useState<number>(0);

  const incrementHandler = () => {
    setCounter((prev) => prev + 1);
  };

  const decrementHandler = () => {
    setCounter((prev) => prev - 1);
  };

  const resetHandler = () => {
    setCounter(0);
  };

  return (
    <>
      <button onClick={incrementHandler}>Increment!</button>
      <button onClick={decrementHandler}>Decrement!</button>
      <button onClick={resetHandler}>Reset</button>
      <p>The current count is</p> <div>{counter}</div>
    </>
  );
};

export default Counter;
