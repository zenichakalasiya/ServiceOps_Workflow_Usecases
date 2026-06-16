import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkflow, type OptionId } from "@/store/workflow";

const OPTIONS: { id: OptionId; label: string; hint: string }[] = [
  { id: 1, label: "1 · Canvas node", hint: "Click the “Workflow Setup” node above the trigger on the canvas." },
  { id: 2, label: "2 · Header menu", hint: "Edit the name in the header, or open the ⋯ menu → “Workflow Settings”." },
  { id: 3, label: "3 · Breadcrumb", hint: "Use the “Configuration › Trigger” strip at the top of the canvas." },
  { id: 4, label: "4 · Tabbed panel", hint: "Switch the “Workflow Setup | Trigger” tabs in the side panel." },
  { id: 5, label: "5 · Details accordion", hint: "Expand “Workflow Details” at the top of the Trigger panel." },
];

export function OptionSwitcher() {
  const { state, dispatch } = useWorkflow();
  const cur = OPTIONS.find((o) => o.id === state.option)!;

  return (
    <div className="flex items-center gap-3 border-b border-slate-700 bg-slate-900 px-4 py-2 text-slate-100">
      <span className="hidden text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:block">
        Re-entry approach
      </span>
      <div className="flex gap-1">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            onClick={() => dispatch({ type: "SET_OPTION", value: o.id })}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              state.option === o.id
                ? "bg-primary text-primary-foreground"
                : "text-slate-300 hover:bg-slate-700"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <span className="ml-auto hidden max-w-[44ch] truncate text-xs text-slate-300 lg:block">
        {state.triggerReady ? cur.hint : "Fill the basic config and click “Next” to unlock re-entry."}
      </span>
      <button
        onClick={() => dispatch({ type: "RESTART" })}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Restart flow
      </button>
    </div>
  );
}
