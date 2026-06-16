import { AlertTriangle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWorkflow } from "@/store/workflow";

export function WarningDialog() {
  const { state, dispatch } = useWorkflow();
  const p = state.pending;
  const isModule = p?.field === "module";

  return (
    <Dialog open={!!p} onClose={() => dispatch({ type: "CANCEL_PENDING" })}>
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-[17px] font-semibold leading-snug">
            {isModule ? "Change workflow module?" : "Change workflow type?"}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This workflow's trigger and any attribute-based steps were built from the{" "}
            <b className="text-foreground">
              {isModule ? state.module || "current" : state.kind === "event" ? "Event" : "Periodic"}
            </b>{" "}
            {isModule ? "module" : "type"}. Changing it to{" "}
            <b className="text-foreground">{p?.label}</b> will reset the configured trigger and clear
            dependent steps. This can't be undone.
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => dispatch({ type: "CANCEL_PENDING" })}>
          Cancel
        </Button>
        <Button variant="destructive" size="sm" onClick={() => dispatch({ type: "CONFIRM_PENDING" })}>
          Change &amp; reset trigger
        </Button>
      </div>
    </Dialog>
  );
}
