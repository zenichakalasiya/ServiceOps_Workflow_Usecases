import * as React from "react";
import { Workflow, MousePointerClick } from "lucide-react";
import { Segmented } from "@/components/ui/segmented";
import { PanelHeader } from "./panel-bits";
import { ModuleConfigPanel } from "./ModuleConfigPanel";
import { TriggerPanel } from "./TriggerPanel";
import { useWorkflow, type PanelTab } from "@/store/workflow";

function Aside({ children }: { children: React.ReactNode }) {
  return (
    <aside className="flex w-[380px] shrink-0 flex-col border-l border-border bg-card">
      {children}
    </aside>
  );
}

export function SidePanel() {
  const { state, dispatch } = useWorkflow();

  // Option 4 — tabbed panel (only meaningful once the trigger exists).
  if (state.option === 4 && state.triggerReady) {
    return (
      <Aside>
        <PanelHeader
          icon={<Workflow className="h-4 w-4" />}
          title="Workflow Configuration"
          subtitle="Switch between workflow setup and the selected step."
        />
        <div className="px-5 pt-4">
          <Segmented<PanelTab>
            value={state.tab}
            onChange={(v) => dispatch({ type: "SET_TAB", value: v })}
            options={[
              { value: "setup", label: "Workflow Setup" },
              { value: "trigger", label: "Trigger" },
            ]}
          />
        </div>
        <div className="min-h-0 flex-1">
          {state.tab === "setup" ? <ModuleConfigPanel /> : <TriggerPanel />}
        </div>
      </Aside>
    );
  }

  if (state.panel === "module") {
    return (
      <Aside>
        <PanelHeader
          icon={<Workflow className="h-4 w-4" />}
          title="Workflow Module Configuration"
          subtitle="Pick an Event or Schedule to start this workflow."
          onClose={state.triggerReady ? () => dispatch({ type: "OPEN_TRIGGER" }) : undefined}
        />
        <div className="min-h-0 flex-1">
          <ModuleConfigPanel />
        </div>
      </Aside>
    );
  }

  if (state.panel === "trigger") {
    return (
      <Aside>
        <PanelHeader
          icon={<MousePointerClick className="h-4 w-4" />}
          title="Trigger Selection"
          subtitle="Pick the event that fires this workflow — everything else runs after it."
        />
        <div className="min-h-0 flex-1">
          <TriggerPanel />
        </div>
      </Aside>
    );
  }

  return null;
}
