import { WorkflowProvider } from "@/store/workflow";
import { OptionSwitcher } from "@/components/builder/OptionSwitcher";
import { NavRail } from "@/components/builder/NavRail";
import { TopBar } from "@/components/builder/TopBar";
import { Canvas } from "@/components/builder/Canvas";
import { SidePanel } from "@/components/builder/SidePanel";
import { WarningDialog } from "@/components/builder/WarningDialog";

export default function App() {
  return (
    <WorkflowProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
        <OptionSwitcher />
        <div className="flex min-h-0 flex-1">
          <NavRail />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar />
            <div className="flex min-h-0 flex-1">
              <Canvas />
              <SidePanel />
            </div>
          </div>
        </div>
        <WarningDialog />
      </div>
    </WorkflowProvider>
  );
}
