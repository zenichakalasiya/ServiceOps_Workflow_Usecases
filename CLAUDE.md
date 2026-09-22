# CLAUDE.md

**On session start:** If `HANDOFF.md` exists in this directory, read it before anything else for the latest state of the work.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Deployment
Repo: https://github.com/zenichakalasiya/ServiceOps_Workflow_Usecases
Live URL: https://zenichakalasiya.github.io/ServiceOps_Workflow_Usecases/
(GitHub Pages via `.github/workflows/deploy.yml` — builds `app/` with Vite, base path `/ServiceOps_Workflow_Usecases/`.)

## What this is

UI design prototypes (not production code) for a **Motadata ServiceOps Workflow-builder feature**: detecting a stacked chain of IF/Else nodes that route on the same field and offering a safe, reversible conversion into a single **Branch** node. This is a design/UX exploration repo — there is no backend, no build, and no tests. The "source of truth" for the feature's intent, use cases, correctness rules, and decisions is **`IF-Else to Branch — Design Documentation.md`** — read it before changing prototype behavior.

## Files

- **`app/`** — the **active project and single source of truth**: a Vite + React dev environment (the UC1 prototype). This is what to iterate on.
- **`IF-Else to Branch — Design Documentation.md`** — the design spec: 3 use cases, the "one engine, three surfaces" model, correctness/trust rules, gap analysis, and resolved decisions.
- **`archive/`** — superseded standalone single-file prototypes, **kept only for reference, do not edit or view as "current"** (viewing them caused repeated "my change isn't showing" confusion, since they diverged from `app/`):
  - `archive/UC1 - Live Inline Optimize.html` — the original single-file UC1 that `app/` was ported from.
  - `archive/IF-Else to Branch Cleanup.html` — earlier 3-option explorer (inline chip / pre-publish drawer / dedicated panel) over a shared `useCleanup` hook.
  - `archive/IF-Else to Branch Cleanup.backup.html` — backup of the explorer.

## Running / iterating

**Use the Vite dev server** (run commands from `app/`):

```
cd app
npm install      # first time only
npm run dev      # http://localhost:5173  (HMR — edits hot-reload, no cache)
npm run dev:v2   # http://localhost:5174 — same app, but the publish review renders PublishHealthV2.jsx (stacked cards) instead of the V1 tabs PublishPopover; switched by VITE_PUBLISH_V2 via .env.v2
#   http://localhost:5173/conflict-timing.html — standalone interactive demo of the 5 "conflict detection timing" options
#   (separate Vite HTML entry → src/conflict-timing.jsx + .css; reuses `Ic` from App.jsx). Companion to "Conflict Detection Timing — 5 Smart Options.md".
npm run build    # production build to app/dist
npm run preview  # serve the production build locally
```

There is **no linter or test runner** — this is a design prototype. HMR replaced the old single-file workflow specifically because in-browser Babel + `file://`/IDE-preview caching made edits appear not to take effect (stale renders). With the dev server, saved edits reflect immediately. Fonts still load from a CDN (`<link>` in `app/index.html`), so internet is needed for the typeface.

The `archive/*.html` prototypes still run by opening them directly in a browser (in-browser Babel, no build), but they are **stale and divergent** — never treat them as the current design. Always iterate and verify in `app/` on `localhost:5173`.

## Prototype architecture

The active code lives in **`app/src/App.jsx`** (one module: icons → data → layout engine → components → `Workflow` → `App`) and **`app/src/index.css`** (all styles). It renders a fake ServiceOps app shell (nav + left rail + header) filling the window, plus a node-graph canvas and a right-side configuration drawer. The standalone HTML shares this structure inline but has **diverged** — treat `app/` as the source of truth.

- The default-exported **`App`** is just `<div id="app"><Workflow/></div>` — **no presentation frame**. `#app` fills the window (`width/height:100%`; `html,body,#root` are `height:100%`); the builder UI is the **`Workflow`** component. (The old `#chrome` bar + `#stage`/`#fit` scale-to-fit wrapper was removed; it still exists only in the standalone HTML.) Because there's no scale transform, `window.__scale` is never set and defaults to `1` in `startDrag`, so drag deltas map 1:1 to canvas coordinates.
- **`Ic` / `I`** — an inline SVG icon set (`Ic.branch`, `Ic.ifelse`, etc.) used across the canvas/drawer. The left rail (`.rail`, component `Rail`) is separate: it was ported pixel-for-pixel from the Figma "Nodebase-Workflow" file's `SideMenu` node and renders from real exported icon assets in **`app/src/assets/rail/`** (not the `Ic` set) — `RAIL` in `App.jsx` maps each row to its asset + active/cls flags. See `## Handoff` for the sync's status/open items.
- **Theme** — Nunito Sans + CSS custom properties in `:root` (primary blue `#2680eb`). Match the existing tokens/shadows when adding UI; keep styles in **`app/src/index.css`**.

### Active app (`app/src/App.jsx`)

- **Position-driven layout engine:** `buildBefore(pos, converted2)` / `buildAfter(pos, converted2)` compute node boxes and then derive edges/labels from node port positions; `pos` is a per-node override map so nodes are draggable. `frame()` grows the scrollable content to `furthest node + margin`. `edgePath()` draws orthogonal SVG connectors (straight line if aligned, else out to mid-x, vertical, then in); port helpers are `ft/fb/rm/lm` (flow-top/bottom, right/left-mid). Incoming wires meet a node at its **title row** (`TITLE_PORT`) via a `leftIn` input dot. The "before" graph is a `Group`-lassoed column of IF/Else nodes, **each Is-True routed to its own next node** (`NEXTS`); converting (`buildAfter`) replaces the group with **one Branch node that has one branch per condition (1:1)**, each branch output rewired to that condition's same next node.
- **Two convertible groups.** Group 1 is the main 7-condition chain (`converted`, node id `branch`). Group 2 is a 4-node nested IF/Else chain (`NEST_CONDS`) hanging off the "Get Assets" action; `buildNested(NESTX, act1, converted2, pos)` renders it as a lassoed IF/Else column or, when `converted2`, as its own Branch node (id `nbranch`). Both builders call it, so the two conversions are independent (`converted`/`converted2`, `optDismissed`/`optDismissed2`, `apply/undo` vs `apply2/undo2`).
- **Node "selected" class is `.nsel`, NOT `.sel`.** `.sel` is the drawer's dropdown/select-field class (`display:flex; justify-content:space-between`); reusing it on a graph node made the node a horizontal flex row whenever it was selected (i.e. whenever the group drawer was open). Keep node-selection on `.nsel` (border/shadow only) to avoid that collision.
- **IF/Else node geometry** is fixed by the constants `IFW/IFH/IF_PORT/ELSE_PORT`. The node stacks four rows like the real ServiceOps node (`.gif-title` → `.gif-iftag` → `.gif-cond` full-width truncating condition box → `.gif-elsetag`); `IF_PORT` is the condition box's vertical center (green "Is True"), `ELSE_PORT` the Else tag's center (red "Is False"), so dots and wires stay aligned while dragging.
- **State** lives in `Workflow` (not `App`), bundled into one `S` object passed to every component. `selected` picks the right-side drawer: `"group"` (IF/Else, open by default) / `"branch"` / `"trigger"` / `"action"` (uses `selectedAct`) / `"publish"` / `null` — rendered by the matching `*Popover` component. `startDrag` does node dragging (3px threshold distinguishes click-to-open from drag). Other state: `pos`, `toast`, `preview` (convert preview modal), `flash` (pulse a node after "Show on canvas"), and the publish-review state below.
- **Publish review flow** (the Publish button → `PublishPopover` in the drawer): a simulated 1.4s "draft pass" then a findings list driven by the static `REVIEW` data (errors / warnings / conflicts / fixes — the fixes are the two IF/Else→Branch conversions, applied via `applyFix1/2` without leaving the review). Errors block publishing; warnings are acknowledged; the conflict has its own sub-screen. `publishView` (`"review" | "fixes" | "conflict"`) is lifted to `Workflow` so the canvas can deep-link into a sub-screen. Resolution state (`resolved`, `acked`, `confResolved`, `reviewed`) is also lifted: once `reviewed`, unresolved findings render as live severity badges on their canvas nodes (`ann`/`annTop`), and `showOnCanvas(tgt)` scrolls to + flashes the target node — remapping `if*`→`branch` / `nest*`→`nbranch` if a group was already converted.
- **Conflict awareness:** `CONFLICT_WF` describes the other workflow ("Workflow 12 · VIP Escalation") that shares the trigger. `ConflictPanel` is an anchored "Same-trigger workflows" panel at the trigger node (`confPanel`); clicking the other workflow opens `ConflictPreview`, a read-only modal (`confPreview`). Resolving (only "Allow both" is enabled; merge is "coming soon") clears the conflict from the review and its canvas badge.
- **Drawer scroll — known footgun.** The drawer (`.sp`) is `position:absolute` so opening/closing never reflows the graph, and `.sp-scroll` scrolls internally. For that scroll to work, **every flex ancestor in the chain must carry `min-height:0`** — including the **top-level `Workflow` wrapper `<div style={{flex:1,...,minHeight:0}}>`** (the one that bit us: a single missing `min-height:0` there let the wrapper grow past `#app` and broke the drawer's bounded height). The chain is wrapper → `.body` → `.work-main` → `.work` → `.canvas`/`.sp` → `.sp-scroll`.
- Demo data: `CONDS` (7 conditions) each become a separate IF/Else node; `NEXTS[i]` is each one's Is-True next node ("Create Requests", "Get Assets"→nested sub-flow, "Update Assets", "Get Requests", "Send a mail…"; last two unattached — that gap is also review warning `w1`). Converting → **one Branch, 7 paths (one per condition) + Default**, each path wired to that condition's `NEXTS[i]`. Branch geometry constants (`BR_HEADER/BR_PAD/BR_ROW/DEF_ROW/FOOTER`, `brRowCY`) are module-level so `buildBefore`/`buildAfter`/`buildNested` and the Branch renderer agree on row centers.

### `archive/IF-Else to Branch Cleanup.html` (reference only)

- Shared `useCleanup()` hook drives all three options; `CATS` is `[category, team]` data; `BranchFlow`/`IfLadder`/`MappingTable`/`ScopeControl`/`ConvertModal` are shared views. The "Merge identical destinations" toggle groups conditions that share a destination team into one branch.

## Domain constraint that governs conversion correctness

The ServiceOps **Branch node runs *every* matching path, not just the first** (a chained IF/Else is first-match). Therefore a conversion is only behavior-preserving when the conditions are **mutually exclusive** (e.g. same-field equality on a single-valued field). Any detection/merge logic must respect this gate — see §3 and §5 of the design doc. Conversions are presented as **non-destructive, reversible (Undo), preview-before-apply, and dismissable** — preserve those guarantees in any UI change.

## Handoff
Latest session state is in [HANDOFF.md](HANDOFF.md) — read it first.
