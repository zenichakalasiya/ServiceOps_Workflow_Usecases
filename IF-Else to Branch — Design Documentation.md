# IF/Else → Branch Optimization — Design Documentation

> Status: **Brainstorm + Research + Design doc** (pre-implementation). Per the working agreement, this phase is research & documentation only. Live conversion functionality is the **next** design phase. For now, every preview shows IF/Else → **a single Branch**.

---

## 1. Context — why this exists

In the ServiceOps node-based Workflow builder, an **IF/Else node is a binary (True/False) split**. To route one field (e.g. `Category`) to many teams, users *chain* IF/Else nodes through the Else (False) path:

```
IF Category = Network  → assign Network Team
ELSE → IF Category = Hardware → assign Desktop Support
       ELSE → IF Category = Software → assign Apps Team
              ELSE → … (10–30 deep)
```

This "ladder" is an industry-recognized anti-pattern — it becomes **workflow spaghetti**: hard to scan, reorder, and maintain. The **Branch node** does the same job in **one node**: N condition-paths + a Default. (Confirmed by n8n/Make/Zapier guidance: *"three-plus outcomes on one field should almost always be a Switch."*)

**The opportunity:** detect these IF/Else ladders and *offer* — never force — a safe, reversible conversion into a Branch, so the workflow stays organized and follows best practice.

**Hard constraints (user-set):**
- This is a **suggestion, not a required step.** It must be **non-blocking** and always **dismissable ("neglect")**.
- The conversion must be **non-destructive and reversible (Undo)**.
- A **preview** is always shown before applying.
- The user must **trust** that converting does **not change the output** of their conditions.

**The realization that reframes the original prototype:** A real workflow contains **multiple groups** of IF/Else scattered between other nodes (trigger → group A of 5–6 conditions → 1–2 action nodes → group B of 7–8 conditions → …). So there can be **2, 3, 4+ convertible groups**. The original "Option 1" (inline canvas chip) is correct but **scoped to one group at a time** — it cannot, by itself, represent *all* groups. That's not a flaw; it's the right tool for one trigger context. The other contexts (publish-time, returning to an existing workflow) need an **aggregated, multi-group** surface. This doc reframes the three "options" as **three trigger contexts (use cases) over one shared engine.**

---

## 2. The governing idea — one engine, three surfaces

The cleanest, most scalable execution is **NOT three separate features**. It is **one Optimization (lint) Engine** that detects convertible groups and emits **findings**, rendered through **three surfaces** that share the same preview / apply / undo / side-panel machinery.

This mirrors the proven IDE pattern:

| IDE concept | Our equivalent | Use case |
|---|---|---|
| Light bulb / Quick Action on the line you're editing | Inline node highlight + minimal tooltip | **UC1 – live** |
| "Problems" panel aggregating all issues | Pre-publish panel with all groups + tabs | **UC2 – pre-publish** |
| Re-opening a file and seeing existing diagnostics | On-open CTA listing existing groups | **UC3 – existing workflow** |
| Refactor **Preview** (side-by-side before applying) | Before/after preview screen (single Branch) | all three |
| Undo | Non-destructive revert | all three |

### 2.1 Shared data model — the "finding"
A single detection pass produces a list of `OptimizationFinding` objects. Every surface renders from this list.

```
OptimizationFinding {
  id
  type: "ifelse-ladder-to-branch"        // future: other optimizations reuse the engine
  nodeIds: [...]                          // the chained IF/Else nodes in this group
  sourceField(s): ["Category", ...]       // field(s) the ladder routes on
  conditions: [{ when, action/nextNode }] // each rung
  finalElse: { isEmpty, nextNode }        // becomes the Default branch
  proposal: {
    branches: [{ name, match:Any|All, conditions:[...], nextNode }],
    default:  { nextNode },
    mergedFrom: N, branchCount: M          // e.g. 18 → 15 when merging same-destination
  }
  savings: { nodesRemoved, depthReduced }
  reason: "why this helps" (context copy)
  status: suggested | previewed | applied | dismissed
}
```

### 2.2 Shared building blocks (identical in all 3 use cases — user-confirmed)
- **Neglect / dismiss** affordance (per finding + a global "don't suggest again").
- **Optimize** action → opens **Preview**.
- **Preview** screen: current stacked IF/Else **vs** resulting single Branch, with the **per-condition mapping** table (which IF → which Branch path; which ones merge).
- **Side-popover (config panel) swap**: on apply, the node's config panel transitions from the **IF/Else form** to the **Branch form**, pre-filled with all conditions fitted in.
- **Node change** on canvas (ladder collapses to one Branch node) — **non-destructive**, with **Undo**.
- **Trust messaging**: explicit "same output, behavior unchanged, reversible anytime."

> Already prototyped in `IF-Else to Branch Cleanup.html`: the single-group engine (`useCleanup`), the realistic Branch view (`BranchFlow`), `ScopeControl` (convert all / range + "Merge identical destinations" toggle), `PreviewColumns`, and `MappingTable`. The next phase generalizes these from **one group** to a **list of findings**.

---

## 3. Domain model — what is a convertible "group"?

A **convertible group** = a maximal chain of IF/Else nodes linked through their **Else (False)** path, that satisfies the conversion rules. Detection must define the boundary precisely.

**Group definition (user-confirmed):** a group = **more than 5 consecutive IF/Else blocks (≥6)** that **can be combined into a single Branch** — i.e., instead of 15–20 stacked IF/Else, one Branch. The "can be combined" qualifier is doing real work: see the mutual-exclusivity gate below.

**Detection heuristics (v1):**
- **Linear Else-chain only:** each node's *True* path leads to its own action/sub-flow; the *Else* leads to the next IF. (Trees where the *True* path also branches are out of scope for v1.)
- **Minimum size threshold:** suggest only when the chain length is **> 5 (≥6)**, configurable, to avoid nagging on a genuine 2-way IF.
- **⚠ Mutual-exclusivity gate (REQUIRED — drives correctness):** because the ServiceOps Branch **runs *every* matching path, not just the first** (user-confirmed), a first-match IF/Else ladder converts safely **only when at most one path can ever match.** The engine must **only suggest groups it can prove are mutually exclusive.** Same-field equality on a **single-valued** field (one `Category` per ticket) satisfies this automatically. If exclusivity can't be proven (overlapping ranges, multi-valued field, mixed operators), **do not auto-suggest** — at most warn. See §5.
- **Same-field affinity (primary signal):** every rung tests the **same source field** with equality (Category = X) — the safest case, and the one that *guarantees* the exclusivity gate. This is what n8n flags as "should be a Switch."
- **Mixed-field chains (later):** rungs testing *different* fields can still map to Branch paths, but exclusivity is no longer guaranteed and "route on `Category`" copy/merge logic doesn't apply → **Phase C**, suggested conservatively.
- **Group boundary:** a non-IF/Else node (action) between two IF/Else nodes **ends a group and starts a new one** → that's how we get multiple groups in one workflow.

**Branch count within a group (already designed):**
- **Literal 1:1** — one branch per rung.
- **Merge by identical destination** (recommended) — rungs whose downstream output is identical collapse into one branch via `In [a, b]` / `Match Any` (e.g. Network + VPN → Network Team). Safe **only** when destinations are identical AND conditions are mutually exclusive.
- A **"Merge identical destinations" toggle** lets users flip between the two.

---

## 4. The three use cases

Each section: **Problem → Trigger → Solution → UI**. Shared building blocks (§2.2) apply to all; only the **entry point and aggregation level** differ.

### Use Case 1 — Live, while configuring (single group, in-context)

- **Problem:** The user is actively building. They just finished one group (6–7 conditions) and saved it. If we say nothing, they keep laddering and never learn the better structure. But interrupting mid-typing would be hostile.
- **Trigger:** Fires **after the group is committed/saved** (not on every keystroke) and the chain crosses the threshold. Debounced; never blocks editing.
- **Solution:** Calmly **highlight that one group's nodes** on the canvas and show a **minimal tooltip** beside it: *"Optimize these conditions into a Branch."* Because the user will think *"why would I?"*, the tooltip must carry a **one-line "why"** (e.g. *"7 IF/Else steps route on Category — a Branch does this in one node, easier to scan & reorder"*) with a **"See preview"** primary and a **dismiss (×)**. Clicking → **Preview screen** → on apply, the **side-popover swaps IF/Else → Branch** with all conditions fitted, and the ladder collapses to one Branch node. Trust line reassures "same output."
- **UI:** light-bulb-style inline affordance scoped to **one** group. This is the original Option 1, **correctly scoped** — it is *not* meant to show all groups (that's UC2/UC3).

### Use Case 2 — Pre-publish / save-as-draft (all groups, aggregated)

- **Problem:** The whole workflow is built and may contain **several** convertible groups. At the moment of finalizing, the user is in a "review & tidy" mindset — the right time to surface *everything* at once.
- **Trigger:** On **Save as Draft** or **Publish** click, run a full-workflow detection pass.
- **Solution:** Two coordinated views:
  1. **Canvas:** **highlight all detected groups simultaneously**, each as a distinct **lasso/bounding overlay** with a numbered badge (*"Group 2 · 8 IF/Else → 1 Branch"*) in a **calm suggestion hue** (blue/purple — deliberately *not* error-red).
  2. **Side panel:** an **"Optimizations" tab placed below the description**, listing **each group as its own card** (location, count, savings, why, Preview/Convert/Dismiss). The **tab structure is intentional and scalable** — future tabs: **Errors · Warnings · Conflicts**. Suggestions live here precisely because they **never block publish** (errors would).
- **Interaction:** hovering a card highlights its lasso on canvas and vice-versa; clicking a card opens that group's Preview; "Convert all" / per-group convert both supported; dismiss removes a card without blocking publish.
- **UI:** the "Problems panel" analogue — aggregated, multi-group, tabbed for scale.

### Use Case 3 — Returning to an existing workflow (all groups, on-open)

- **Problem:** A user opens a workflow built earlier (their own or a colleague's) that already contains, say, **3 groups of 5+ IF/Else** with actions between them. They didn't build it now, so there's no "just saved" moment — but the cleanup value is highest here.
- **Trigger:** On opening a workflow, a background pass detects existing groups and shows a **non-intrusive CTA** (e.g. a badge/pill near the header: *"3 structure optimizations available"*).
- **Solution:** The CTA opens the **same side panel as UC2** (name, description, listed groups with full info as in UC1). Conversion is offered in **both** places so it's never a chore:
  1. **On the canvas** — clicking a highlighted group shows the **small info card** (same as UC1's tooltip) with Preview/Convert/Dismiss.
  2. **In the side panel** — review/convert/fix **all** groups from one place.
- **UI:** identical machinery to UC2, but **entry is a deliberate user action** (open the panel) rather than auto-firing at publish — appropriate because the user is exploring, not finalizing.

### 4.1 How the three relate (the key clarification)
- **UC1 = one group, pushed to you in-context** (light bulb).
- **UC2 = all groups, pushed to you at publish** (problems panel).
- **UC3 = all groups, pulled by you on open** (re-open diagnostics).
- All three reuse **one engine, one finding model, one preview, one apply/undo, one side-panel.** Build the engine + shared components once; the three surfaces are thin entry points.

---

## 5. Correctness & trust — the "same output" guarantee

This is the make-or-break of the feature. The conversion is behavior-preserving **only if** these hold; the UI must encode them.

1. **⚠ Evaluation model — the central fact.** ServiceOps' Branch **executes *every* branch whose condition matches** (confirmed), *not* just the first. An IF/Else ladder is **first-match, top-to-bottom**. These two are equivalent **only when at most one path can ever match** — i.e. the conditions are **mutually exclusive**. Therefore: conversion is behavior-preserving **iff the group is mutually exclusive**, and the engine must **gate every suggestion on a proven exclusivity check**. Same-field equality on a single-valued field guarantees it; anything that can't be proven exclusive is **not suggested** (or is shown as a warning, never an auto-apply).
2. **Single-valued source field.** Exclusivity for `Category = X` rungs holds **only if `Category` is single-valued**. If the field can hold multiple values, two rungs could both match → the all-match Branch would run both while the ladder ran one. **Verify the field is single-valued** as part of the gate.
3. **Mutual exclusivity for merges.** Merging rungs into one branch (`In [a,b]`) is safe when their downstream output is identical **and** the merged values are distinct — which, under all-match semantics, also keeps the merged branch from double-firing. Same-field equality guarantees this.
4. **Downstream sub-flows.** Each rung's *True* path may contain **more than one node** (a sub-flow), not just "assign team." Conversion must **re-point each Branch path to that exact sub-flow**, and preserve any **re-convergence** point where paths rejoin.
5. **Non-empty final Else.** The final Else may carry real actions → those become the **Default branch's** next node, not a no-op.
6. **Source-node binding.** The Branch's "Select Source Node" must resolve to the same data the IF conditions read.
7. **Validation.** Converting must **never turn a valid workflow invalid** (e.g. leaving a required Branch field unset). If it would, surface it before apply.
8. **Reversibility.** Keep the original IF/Else definition so Undo restores it **exactly**, even after save.

**Trust devices in UI:** explicit before/after preview, the per-condition mapping table (auditable row-by-row), a persistent "same output · reversible" line, and Undo everywhere.

---

## 6. Gaps, edge cases & conflicts I found (beyond the brief)

Grouped by theme. **[H]** = should resolve before build, **[M]** = design-time decision, **[L]** = later.

**Correctness / semantics**
- **[H] Branch is all-match (RESOLVED).** Branch runs *every* matching path → conversion is safe **only for mutually-exclusive groups.** The exclusivity gate (§3, §5.1) is now the engine's primary safety requirement, not an afterthought.
- **[H] Single-valued field check** — exclusivity of `Category = X` rungs depends on `Category` being single-valued (§5.2). Multi-valued fields break the guarantee.
- **[H] Sub-flow re-wiring & re-convergence** — rungs with multi-node True paths and a shared continuation node (§5.4). The prototype's "assign team" is a simplification.
- **[M] Non-empty final Else** becomes a real Default action (§5.4).
- **[M] Heterogeneous-field ladders** — convertible but "route on Category" copy/merge logic doesn't apply; suggest more conservatively.
- **[M] Overlapping / duplicate conditions** in the ladder (two rungs that can both match) — ordering must be preserved; flag, don't silently merge.
- **[M] Conditions referencing different source nodes / variables** across rungs — single Branch source-node model may not fit.

**Structure / topology**
- **[M] Nested IF trees** (True path also branches) — out of scope v1; detection must *recognize and skip* them, not mis-convert.
- **[M] Group-boundary ambiguity** — interleaved IF/action/IF; define exactly where one group ends and the next begins.
- **[L] Mixed AND/OR (Match All/Any)** within a rung — maps to Branch `Match All/Any`; verify fidelity.

**Detection / noise control**
- **[M] Minimum threshold** — don't suggest on a legitimate 2-way IF; user said >5/>10 — pick a default (≥5) and make it tunable.
- **[M] Don't mis-flag an intentional binary IF** as needing a Branch.
- **[L] Performance** on very large workflows; debounce live detection (UC1).

**Lifecycle / state**
- **[H] Dismissal persistence & scope** — per-group? per-workflow? forever vs. session? Where is "neglect" remembered so it doesn't re-nag?
- **[M] Re-suggestion / cooldown after Undo** — if a user converts then undoes, don't immediately re-suggest the same group (anti-nag cooldown).
- **[M] Manual re-laddering** — user converts to Branch, later edits it back into IFs; should we re-detect?
- **[M] Undo granularity** — undo one group vs. all; and after Save/Publish.

**Trust / safety**
- **[M] Post-conversion validation** (§5.6) — never break a valid workflow.
- **[M] Auto-naming branches** — n8n best practice is to name each output; auto-name from the condition value ("Network", "Hardware") so the Branch is readable.
- **[L] Audit/version history** — record the conversion as a reversible change in workflow history.

**Platform / ops**
- **[L] Roles & permissions** — can every editor apply optimizations, or only certain roles?
- **[L] Analytics/telemetry** — track suggested → previewed → applied → dismissed to measure whether the nudge actually helps (and tune the threshold).
- **[L] Accessibility** — keyboard access to the lasso/tooltip; color must not be the only signal (pair hue with icon/label).
- **[L] Localization** — the "why" copy and labels.
- **[M] Open-editor conflict** — if the user is already editing the exact node in the side-popover when they trigger Optimize, the IF→Branch swap must handle the open editor gracefully (save/confirm, don't lose input).

---

## 7. Phasing

1. **Phase A (now):** this documentation + agreed approach + resolved decisions.
2. **Phase B (next — "design you'll create"):**
   - Build the **shared foundation first**: detection engine (same-field, ≥6, exclusivity-gated), the **findings list** model, and the **preview + per-condition mapping** (single Branch, mocked behavior).
   - Then ship **UC1 (live inline)** first as the initial surface: per-group node highlight + minimal "why" tooltip → preview → side-popover IF/Else→Branch swap → Undo.
   - **UC2 (pre-publish tabbed panel + canvas lassos)** and **UC3 (on-open CTA)** attach as thin surfaces over the same engine afterward.
3. **Phase C (later):** live conversion — real sub-flow re-wiring & convergence, single-valued-field validation, dismissal persistence, mixed-field chains, telemetry.

---

## 8. Artifact & verification

- **Primary artifact:** `d:\Zeni\Workflow-usecase-IFElse to Branch\IF-Else to Branch Cleanup.html` (single-file React + Babel prototype; open directly in a browser — no build step). Backup: `IF-Else to Branch Cleanup.backup.html`.
- **Verify (design phase):** open the HTML, switch across the three surfaces, confirm: multiple groups detected & highlighted; each group's tooltip/card carries a "why"; preview + per-condition mapping shown before apply; "Merge identical destinations" toggles branch count; dismiss/neglect works per-group and never blocks publish; Undo restores the original ladder.

---

## 9. Decisions (resolved)

1. **Branch evaluation semantics → ALL matching paths run.** ⇒ Conversion is only behavior-preserving for **mutually-exclusive** groups; the engine gates on a proven exclusivity check (§3, §5.1–5.2). This is the most important design constraint in the doc.
2. **Group definition → more than 5 (≥6) consecutive IF/Else blocks that can combine into one Branch.** "Can combine" = passes the mutual-exclusivity gate. Phase B targets **same-field equality** groups (which guarantee the gate); mixed-field chains are Phase C.
3. **Build sequence → UC1 (live inline) first.** Note: we still build the **shared engine + findings model + preview/mapping underneath UC1**, so UC2/UC3 attach as thin surfaces afterward (no throwaway work).
4. **Dismissal scope → per-group permanent + a global opt-out switch** (chosen as the best balance: respects intent per-group, with one switch to silence all suggestions). Dismiss never blocks publish.

**Still to confirm with eng/product during Phase C (not blocking Phase B mock):** single-valued-field metadata source (§5.2), sub-flow re-wiring/convergence model (§5.4), dismissal persistence storage.

---

## 10. References (research)

- n8n Switch vs IF (3+ on one field → Switch; rename outputs): https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch/ · https://n8n.blog/n8n-if-switch-conditional-routing-guide/ · https://madebyaime.com/blog/n8n-if-node-guide/
- First-match evaluation order, Default fallback, optional multi-match: https://docs.losant.com/workflows/logic/switch/ · https://www.intercom.com/help/en/articles/7846212-using-branches-in-workflows · https://zapier.com/blog/zapier-paths-conditional-workflows/
- Non-blocking suggestion UX: https://medium.com/@sophie_paxtonUX/stop-getting-in-my-way-non-blocking-ux-5cbbfe0f0158 · https://ui-patterns.com/patterns/inline-hints
- IDE "Quick Action / light bulb → Refactor Preview → Undo" pattern: https://learn.microsoft.com/en-us/visualstudio/ide/quick-actions?view=vs-2022 · https://code.visualstudio.com/docs/editing/refactoring
