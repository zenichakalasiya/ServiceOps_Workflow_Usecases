# Conflict Detection Timing — 5 Smart Options

> **The problem (need #7).** A cross-workflow conflict spotted *while you're still building* may not be real yet —
> it can dissolve once you finish configuring the workflow (e.g. you narrow a condition and the overlap disappears).
> Showing it too early **nags and cries wolf**; hiding it risks shipping a real collision. The question underneath
> isn't *"when do we re-check?"* — it's **"what signal tells us a conflict is real enough to show yet?"**
> Five mechanisms, each using a different signal. Companion to the 5-approaches ideation
> (`see-the-version-1-swirling-kernighan` plan) and grounded in `Competitor Research — Publish Validation UX.md`.

Researched/authored 2026-06-12. Scope = V1 prototype (`app/src/App.jsx`). No code yet — design options.

---

## Option A — Confidence-graded detection (squiggle, not alarm)
**Signal: certainty of the overlap.**

Treat a conflict as **provisional → confirmed**, like a spellcheck squiggle vs. a hard error. While the overlapping
condition is still incomplete or unsaved, render it **low-weight** — a thin **dashed** "⚠ potential overlap" badge,
*not counted* in the Workflow Health card. The moment both sides are fully specified and **provably** overlap, the
badge **promotes itself** to a solid "Conflict" with a real count.

- **Feel:** ambient awareness that never blocks; loudness tracks certainty.
- **Smart because:** the conflict's *confidence* drives its *visual weight* — no false alarms, never blind.
- **Maps to V1:** add `confidence: "potential" | "confirmed"` to each conflict; `.nbadge.conf` gets a dashed/muted variant; only `confirmed` feeds the health-card count and publish gate.
- **Refs:** Make's two-tier severity vocabulary (yellow continues / red stops); inline-validation squiggle convention.
- **Trade-off:** needs a real-time "is this provable yet?" check; two visual states to design.

## Option B — Live overlap meter (watch it dissolve in real-time)
**Signal: live recomputation as you type.**

Don't show a *conflict* — show a **gauge**. In the IF/Else (or trigger) drawer, a small **"Overlaps with 2 workflows"**
meter recomputes on every condition edit and **counts down to zero** as you narrow the condition. The conflict resolves
*by construction*, and the user literally watches it happen.

- **Feel:** a feedback loop, not a warning — resolution becomes the reward.
- **Smart because:** converts a nag into live, motivating feedback; the fix and its proof are the same gesture.
- **Maps to V1:** a reactive chip in `GroupPopover`/trigger drawer that recomputes overlap against the other workflows on each edit; ties into the Resolution Toolkit's "narrow a condition".
- **Refs:** real-time form validation; password-strength meters; dashboard "live status" patterns (Smashing real-time dashboards).
- **Trade-off:** only meaningful for condition/trigger overlaps you can compute live; action-output collisions are coarser.

## Option C — Settle-gated detection (only check "finished" nodes)
**Signal: node settledness.**

Detection simply **doesn't run on a node you're actively editing**. A node becomes eligible only when it's **settled** —
saved/blurred, with no empty required fields. The conflict therefore appears a beat *after* you move on, never mid-thought.

- **Feel:** silence while building, gentle surfacing once you're done with a node.
- **Smart because:** zero interruption during the act of creation, with almost no new logic — no deferral/lifecycle state.
- **Maps to V1:** gate the `ann` badge push on a per-node `settled` flag instead of (or before) the global `reviewed` gate.
- **Refs:** Salesforce Flow moved the Errors/Warnings pane to *not* auto-open while editing — surface at the natural pause, not during.
- **Trade-off:** "settled" needs a definition (blur? explicit save?); a never-revisited node never settles.

## Option D — Suggest-the-dissolving-fix (resolution by prediction)
**Signal: computed remedy exists.**

The system computes **what single change would make the overlap vanish** and offers it *with* the conflict:
**"Add 'Status = New' here and this stops colliding with VIP Escalation."** Conflict and cure arrive together; the user
never has to diagnose.

- **Feel:** a helpful copilot — problem and one-click solution in the same card.
- **Smart because:** the NN/g Heuristic-9 ideal (explain the problem **and** offer the solution); shortest path to resolved.
- **Maps to V1:** extends Resolution Toolkit (#4) — the "Narrow a condition" fix becomes a *computed, specific* suggestion, preview-before-apply + reversible.
- **Refs:** NN/g error-message guidelines (problem + solution); Jira's condition-narrowing remediation; quick-fix / lightbulb refactors.
- **Trade-off:** needs an engine that can derive a dissolving predicate — easy for equality overlaps, hard in general.

## Option E — Quiet ledger (notification-bell model)
**Signal: user pull, not system push.**

Conflicts **never interrupt**. They accumulate in a silent counter — a **bell/pill** on the canvas ("Conflicts 3") —
and the user opens the ledger when *they* decide to. Publish still runs the final hard re-check as a safety net.

- **Feel:** maximally non-intrusive; respects the builder's flow entirely.
- **Smart because:** acknowledges that mid-build is the wrong time to demand decisions; defers to the user's rhythm.
- **Maps to V1:** a canvas-corner "Conflicts (N)" pill opening the Same-Trigger Workspace; no badges on nodes until opened.
- **Refs:** Power Automate's command-bar Flow-checker button with a red-dot badge (check-when-ready); Dify's top-right Checklist count badge.
- **Trade-off:** easy to ignore entirely → relies on the publish gate to catch the ignored; less "in your face" about real problems.

---

## Comparison

| Option | Signal it uses | Intrusiveness | Build cost | Best when |
|---|---|---|---|---|
| **A** Confidence-graded | Certainty of overlap | Low (ambient) | Medium | You want awareness without false alarms |
| **B** Live meter | Live recompute on edit | None (it's feedback) | Medium | Overlap is computable as the user types |
| **C** Settle-gated | Node finished editing | Very low | **Low** | You want a cheap "no nag while typing" win |
| **D** Suggest-the-fix | A remedy is computable | Low (helpful) | High | Overlaps are equality-based & auto-fixable |
| **E** Quiet ledger | User opens it | None until opened | Low | Builders want full control of timing |

---

## ★ Recommendation — A + B as the spine, C underneath, E for the entry point

No single option wins; the smart move is a **small composition**:

1. **A (confidence-grading)** decides *whether* a conflict shows — provisional squiggle while uncertain, solid badge when provable. This is the core anti-nag mechanism.
2. **B (live meter)** makes *resolving* it feel immediate — narrow the condition, watch the overlap hit zero. A and B together turn "annoying alarm" into "calm awareness + satisfying fix".
3. **C (settle-gating)** sits underneath both as the cheap guarantee that nothing fires while you're literally mid-keystroke.
4. **E (quiet ledger)** is the canvas entry point — a non-intrusive "Conflicts (N)" pill — so awareness never becomes a modal interruption.
5. **Parking-at-publish** (original approach #5) stays as the **safety net**, not the primary mechanism: whatever the user ignored gets a final hard re-check at publish, showing only the still-real ones.

**D (suggest-the-fix)** is the highest-value *stretch* goal — fold it into the Resolution Toolkit once the overlap engine exists, because "problem + one-click cure together" is the strongest differentiator (no competitor in the research doc does it).

**Why this composition:** it reuses what V1 already has (the `ann`/`annTop` badge engine, the `GroupPopover` drawer, `publishView` deep-links, the `reviewed` publish gate) and layers cleanly — each piece is independently shippable, and together they make conflict timing feel *intelligent* rather than *interruptive*.

### Suggested build order (when we proceed)
**C** (cheapest, immediate no-nag win) → **A** (confidence states on the badge) → **B** (live meter in the drawer) → **E** (ledger pill) → **D** (computed dissolving fix).

---

## References
- `Competitor Research — Publish Validation UX.md` — Power Automate, Salesforce, Make, Dify, Jira, n8n.
- [NN/g — Error-message guidelines (problem + solution)](https://www.nngroup.com/articles/error-message-guidelines/)
- [NN/g — Help users recognize, diagnose, recover (Heuristic 9)](https://www.nngroup.com/videos/usability-heuristic-recognize-errors/)
- [NN/g — Progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
- [Smashing — UX strategies for real-time dashboards](https://www.smashingmagazine.com/2025/09/ux-strategies-real-time-dashboards/)
- ServiceNow execution-order & Jira condition-narrowing (links in the Competitor Research doc).
