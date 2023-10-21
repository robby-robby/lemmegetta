import React from "react";

export const PlusSign = ({ count }: { count: number }) => {
  if (count > 0) {
    return <div className="w-6"> {count} </div>;
  }
  return (
    <svg
      className="h-6 w-6 fill-current"
      stroke="currentColor"
      strokeWidth={4}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 5V19M5 12H19" />
    </svg>
  );
};
