import * as React from "react";
import {
  ChevronLeft,
  Pencil,
  MoreHorizontal,
  Settings,
  Copy,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkflow } from "@/store/workflow";

function EditableName() {
  const { state, dispatch } = useWorkflow();
  return (
    <div className="group flex items-center gap-1.5">
      <input
        value={state.name}
        placeholder="Untitled workflow"
        onChange={(e) => dispatch({ type: "SET_NAME", value: e.target.value })}
        className="w-[260px] rounded-md border border-transparent bg-transparent px-1.5 py-1 text-[15px] font-semibold outline-none hover:border-border focus:border-ring focus:bg-background"
      />
      <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

function MenuItem({
  icon,
  children,
  onClick,
  highlight,
  danger,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  highlight?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm",
        highlight && "bg-accent font-medium text-accent-foreground",
        danger ? "text-destructive hover:bg-destructive/10" : "hover:bg-muted"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function HeaderMenu() {
  const { state, dispatch } = useWorkflow();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        dispatch({ type: "SET_MENU", value: false });
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [dispatch]);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => dispatch({ type: "SET_MENU", value: !state.menuOpen })}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {state.menuOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-56 rounded-md border border-border bg-popover p-1 shadow-lg">
          <MenuItem
            icon={<Settings className="h-4 w-4" />}
            highlight
            onClick={() => dispatch({ type: "OPEN_MODULE" })}
          >
            Workflow Settings
          </MenuItem>
          <MenuItem icon={<Pencil className="h-4 w-4" />}>Rename workflow</MenuItem>
          <MenuItem icon={<Copy className="h-4 w-4" />}>Duplicate</MenuItem>
          <MenuItem icon={<Trash2 className="h-4 w-4" />} danger>
            Delete
          </MenuItem>
        </div>
      )}
    </div>
  );
}

export function TopBar() {
  const { state } = useWorkflow();
  const showMenu = state.option === 2; // header-menu approach

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-3">
      <div className="flex items-center gap-1">
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </button>
        {showMenu ? (
          <EditableName />
        ) : (
          <span className="px-1 text-[15px] font-semibold">Create Workflow</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showMenu && state.triggerReady && <HeaderMenu />}
        <Button variant="outline" size="sm">
          Save As Draft
        </Button>
        <Button size="sm">Publish</Button>
      </div>
    </header>
  );
}
