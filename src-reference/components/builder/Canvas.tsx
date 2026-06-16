import * as React from "react";
import { Sparkles, Settings, Plus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkflow } from "@/store/workflow";

function Connector({ className }: { className?: string }) {
  return <div className={cn("w-px bg-border", className)} />;
}

function NodeChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
      {children}
    </span>
  );
}

function SetupNode({ selected, onClick, summary }: { selected: boolean; onClick: () => void; summary: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-[300px] rounded-xl border bg-card p-3 text-left shadow-sm transition-all hover:shadow-md",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Settings className="h-[18px] w-[18px]" />
        </div>
        <div>
          <div className="text-sm font-semibold">Workflow Setup</div>
          <div className="text-xs text-muted-foreground">{summary}</div>
        </div>
      </div>
    </button>
  );
}

function TriggerNode({
  selected,
  ready,
  onClick,
}: {
  selected: boolean;
  ready: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-[300px] rounded-xl border bg-card p-3.5 text-left shadow-sm transition-all hover:shadow-md",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="text-sm font-semibold">{ready ? "Multiple Triggers" : "Add a trigger"}</div>
      </div>
      {ready ? (
        <ul className="mt-3 space-y-1.5 text-xs text-foreground/70">
          {["Status is Changed", "Department is Changed", "Incident is Changed"].map((t, i) => (
            <li key={t} className="flex items-center gap-2.5">
              <span className="text-muted-foreground">{i + 1}</span>
              {t}
            </li>
          ))}
          <li className="pt-0.5 text-xs font-medium text-primary">+4 more</li>
        </ul>
      ) : (
        <div className="mt-2 text-xs text-muted-foreground">No Description</div>
      )}
    </button>
  );
}

function Breadcrumb() {
  const { state, dispatch } = useWorkflow();
  const setupActive = state.panel === "module";
  const triggerActive = state.panel === "trigger";
  const Crumb = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-card text-primary"
          : "border-transparent bg-accent text-foreground/70 hover:bg-accent/70"
      )}
    >
      {children}
    </button>
  );
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-1.5 border-b border-border bg-card/85 px-4 py-2 backdrop-blur-sm">
      <Crumb active={setupActive} onClick={() => dispatch({ type: "OPEN_MODULE" })}>
        Configuration
      </Crumb>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
      <Crumb active={triggerActive} onClick={() => dispatch({ type: "OPEN_TRIGGER" })}>
        Trigger
      </Crumb>
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="px-1 text-xs text-muted-foreground">+ Add step</span>
    </div>
  );
}

export function Canvas() {
  const { state, dispatch } = useWorkflow();
  const triggerSelected =
    state.option === 4 ? state.triggerReady && state.tab === "trigger" : state.panel === "trigger";
  const setupSelected =
    state.option === 4 ? state.tab === "setup" : state.panel === "module";

  const summary = [
    state.kind === "event" ? "Event" : "Periodic",
    state.module || "No module",
    state.kind === "periodic" ? state.frequency : null,
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <div className="canvas-grid relative min-w-0 flex-1 overflow-auto">
      {state.option === 3 && state.triggerReady && <Breadcrumb />}
      <div className="flex min-h-full flex-col items-center justify-center py-20">
        {state.option === 1 && state.triggerReady && (
          <>
            <NodeChip>Workflow Setup</NodeChip>
            <Connector className="h-2.5" />
            <SetupNode
              selected={setupSelected}
              summary={summary}
              onClick={() => dispatch({ type: "OPEN_MODULE" })}
            />
            <Connector className="h-9" />
          </>
        )}

        <NodeChip>{state.kind === "periodic" ? "Periodic Trigger" : "Trigger"}</NodeChip>
        <Connector className="h-2.5" />
        <TriggerNode
          selected={triggerSelected}
          ready={state.triggerReady}
          onClick={() => state.triggerReady && dispatch({ type: "OPEN_TRIGGER" })}
        />
        <Connector className="h-9" />
        <button className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
