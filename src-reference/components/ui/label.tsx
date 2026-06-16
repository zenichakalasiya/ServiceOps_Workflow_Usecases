import * as React from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ className, children, required, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-xs font-medium text-foreground/80 leading-none", className)}
      {...props}
    >
      {children}
      {required && <span className="text-destructive"> *</span>}
    </label>
  );
}
