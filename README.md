# ServiceOps Workflow Builder — UX Prototypes

UI/UX design prototypes for a **Motadata ServiceOps Workflow-builder** feature set. These are
design explorations (not production code) for a node-based workflow canvas, built as a Vite + React
dev environment.

## What's inside

- **`app/`** — the active prototype (Vite + React, hot-reload). Single-page workflow builder with a
  node-graph canvas and a right-side configuration drawer. This is the source of truth.
- **`IF-Else to Branch — Design Documentation.md`** — the design spec (3 use cases, correctness rules,
  decisions).
- **`Competitor Research — Publish Validation UX.md`**, **`Conflict Detection Timing — 5 Smart Options.md`**
  — supporting research/ideation.
- **`archive/`** — superseded single-file HTML prototypes (reference only).
- **`src-reference/`** — a reference shadcn/Tailwind module-config panel used to mirror one sidebar.

## Features prototyped

- Detecting stacked **IF/Else** chains and converting them to a single **Branch** node (non-destructive, reversible, preview-first).
- **Pre-publish review** — Workflow Health (draft-pass ring), errors / warnings / conflicts / fixes with progressive disclosure.
- **Cross-workflow conflict** awareness — node-level and sub-flow (chain) conflicts, with a same-trigger comparison and resolution.
- **Merge node** — converge multiple IF/Else paths, with multi-input connectors and config.
- **Node Selection / Module Configuration / Command bar** sidebars, sticky canvas toolbar, zoom/pan, sticky notes.

## Running

```bash
cd app
npm install      # first time only
npm run dev      # http://localhost:5173  (HMR)
npm run dev:v2   # http://localhost:5174  (alternate publish-review variant)
npm run build    # production build to app/dist
```

> Built with [Claude Code](https://claude.com/claude-code).
