# Pre-publish validation UX in workflow/automation builders — research report

> Companion research for the **Publish Health V2** panel (`app/src/PublishHealthV2.jsx`): how competitors surface
> errors/warnings/conflicts/fixes before publish, plus UX option recipes for the stacked-cards design.
> Researched 2026-06-12.

Scope: how 9+ SaaS workflow builders surface errors/warnings/blockers before publish/activation, plus generic severity-grouping and progressive-disclosure patterns — mapped to the 4-section stacked-card publish-review panel (Errors / Warnings / Conflicts / Fixes).

---

## 1. Per-product findings

### 1.1 n8n
- **Where it lives:** No dedicated validation panel. Validation is **node-inline + activation-time gating**. Nodes with unresolved "issues" (missing required parameters, missing credentials) show a **red/orange warning triangle badge on the node card**; hovering shows a tooltip listing the issues, and opening the node shows the offending fields.
- **Grouping:** By node only — there is no aggregated list grouped by severity.
- **Blocking:** Activation is hard-gated: toggling Active fires a toast — *"Problem activating workflow. Please resolve outstanding issues before you activate it."* No partial publish.
- **CTAs:** None beyond the toast; the user must visually hunt for the badged node. This is n8n's documented weakness: users report the error *"without clearly indicating which node contains the problem"* — "no node is displaying an error in my Workflow" yet activation fails ([community thread](https://community.n8n.io/t/unclear-message-problem-activating-workflow-please-resolve-outstanding-issues-before-you-activate-it/30215)); GitHub issue [#12166](https://github.com/n8n-io/n8n/issues/12166) calls the toast *"Workflow could not be activated: Validation Failed"* unhelpful because it names neither the node nor the issue.
- **Progressive disclosure:** None (tooltip on hover is the only roll-up).
- **Lesson:** n8n proves the *anti-pattern*: a hard publish gate **without an aggregated, deep-linking issue list** generates support tickets. The Errors card + "Fix errors" CTA is exactly the missing piece.
- Sources: [n8n error course](https://docs.n8n.io/courses/level-two/chapter-4/), [community 111072](https://community.n8n.io/t/problem-running-workflow-please-resolve-outstanding-issues-before-you-activate-it/111072), [warning triangle thread](https://community.n8n.io/t/what-does-the-yellow-triangle-warning-icon-on-a-node-in-n8n-mean-and-how-can-i-resolve-it/143454)

### 1.2 Zapier
- **Where it lives:** **Left sidebar "Zap Status" section** + step-level icons + publish-button state. Steps that are incomplete/untested show *"a warning icon … in the upper left of incomplete Zap steps"*; the sidebar lists *"all steps that you need to test"* at the top of the Steps section.
- **Grouping:** By step (sequential), with a status checklist feel — not by severity.
- **Blocking:** *"The Publish button will be disabled until you successfully test"* the trigger and all Filter/Paths steps; other steps' tests are **skippable** (required vs optional testing — a built-in blocking/non-blocking split). Drafts can always be saved; only publish is gated. Enterprise adds an approval gate (request publish approval with version name + description).
- **CTAs:** Per-step **Test / Skip test**, plus bulk **"test or skip testing for all steps with the click of a single button"** — the closest existing analog to the one-click "Fixes" section. Connection issues offer a **Reconnect** action in a dialog.
- **Success state:** *"Test successful! Your Zap is good to publish."*
- Sources: [Test Zap steps](https://help.zapier.com/hc/en-us/articles/18811411817741-Test-Zap-steps), [bulk test/skip](https://help.zapier.com/hc/en-us/articles/19373346850701-Save-time-building-Zap-workflows-by-testing-or-skipping-tests-for-all-steps-at-once), [Can't turn on or publish Zap](https://help.zapier.com/hc/en-us/articles/8496199466125-Can-t-turn-on-or-publish-Zap), [drafts & versions](https://help.zapier.com/hc/en-us/articles/9693520498445-Create-Zap-drafts-and-versions)

### 1.3 Make (Integromat)
- **Where it lives:** **Inline on the canvas** — errored modules are highlighted *"with an alert sign"* (errors) or *"a yellow caution sign"* (warnings) above the module; clicking the sign opens details (error type, message, offending bundle). No pre-publish review panel.
- **Grouping:** By module; severity is communicated by icon color (red error / yellow warning), not by a grouped list.
- **Blocking:** Severity has *operational* consequences rather than publish gating: *"when a module … returns a warning, your scenario keeps running and stays enabled"*, while repeated errors mean Make *"automatically disables the scenario's schedule."* Error handlers can downgrade errors to warnings to keep the scenario alive.
- **CTAs:** Click alert icon → detail popover; add error-handler routes. Email notification on disable.
- **Lesson:** A clean two-tier severity vocabulary (red = stops/disables, yellow = continues but investigate) consistently carried through icon, behavior, and notifications.
- Sources: [Introduction to errors and warnings](https://help.make.com/introduction-to-errors-and-warnings), [Types of warnings](https://www.make.com/en/help/errors/types-of-warnings-in-make), [Fix errors and warnings](https://help.make.com/fix-errors-and-warnings)

### 1.4 Jira Automation
- **Where it lives:** Mostly **inline in the rule-builder component list** (warning banners on a component, e.g. *"This rule component was provided by a third-party extension … It appears this app is no longer installed"*) + **save/enable-time hard errors** (e.g. *"Either you or the rule actor … is missing some required permissions"* blocks enable/save) + **post-hoc audit log** on the rule details page (per-execution SUCCESS / ERROR with component identifiers).
- **Grouping:** By rule component; audit log groups by execution.
- **Conflict-adjacent behavior (relevant to the Conflicts card):** Jira warns at the *rule* level about systemic interactions — e.g. a warning suggesting you **split a rule that exceeds the 65-component limit**, and loop-protection around rules triggering other rules. It's the best example of "this rule is valid but interacts badly with the environment" messaging.
- **Blocking:** Permission/validation errors block enabling; extension warnings don't.
- **CTAs:** Banner text explains remediation; audit log deep-links to the failing component context.
- Sources: [Debug an automation rule](https://support.atlassian.com/cloud-automation/docs/debug-an-automation-rule/), [cannot enable/save KB](https://confluence.atlassian.com/automationkb/cannot-enable-or-save-automation-rule-due-to-the-error-either-you-or-the-rule-actor-for-this-rule-is-missing-some-required-permissions-1095246109.html), [audit-log troubleshooting](https://confluence.atlassian.com/automationkb/automation-for-jira-troubleshooting-the-most-common-errors-reported-in-the-rule-audit-logs-1489804067.html), [third-party extension warning](https://support.atlassian.com/automation/kb/the-warning-disabled-third-party-extension-for-automation-for-jira-appears/)

### 1.5 monday.com
- **Where it lives:** **Inline + disabled primary button with hover tooltip.** The "Create Automation" button stays greyed out until the sentence-builder is complete; hovering it explains: *"Complete the missing fields to add the automation to your board."* Unconfigured fields are underlined/highlighted in the sentence.
- **Grouping/collapsibility:** None — single automation, single inline message.
- **Blocking:** Fully blocking; you simply cannot create an incomplete automation. No warnings tier.
- **Lesson:** The "disabled CTA + tooltip explaining why" micro-pattern is worth copying for the panel's Publish button while errors remain.
- Sources: [developer community thread](https://developer-community.monday.com/appfeature-migration-21/this-automation-is-missing-required-fields-5242), [community thread](https://community.monday.com/t/completing-a-custom-automation-is-not-working/16875), [New Automation Builder](https://support.monday.com/hc/en-us/articles/31585338491922-New-Automation-Builder)

### 1.6 Power Automate (Flow Checker) — closest analog to this design
- **Where it lives:** **Right-side panel** opened from a persistent command-bar button (stethoscope icon) that shows a **red dot badge** when issues exist. Crucially, *"Flow checker also opens automatically when you save the flow if there are errors or warnings."*
- **Grouping:** **Two severity sections — Errors and Warnings** — and *"in each section, flow checker identifies the actions where the error or warning occurs"* (severity → action two-level hierarchy). Items are **expandable** for details (classic designer: "expand an error or warning in the Flow checker panel").
- **Blocking:** Errors block save/run; warnings are best-practice advisories (performance/reliability risk) and don't block.
- **CTAs:** Selecting an item **opens the offending action's configuration** ("select the error … and correct your error with the help of the red text"); the same error is mirrored in red **on the flow card and the action panel** (bidirectional: panel→node and node→panel). Re-running shows *"No errors found"* as an explicit clean state.
- **Progressive disclosure:** Collapsed items expand individually; no show-first-N behavior documented.
- Sources: [Find and fix errors with flow checker](https://learn.microsoft.com/en-us/power-automate/error-checker), [Flow Checker guidance](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/manage-flows-flow-checker), [announcement blog](https://www.microsoft.com/en-us/power-platform/blog/power-automate/flow-checker-four-connectors/)

### 1.7 Salesforce Flow Builder (Errors and Warnings pane) — second-closest analog
- **Where it lives:** **Side pane** toggled by a "Show Error" icon in the button bar; in recent releases it *"stay[s] closed by default when you open a draft flow, so it's no longer interrupting you before you're ready to review issues."*
- **Grouping:** *"Errors and warnings are organized into **cards grouped by element**"* — i.e., per-node cards inside a severity-organized pane (the stacked-cards instinct, validated by the market leader).
- **Blocking:** The pane shows issues *"that could prevent your flow from being saved or activated"* — errors block save/activate; warnings don't.
- **CTAs:** *"Clicking a card title opens that element's property panel directly"* and the pane *"includes direct links to the Flow Builder canvas, enabling you to locate the source of any problem easily."*
- **Notable evolution:** Salesforce explicitly moved from auto-opening the pane (interruptive) to on-demand + auto-open at the save/activate moment — a sequencing decision directly relevant to when the panel should appear.
- Sources: [Summer '26 release note (pane improvements)](https://help.salesforce.com/s/articleView?language=en_US&id=release-notes.rn_automate_flow_builder_improvements_to_the_errors_and_warning_pane.htm&release=254&type=5), [Winter release note (pane intro)](https://help.salesforce.com/s/articleView?language=en_US&id=release-notes.rn_automate_flow_builder_systematically_troubleshoot_configuration_issues_with_the_errors_and_warning_pane.htm&release=252&type=5), [Salesforce Break Summer '26 summary](https://salesforcebreak.com/2026/04/25/summer-26-flow-updates/), [SalesforceGeek Winter '25](https://salesforcegeek.in/salesforce-winter25-release-flow-features-and-updates/)

### 1.8 ServiceNow Flow Designer
- **Where it lives:** No dedicated pre-publish review panel in public docs. Validation is **inline on action cards** (required-field errors at configure/save time) plus **error toasts at save/activate** (e.g. "Invalid values passed to the API" KB). Runtime problems are handled via the **Flow error handler** section and per-execution context records, not a design-time panel.
- **Blocking:** Incomplete actions can't be saved; activation errors surface as blocking dialogs/toasts.
- **Lesson for an ITSM peer:** the most direct competitor to ServiceOps has *no* aggregated publish-review surface — this panel is a differentiation opportunity, not table stakes.
- Sources: [Flow error handler docs](https://www.servicenow.com/docs/bundle/zurich-build-workflows/page/administer/flow-designer/concept/flow-error-handler.html), [KB0745336 activation errors](https://support.servicenow.com/kb?id=kb_article_view&sysparm_article=KB0745336), [save error community thread](https://www.servicenow.com/community/itsm-forum/flow-designer-not-allow-to-save-and-thrown-out-error/td-p/2802281)

### 1.9 Dify (and Notion, briefly)
- **Dify — Checklist:** A **"Checklist" button in the top-right toolbar with an orange count badge**; opening it lists every node with problems (unconfigured fields, disconnected nodes) and clicking an entry focuses that node. Docs: *"Before publishing the App, you can check the checklist to see if there are any nodes with incomplete configurations or that have not been connected."* Publishing is supposed to be blocked while checklist errors exist (a GitHub bug report treats publish-blocking as the expected behavior). It's a single flat list — no severity tiers, no warnings concept.
  - Sources: [Dify Checklist docs](https://docs.dify.ai/en/guides/workflow/debug-and-preview/checklist), [GitHub #29629](https://github.com/langgenius/dify/issues/29629)
- **Notion automations:** validation is purely constructive/inline — the builder won't let you save until trigger + action are fully specified; no panel, no severity model. Not a useful reference beyond "prevent rather than report."

### 1.10 Cross-cutting patterns (GitHub checks, linters, NN/g)
- **GitHub PR checks (required vs optional gating):** The merge box lists every check with pass/fail icons; checks configured as blocking carry a literal **"Required" chip**; the banner states the gate (*"Merging is blocked"*) and the merge button is disabled while *required* checks fail — optional checks can fail red without blocking. Each row has a **"Details" deep link**. *"All required status checks must pass before collaborators can merge changes into the protected branch."* This is the canonical blocking-vs-non-blocking vocabulary: same visual list, one chip changes the contract. Sources: [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches), [Troubleshooting required status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks), [Resolving a block on your PR](https://docs.github.com/en/code-security/how-tos/maintain-quality-code/unblock-your-pr)
- **Progressive disclosure (NN/g):** show primary items by default, defer the rest; *"the most common failure mode is hiding something users need frequently."* Accordions *"reduce visual clutter"* but *"diminish content visibility and increase interaction cost"* — so default-expand the section the user must act on (Errors) and default-collapse advisory ones (Warnings, Fixes). For 5+ warnings, "first N + Show all (count)" inside an expanded card beats nesting accordions inside accordions. Accordion sections beat tabs here because severity categories must be **scannable simultaneously** (tabs hide sibling counts; stacked cards with count badges don't). Sources: [NN/g Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/), [NN/g accordions topic](https://www.nngroup.com/topic/accordions/), [UXPin overview](https://www.uxpin.com/studio/blog/what-is-progressive-disclosure/)

---

## 2. Comparison table

| Product | Validation UI lives | Grouping | Collapsible sections | Blocking vs non-blocking | CTAs | Progressive disclosure |
|---|---|---|---|---|---|---|
| **n8n** | Node badges + activation toast (no panel) | Per node | n/a | All issues block activation; toast doesn't name node | None (hunt for badge) | None |
| **Zapier** | Left sidebar "Zap Status" + step icons + publish button state | Per step (sequential checklist) | Sidebar sections | Trigger/Paths tests required; other tests skippable; Publish disabled until clean | Test / Skip / **bulk test-or-skip all** / Reconnect | Steps needing attention float to top |
| **Make** | Inline icons above modules + detail popover | Per module, severity by icon color | n/a | Errors disable schedule (after repeats); warnings never block | Click icon → details; add error handler | None |
| **Jira Automation** | Inline component banners + enable-time errors + audit log page | Per component; per execution (audit) | Audit rows expand | Permission/validation errors block enable; extension warnings don't | Banner remediation text; audit deep-link | Verbose-logging opt-in |
| **monday.com** | Inline sentence + disabled button tooltip | Single automation | n/a | Fully blocking | Tooltip explains missing fields | n/a |
| **Power Automate** | **Right panel** (command-bar button, red-dot badge), auto-opens on save | **Errors / Warnings sections → actions** | Items expand | Errors block; warnings advisory | Click item → opens action config; mirrored red text on card | Expand-per-item |
| **Salesforce Flow** | **Side pane** (button-bar toggle), closed by default | **Cards grouped by element**, errors + warnings | Cards | Errors block save/activate; warnings don't | Card title → element property panel; canvas deep links | On-demand open |
| **ServiceNow Flow Designer** | Inline on action cards + save/activate toasts | Per action | n/a | Incomplete actions block save | Inline field errors | None |
| **Dify** | **Top-right Checklist button + count badge → panel** | Flat node list | No | Checklist errors block publish (by design) | Click entry → focus node | Count badge only |
| **GitHub checks** | PR merge box | Per check, "Required" chip | Check list expands | Required checks gate merge; optional fail red without gating | "Details" deep link per row | Collapsed check list w/ summary counts |

---

## 3. UX option recipes for the stacked-cards panel

### Recipe A — "Flow-Checker spine": severity sections → node items, auto-open at publish
*Inspired by: Power Automate + Salesforce Flow.*
Keep the 4 cards as severity/category sections; inside each, every row is a **node-anchored item** (node icon + node name + one-line issue) that **deep-links to that node's config drawer and pans the canvas**, with the issue mirrored in red on the node card itself (panel→node and node→panel, like Flow Checker's dual surfacing). Panel stays closed during editing (Salesforce learned auto-open-on-load is interruptive) but **auto-opens when the user hits Publish with issues present**, with a persistent badge (red dot / count) on the Publish button otherwise.
- **Pros:** Proven by the two most mature implementations; node deep-linking directly fixes the n8n failure mode; fits the existing right-drawer architecture (`.sp` panel) and node-graph canvas.
- **Cons:** Two-level hierarchy (category card → node items) needs careful density work in a narrow drawer; mirrored on-node error styling is extra scope.

### Recipe B — "GitHub-checks gating": one list grammar, a `Required` chip does the blocking
*Inspired by: GitHub PR checks + Zapier's required-vs-skippable tests.*
Render all four cards with the **same row anatomy** (status icon, title, deep link) and communicate blocking purely through a **"Required" chip + a sticky summary banner** ("Publishing is blocked — 2 required fixes"). Errors and error-Fixes carry the chip; Warnings/Conflicts/optional Fixes render identically but without it, each with an explicit **Dismiss/Skip** affordance (Zapier's "skip test" shows non-blocking items should be individually waivable, and waiving should be logged). Publish button mirrors GitHub's merge button: disabled + reason while required items remain, enabled with a "publish with N warnings" caveat otherwise.
- **Pros:** One visual grammar scales to future categories; the blocking contract is legible at a glance; "publish anyway with warnings" is naturally expressible; auditable dismissals suit ITSM governance.
- **Cons:** Subtler than red/yellow color-coding — chip must be unmistakable; per-item dismiss adds state to persist and surface later ("3 dismissed warnings").

### Recipe C — "Checklist-to-zero": gamified countdown with bulk actions
*Inspired by: Dify's Checklist + Zapier's bulk "test/skip all" + the existing Fixes section.*
Frame the panel as a **countdown to publishable**: header shows "4 items between you and publish" with a progress indicator; the Publish entry point itself carries the **count badge** (Dify). The **Fixes card gets Zapier-style bulk CTAs** — "Apply all required fixes" (one click resolves every error that has an auto-fix) and "Apply all" — with per-row individual apply/undo, honoring the repo's reversible/preview-before-apply guarantees. Resolving items visibly ticks them off; reaching zero flips the panel to an explicit clean state ("No issues found — ready to publish", per Flow Checker's "No errors found").
- **Pros:** Strong motivation loop; bulk auto-fix is a genuine differentiator no ITSM competitor has (ServiceNow has nothing here); the explicit empty/clean state builds trust.
- **Cons:** Bulk "fix all" needs preview + undo to stay trustworthy (one bad auto-fix poisons the feature); countdown framing can feel naggy if warnings are noisy — only count *required* items toward the number.

### Recipe D — "Triage accordion": severity-ordered cards with first-N disclosure and conflict cross-links
*Inspired by: NN/g progressive disclosure + Make's two-tier severity semantics + Jira's environment-level warnings.*
Cards are a strict severity-ordered accordion: **Errors default-expanded** (NN/g: disclose up front what users must act on), Warnings/Conflicts/Fixes default-collapsed showing only **header + count badge + 1-line summary** ("5 warnings · 3 about unused branches"). Inside Warnings, show **first 3 + "Show all 5"**, grouped by warning *type* with a per-type count so 5+ items don't read as 5 separate alarms (Make's pattern of one icon class per severity, consistently colored: red blocks, amber advises). The **Conflicts card is environment-scoped, not node-scoped** (Jira's "this rule interacts with other rules" precedent): each conflict row names the *other* workflow and links out to it, with CTAs like "Open conflicting workflow" / "Reorder triggers" rather than Fix/Dismiss.
- **Pros:** Scales to long warning lists without overwhelming; respects that Conflicts are a different *kind* of issue needing different CTAs; cheap to build on the existing drawer + card CSS.
- **Cons:** Accordions hide sibling content (NN/g) — count badges on collapsed headers are mandatory, not optional; type-grouping warnings needs a taxonomy up front.

**Cross-cutting recommendations regardless of recipe:**
1. Every issue row must deep-link to its node — the single most consistent success factor (Power Automate, Salesforce, Dify) and the single most complained-about omission (n8n).
2. Keep editing un-gated and gate only publish (Zapier drafts, Salesforce).
3. Give the clean state an explicit celebratory message.
4. Stacked collapsible cards with count badges beat tabs because all four category counts stay visible simultaneously.
