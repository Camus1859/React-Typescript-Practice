// Build a Toggle component with:
// - A button that says "Show Details" when content is hidden
// - The button says "Hide Details" when content is visible
// - When visible, show a paragraph: "Here are the secret details!"
// - Use useState with a boolean
// - Type everything

import { useState } from "react";

const Toggle = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <>
      <button onClick={() => setIsVisible((prev) => !prev)}>
        {isVisible ? "Hide Details" : "Show Details"}
      </button>
      {isVisible && <div>Here are the secret details.</div>}
    </>
  );
};

export default Toggle;
