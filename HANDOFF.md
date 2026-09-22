# Handoff — 2026-09-22 12:24

## Read first
See `CLAUDE.md` — specifically the "Prototype architecture" section's note on `.rail`/`Rail`, and "Running / iterating" for how to start the dev server.

## What we worked on this session
Ported the left icon rail's styling from the Figma file "Nodebase-Workflow" (`SideMenu` node, `node-id=213:22710`) into `app/`, replacing the old inline-SVG rail with pixel-accurate exported assets and CSS.

## Completed
- Connected the Figma MCP to the correct account (the original account only had a View seat and no file access; re-authenticated via `/mcp` → `figma-desktop`/`figma` after the user upgraded/switched accounts).
- Read `SideMenu` (54px icon rail, node `213:22710`) via `get_design_context` and exported its 16 real icon/logo SVGs into `app/src/assets/rail/`.
- Rebuilt `Rail` in `app/src/App.jsx`: logo mark at top, 13 icon rows (`RAIL` array now holds `{k, src, on?, cls?}` instead of the old `Ic`-based icon keys), bottom ITSM label + small logo.
- Rewrote `.rail*` styles in `app/src/index.css` to match Figma exactly: 54px width, `#f9fafb` bg, `#dfe5ed` right border, 40px-tall rows with a 3px left active-bar accent, 24px icon boxes at the Figma-specified offsets, and the "ITSM" label in Poppins 600/16px/`#3279be` rotated -90°.
- Added the Poppins font `<link>` to `app/index.html` (rail needed it; rest of the app still uses Nunito Sans).
- Verified visually with Playwright against `localhost:5173` — rail screenshot matches the Figma screenshot.

## In progress
Nothing mid-flight on the rail itself. One open design decision (see Next steps) is unresolved — the user hasn't answered it yet.

## Next steps
- **Waiting on user:** the same Figma section also has a 249px-wide second sidebar panel (`Final Sidebar 2`, node `487:27284` — "Overview" header, section groups like "Intelligent Automation / Automation, AI", "Platform Configuration", "Service Desk", etc., each row with a chevron). Asked the user whether to build this as a new panel next to `.rail`, or whether the 54px rail alone was the full ask. Not started — do this only once they answer.
- If they want it built: its `get_design_context` output was already fetched this session (not re-fetched into files, but the row/section pattern is simple — repeating `[label + chevron-down icon]` rows grouped under uppercase-ish 11px section headers, all on a white bg, 249px wide, 6-8px row gaps). Re-fetch node `487:27284` (fileKey `ZzUz2GRbzdOZjnxOc55VDq`) if the reference code is needed again.
- Nothing else queued.

## Decisions made
- Used the Figma `SideMenu` node's real bar-accent color (`#3d8bd0`) and a light hover background for the "active" row, since every accent bar in the Figma file is authored at `opacity:0` (no visible active state to copy 1:1) — applied it to the Repeat/loop icon, matching which row was previously marked active in the old rail.
- Kept the rail's icons as literal exported SVG assets (not redrawn/hand-authored), per the figma-design-to-code skill's icon-fidelity rule — assets live in `app/src/assets/rail/` and are committed rather than referencing the `localhost:3845` Figma dev-server URLs (which only work while Figma desktop is open).

## Gotchas & notes
- The Figma MCP's default connected account only had a **View** seat with no access to this file — `get_design_context`/`get_screenshot`/`get_variable_defs` all failed with "don't have edit access" until the user re-authenticated to a different account via `/mcp`. The `figma-desktop` server (talks to the Figma desktop app directly) worked once that was sorted, and doesn't have the same seat gating as the `figma`/`figma-remote-mcp` remote servers.
- The full screen node (`1131:83958`, "Workflow Final") is huge (~960K chars) — `get_design_context`/`get_metadata` on it exceed the tool's token limit. Always drill into the specific child node (e.g. the `SideMenu` instance) instead of requesting the whole section.
- Uncommitted changes exist from before this session too (`app/vite.config.js` was already modified going into this session, unrelated to the rail work) — check `git diff` before assuming everything in `git status` is from the rail change.
