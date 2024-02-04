import React from "react";

interface Props {
  children: React.ReactNode;
  type: "error" | "success";
}

function AlertCard({ children, type }: Props) {
  let className = `flex items-center justify-center p-1 mt-4`;

  if (type === "error") {
    className += " text-red-500 border-l-2 border-red-500";
  } else if (type === "success") {
    className += " text-green-500  border-l-2 border-greeb-500";
  }

  return (
    <div className={className}>
      <span>{children}</span>
    </div>
  );
}

export default AlertCard;
