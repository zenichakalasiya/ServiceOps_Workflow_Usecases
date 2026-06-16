import * as React from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Segmented } from "@/components/ui/segmented";
import { Button } from "@/components/ui/button";
import { Field } from "./panel-bits";
import { useWorkflow, MODULES, type WorkflowKind } from "@/store/workflow";

function RadioPill({ label }: { label: string }) {
  return (
    <div className="flex h-9 flex-1 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-foreground/80 shadow-sm">
      <span className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/50" />
      {label}
    </div>
  );
}

/** Option 5 — collapsible Workflow Details, editable in-context above the trigger. */
function WorkflowDetailsAccordion() {
  const { state, dispatch } = useWorkflow();
  return (
    <div className="overflow-hidden rounded-lg border border-primary/20 bg-accent/40">
      <button
        onClick={() => dispatch({ type: "TOGGLE_DETAILS" })}
        className="flex w-full items-center justify-between bg-accent px-3 py-2.5 text-left"
      >
        <span className="text-[13px] font-semibold text-accent-foreground">Workflow Details</span>
        <span className="flex items-center gap-1 text-xs font-medium text-primary">
          {state.detailsOpen ? "Collapse" : "Edit"}
          {state.detailsOpen ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </span>
      </button>

      {state.detailsOpen ? (
        <div className="space-y-3 px-3 py-3">
          <Field label="Workflow Name">
            <Input
              className="h-8"
              value={state.name}
              onChange={(e) => dispatch({ type: "SET_NAME", value: e.target.value })}
            />
          </Field>
          <Field label="Workflow Type">
            <Segmented<WorkflowKind>
              value={state.kind}
              onChange={(v) => dispatch({ type: "REQUEST_KIND", value: v })}
              options={[
                { value: "event", label: "Event" },
                { value: "periodic", label: "Periodic" },
              ]}
            />
          </Field>
          <Field label="Module">
            <Select
              className="[&>button]:h-8"
              value={state.module}
              options={MODULES}
              onChange={(v) => dispatch({ type: "REQUEST_MODULE", value: v })}
            />
          </Field>
        </div>
      ) : (
        <dl className="space-y-1.5 px-3 py-3 text-xs">
          {[
            ["Name", state.name || "—"],
            ["Type", state.kind === "event" ? "Event" : "Periodic"],
            ["Module", state.module || "—"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/** Body of the Trigger Selection panel. */
export function TriggerPanel() {
  const { state } = useWorkflow();
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {state.option === 5 && <WorkflowDetailsAccordion />}

        <Field label="Title" required>
          <Input defaultValue="Trigger" />
        </Field>
        <Field label="Description" required>
          <Textarea defaultValue="1. Subject Is Changed" />
        </Field>

        <span className="inline-flex rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
          Trigger 1
        </span>

        <Field label="Select Attribute" required>
          <Select
            value="Subject"
            options={["Subject", "Status", "Priority", "Department", "Group"]}
            onChange={() => {}}
          />
        </Field>

        <div className="flex gap-3">
          <RadioPill label="Any" />
          <RadioPill label="Any" />
        </div>

        <Button variant="outline" size="sm" className="text-primary">
          <Plus className="h-4 w-4" /> Add Trigger
        </Button>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          You can add multiple triggers to this workflow. If any one of them occurs, the workflow
          will run.
        </p>
      </div>
    </div>
  );
}
