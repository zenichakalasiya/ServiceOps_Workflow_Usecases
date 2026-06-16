import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Segmented } from "@/components/ui/segmented";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Field, InfoNote, GuardNote } from "./panel-bits";
import { useWorkflow, MODULES, FREQUENCIES, type WorkflowKind } from "@/store/workflow";

/** Body of the Workflow Module Configuration (Name / Type / Module / Schedule). */
export function ModuleConfigPanel() {
  const { state, dispatch } = useWorkflow();
  const editing = state.triggerReady;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
        <Field label="Workflow Name" required>
          <Input
            value={state.name}
            placeholder="Name"
            onChange={(e) => dispatch({ type: "SET_NAME", value: e.target.value })}
          />
        </Field>

        <div className="space-y-2">
          <Label>Select Workflow Type</Label>
          <Segmented<WorkflowKind>
            value={state.kind}
            onChange={(v) => dispatch({ type: "REQUEST_KIND", value: v })}
            options={[
              { value: "event", label: "Event" },
              { value: "periodic", label: "Periodic" },
            ]}
          />
          <InfoNote>
            {state.kind === "event"
              ? "Runs automatically when something happens — like a new ticket, a status change, or an SLA breach."
              : "Runs on a schedule you set — daily, weekly, or at a specific time, whether or not anything has changed."}
          </InfoNote>
        </div>

        <Field label="Select module" required>
          <Select
            value={state.module}
            placeholder="Select Module"
            options={MODULES}
            onChange={(v) => dispatch({ type: "REQUEST_MODULE", value: v })}
          />
        </Field>

        {state.kind === "periodic" && (
          <>
            <Field label="Schedule Type">
              <Select
                value={state.scheduleType}
                options={["Recurring", "One-time"]}
                onChange={(v) => dispatch({ type: "SET_SCHEDULE_TYPE", value: v })}
              />
            </Field>
            <Field label="Frequency" required>
              <Select
                value={state.frequency}
                placeholder="Select Interval"
                options={FREQUENCIES}
                onChange={(v) => dispatch({ type: "SET_FREQUENCY", value: v })}
              />
            </Field>
            <InfoNote tone="amber">
              At this frequency, only up to <b>100 records</b> will be processed per cycle. To run
              more, increase the time interval.
            </InfoNote>
          </>
        )}

        {editing && <GuardNote />}
      </div>

      {!editing && (
        <div className="flex justify-end border-t border-border px-5 py-3">
          <Button
            size="sm"
            disabled={!state.name || !state.module}
            onClick={() => dispatch({ type: "COMPLETE_MODULE" })}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
