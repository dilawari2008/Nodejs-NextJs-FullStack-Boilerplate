import React from "react";
import { cn } from "@/lib/utils";

const Button = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      className={cn(
        "bg-transparent text-lg text-white px-6 py-1 border-white border rounded-md tracking-wider",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
