import {
  LayoutGrid,
  Ticket,
  Users,
  Repeat,
  Share2,
  Monitor,
  SlidersHorizontal,
  Box,
  Network,
  Lightbulb,
  BarChart3,
  ListChecks,
} from "lucide-react";

const ICONS = [
  LayoutGrid,
  Ticket,
  Users,
  Repeat,
  Share2,
  Monitor,
  SlidersHorizontal,
  Box,
  Network,
  Lightbulb,
  BarChart3,
  ListChecks,
];

export function NavRail() {
  return (
    <nav className="flex w-14 shrink-0 flex-col items-center border-r border-border bg-card py-3">
      <div className="mb-4 h-6 w-6 rounded-full border-2 border-primary" />
      <div className="flex flex-1 flex-col items-center gap-1">
        {ICONS.map((Icon, i) => (
          <button
            key={i}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground/70 hover:bg-muted hover:text-foreground"
          >
            <Icon className="h-[18px] w-[18px]" />
          </button>
        ))}
      </div>
      <span className="mt-2 text-[10px] font-semibold tracking-wide text-muted-foreground">
        ITSM
      </span>
    </nav>
  );
}
