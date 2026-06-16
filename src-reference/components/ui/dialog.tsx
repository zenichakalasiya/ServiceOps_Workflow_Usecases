import * as React from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, children, className }: DialogProps) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/50 animate-in" onClick={onClose} />
      <div
        role="dialog"
        className={cn(
          "relative z-10 w-[460px] max-w-[92vw] rounded-xl border border-border bg-card p-6 shadow-2xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
