import * as React from "react";

export type OptionId = 1 | 2 | 3 | 4 | 5;
export type WorkflowKind = "event" | "periodic";
/** Which content the side panel currently shows. */
export type PanelView = "module" | "trigger" | null;
/** Option 4 tab. */
export type PanelTab = "setup" | "trigger";

export const MODULES = [
  "Incident",
  "Service Request",
  "Problem",
  "Change",
  "Release",
  "Asset",
];

export const FREQUENCIES = ["Every 2 minutes", "Hourly", "Daily", "Weekly", "Monthly"];

/** A field change that must be confirmed because it resets the trigger. */
export interface PendingChange {
  field: "kind" | "module";
  value: string;
  label: string;
}

export interface WorkflowState {
  option: OptionId;
  name: string;
  kind: WorkflowKind;
  module: string;
  scheduleType: string;
  frequency: string;
  /** true once the module config step is completed and the trigger node exists. */
  triggerReady: boolean;
  panel: PanelView;
  tab: PanelTab; // option 4
  detailsOpen: boolean; // option 5 accordion
  menuOpen: boolean; // option 2 header menu
  pending: PendingChange | null;
}

const initial: WorkflowState = {
  option: 1,
  name: "",
  kind: "event",
  module: "",
  scheduleType: "Recurring",
  frequency: "Daily",
  triggerReady: false,
  panel: "module",
  tab: "trigger",
  detailsOpen: true,
  menuOpen: false,
  pending: null,
};

type Action =
  | { type: "SET_OPTION"; value: OptionId }
  | { type: "SET_NAME"; value: string }
  | { type: "SET_KIND"; value: WorkflowKind }
  | { type: "SET_MODULE"; value: string }
  | { type: "SET_SCHEDULE_TYPE"; value: string }
  | { type: "SET_FREQUENCY"; value: string }
  | { type: "REQUEST_KIND"; value: WorkflowKind }
  | { type: "REQUEST_MODULE"; value: string }
  | { type: "CONFIRM_PENDING" }
  | { type: "CANCEL_PENDING" }
  | { type: "COMPLETE_MODULE" } // "Next" -> create trigger
  | { type: "OPEN_MODULE" }
  | { type: "OPEN_TRIGGER" }
  | { type: "SET_TAB"; value: PanelTab }
  | { type: "TOGGLE_DETAILS" }
  | { type: "SET_MENU"; value: boolean }
  | { type: "RESTART" };

function reducer(state: WorkflowState, action: Action): WorkflowState {
  switch (action.type) {
    case "SET_OPTION":
      // reset transient UI bits when switching the approach; land on the
      // natural view for the current stage so each option is discoverable.
      return {
        ...state,
        option: action.value,
        menuOpen: false,
        tab: "trigger",
        pending: null,
        panel: state.triggerReady ? "trigger" : "module",
      };
    case "SET_NAME":
      return { ...state, name: action.value };
    case "SET_KIND":
      return { ...state, kind: action.value };
    case "SET_MODULE":
      return { ...state, module: action.value };
    case "SET_SCHEDULE_TYPE":
      return { ...state, scheduleType: action.value };
    case "SET_FREQUENCY":
      return { ...state, frequency: action.value };

    // Guarded changes: once the trigger exists, kind/module need confirmation.
    case "REQUEST_KIND":
      if (!state.triggerReady || state.kind === action.value)
        return { ...state, kind: action.value };
      return {
        ...state,
        pending: {
          field: "kind",
          value: action.value,
          label: action.value === "event" ? "Event" : "Periodic",
        },
      };
    case "REQUEST_MODULE":
      if (!state.triggerReady || state.module === action.value)
        return { ...state, module: action.value };
      return {
        ...state,
        pending: { field: "module", value: action.value, label: action.value },
      };
    case "CONFIRM_PENDING": {
      if (!state.pending) return state;
      const p = state.pending;
      const next = { ...state, pending: null };
      if (p.field === "kind") next.kind = p.value as WorkflowKind;
      if (p.field === "module") next.module = p.value;
      return next;
    }
    case "CANCEL_PENDING":
      return { ...state, pending: null };

    case "COMPLETE_MODULE":
      return { ...state, triggerReady: true, panel: "trigger", tab: "trigger" };
    case "OPEN_MODULE":
      return { ...state, panel: "module", menuOpen: false, tab: "setup" };
    case "OPEN_TRIGGER":
      return { ...state, panel: "trigger", tab: "trigger" };
    case "SET_TAB":
      return { ...state, tab: action.value, panel: action.value === "setup" ? "module" : "trigger" };
    case "TOGGLE_DETAILS":
      return { ...state, detailsOpen: !state.detailsOpen };
    case "SET_MENU":
      return { ...state, menuOpen: action.value };
    case "RESTART":
      return { ...initial, option: state.option };
    default:
      return state;
  }
}

interface Ctx {
  state: WorkflowState;
  dispatch: React.Dispatch<Action>;
}
const WorkflowContext = React.createContext<Ctx | null>(null);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initial);
  return <WorkflowContext.Provider value={{ state, dispatch }}>{children}</WorkflowContext.Provider>;
}

export function useWorkflow() {
  const ctx = React.useContext(WorkflowContext);
  if (!ctx) throw new Error("useWorkflow must be used within WorkflowProvider");
  return ctx;
}
