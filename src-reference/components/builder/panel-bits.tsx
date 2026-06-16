import * as React from "react";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export function PanelHeader({
  title,
  subtitle,
  icon,
  onClose,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="border-b border-border px-5 py-4">
      <div className="flex items-start gap-2.5">
        {icon && (
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
            {icon}
          </div>
        )}
        <h2 className="flex-1 text-[15px] font-semibold leading-snug">{title}</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {subtitle && <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label required={required}>{label}</Label>
      {children}
      {hint && <p className="text-[11px] leading-relaxed text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function InfoNote({
  children,
  tone = "info",
}: {
  children: React.ReactNode;
  tone?: "info" | "amber";
}) {
  const amber = tone === "amber";
  return (
    <div
      className={cn(
        "flex gap-2 rounded-md border p-2.5 text-[11px] leading-relaxed",
        amber
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-border bg-muted/60 text-muted-foreground"
      )}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function GuardNote() {
  return (
    <InfoNote tone="amber">
      Changing <b>Workflow Type</b> or <b>Module</b> will reset the configured trigger. You'll be
      asked to confirm first.
    </InfoNote>
  );
}
