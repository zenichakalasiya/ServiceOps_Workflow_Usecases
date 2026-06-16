import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Ic } from "./App.jsx";
import "./index.css";
import "./conflict-timing.css";

/* =====================================================================
   Conflict Detection Timing — 5 Smart Options (interactive demo)
   Standalone page: localhost:5173/conflict-timing.html
   Each option answers "what signal tells us a conflict is real enough
   to show yet?" — see "Conflict Detection Timing — 5 Smart Options.md".
   Reuses the shared icon set + CSS tokens; does NOT touch App.jsx logic.
   ===================================================================== */

// The other workflows on the same trigger (Incident · Is Created)
const PEERS = [
  { id:"wf12", name:"Workflow 12 · VIP Escalation", status:"active",    last:"2 min ago",  steps:4, owner:"Service Desk", cond:"Requester VIP is Yes" },
  { id:"wf07", name:"Workflow 07 · Major Incident",  status:"published", last:"1 h ago",     steps:6, owner:"Network Ops",  cond:"Priority is Critical" },
  { id:"wf21", name:"Workflow 21 · Auto-Assign",     status:"published", last:"yesterday",   steps:3, owner:"IT Helpdesk",  cond:"Requester VIP is Yes" },
];
const StatusPill = ({ s }) => s==="active"
  ? <span className="stp act"><span className="dotpulse"/> Active</span>
  : <span className="stp pub">Published · idle</span>;

/* ---------- A mini canvas: Trigger → IF/Else node, used by several options ---------- */
function MiniNode({ title, tag, icon, badge, dim, glow, children }) {
  return (
    <div className={"mn"+(dim?" dim":"")+(glow?" glow":"")}>
      {badge}
      <div className="mn-h"><span className={"mn-ic "+(tag||"")}>{icon}</span><b>{title}</b></div>
      {children}
    </div>
  );
}
function MiniCanvas({ children, badgeSlot, ifChildren, ifGlow, ifDim }) {
  return (
    <div className="mc">
      <MiniNode title="Incident Created" tag="trig" icon={<Ic.trigger size={15}/>}>
        <div className="mn-sub">Trigger · Is Created</div>
      </MiniNode>
      <div className="mc-wire"/>
      <div className="mc-ifwrap">
        {badgeSlot}
        <MiniNode title="IF / Else" tag="ife" icon={<Ic.ifelse size={15}/>} glow={ifGlow} dim={ifDim}>
          {ifChildren || <div className="mn-cond">Requester VIP is Yes</div>}
        </MiniNode>
      </div>
      {children}
    </div>
  );
}

/* ======================= OPTION A — Confidence-graded ======================= */
function OptionA() {
  const [complete, setComplete] = useState(false); // condition fully specified & provably overlaps?
  const badge = complete
    ? <div className="cbadge solid"><Ic.loop size={13}/> Conflict <span className="cb-n">1</span><div className="cbtip">Confirmed — provably overlaps with VIP Escalation</div></div>
    : <div className="cbadge dashed"><Ic.warn size={13}/> Potential overlap<div className="cbtip">Provisional — we’ll confirm once this condition is fully set</div></div>;
  return (
    <Demo
      title="Confidence-graded detection"
      tag="Signal: certainty of the overlap"
      blurb="Like a spellcheck squiggle vs. a hard error. While the condition is incomplete the conflict is a faint, uncounted “potential overlap”. The instant it provably overlaps, it promotes itself to a solid, counted “Conflict”.">
      <div className="stage">
        <MiniCanvas
          badgeSlot={<div className="badge-anchor">{badge}</div>}
          ifGlow={complete}
          ifChildren={
            <div className={"mn-cond"+(complete?"":" partial")}>
              Requester VIP is Yes {!complete && <em>· value not set…</em>}
            </div>
          }/>
        <div className="ctrlcard">
          <div className="hpill">
            <span className="hpill-l">Workflow Health</span>
            <span className={"hpill-c "+(complete?"on":"off")}>{complete?"1 conflict":"0 conflicts · 1 potential"}</span>
          </div>
          <label className="switch">
            <input type="checkbox" checked={complete} onChange={e=>setComplete(e.target.checked)}/>
            <span className="track"/><span className="lbl">Condition fully specified</span>
          </label>
          <p className="note">Toggle to watch the badge promote <b>dashed “potential” → solid “Conflict”</b> and the health count update. Provisional conflicts never block publishing.</p>
        </div>
      </div>
    </Demo>
  );
}

/* ======================= OPTION B — Live overlap meter ======================= */
const FILTERS = [
  { id:"f0", label:"Requester VIP is Yes", drops:0 },
  { id:"f1", label:"AND Status is New",     drops:2 },
  { id:"f2", label:"AND Source is Email",   drops:1 },
];
function OptionB() {
  const [on, setOn] = useState({ f0:true });
  const dropped = FILTERS.filter(f=>on[f.id]).reduce((s,f)=>s+f.drops,0);
  const overlaps = Math.max(0, PEERS.filter(p=>p.cond==="Requester VIP is Yes").length + 1 /*self+peer*/ - 1 - dropped);
  const total = 2;
  const pct = total ? overlaps/total : 0;
  return (
    <Demo
      title="Live overlap meter"
      tag="Signal: live recompute as you type"
      blurb="Don’t show a conflict — show a gauge. As you narrow the condition, an “Overlaps with N workflows” meter counts down to zero in real time. The conflict resolves by construction, and you watch it happen.">
      <div className="stage">
        <div className="drawerlike">
          <div className="dl-h"><span className="mn-ic ife"><Ic.ifelse size={14}/></span><b>IF / Else — Check IF</b></div>
          <div className="dl-sub">Match <span className="seg">All</span> of these conditions</div>
          {FILTERS.map(f=>(
            <label key={f.id} className={"condrow"+(on[f.id]?" on":"")}>
              <input type="checkbox" checked={!!on[f.id]} onChange={e=>setOn(o=>({...o,[f.id]:e.target.checked}))}/>
              <span className="cr-box">{on[f.id] && <Ic.check size={12}/>}</span>
              <span className="cr-lbl">{f.label}</span>
              {f.drops>0 && <span className="cr-drop">−{f.drops} overlap</span>}
            </label>
          ))}
        </div>
        <div className="ctrlcard">
          <div className={"meter "+(overlaps===0?"clear":"")}>
            <div className="meter-top">
              <span>{overlaps===0 ? <><Ic.checkC size={15}/> No overlap</> : <><Ic.loop size={15}/> Overlaps with {overlaps} workflow{overlaps>1?"s":""}</>}</span>
              <b>{overlaps}/{total}</b>
            </div>
            <div className="meter-bar"><span style={{ width:`${pct*100}%` }}/></div>
          </div>
          <p className="note">Tick <b>“AND Status is New”</b> to narrow the condition — the meter drops toward <b>0</b> and the conflict dissolves. Resolution is the same gesture as configuring.</p>
        </div>
      </div>
    </Demo>
  );
}

/* ======================= OPTION C — Settle-gated ======================= */
function OptionC() {
  const [editing, setEditing] = useState(false);
  const [settled, setSettled] = useState(true);
  const [pending, setPending] = useState(false);
  const startEdit = () => { setEditing(true); setSettled(false); setPending(false); };
  const done = () => {
    setEditing(false); setPending(true);
    setTimeout(()=>{ setPending(false); setSettled(true); }, 900); // appears "a beat after"
  };
  const badge = settled
    ? <div className="cbadge solid"><Ic.loop size={13}/> Conflict<div className="cbtip">Surfaced after the node settled</div></div>
    : pending ? <div className="cbadge ghost">checking…</div> : null;
  return (
    <Demo
      title="Settle-gated detection"
      tag="Signal: node finished editing"
      blurb="Detection simply doesn’t run on a node you’re actively editing. The badge appears a beat AFTER you move on — never mid-keystroke. Cheapest possible “no nag while typing”.">
      <div className="stage">
        <MiniCanvas
          badgeSlot={<div className="badge-anchor">{badge}</div>}
          ifDim={editing}
          ifChildren={
            editing
              ? <input className="mn-input" autoFocus defaultValue="Requester VIP is Yes" />
              : <div className="mn-cond">Requester VIP is Yes</div>
          }/>
        <div className="ctrlcard">
          <div className="statline">
            State: {editing ? <b className="s-edit">Editing — detection paused</b> : pending ? <b className="s-pend">Settling…</b> : <b className="s-done">Settled — conflict shown</b>}
          </div>
          {editing
            ? <button className="btn btn-pri btn-sm" onClick={done}>Done editing this node</button>
            : <button className="btn btn-outline btn-sm" onClick={startEdit}>Edit the condition</button>}
          <p className="note">Click <b>Edit</b> — the badge vanishes and won’t nag while you type. Click <b>Done</b> — it reappears a beat later. No deferral logic, just a “settled” gate.</p>
        </div>
      </div>
    </Demo>
  );
}

/* ======================= OPTION D — Suggest-the-dissolving-fix ======================= */
function OptionD() {
  const [applied, setApplied] = useState(false);
  return (
    <Demo
      title="Suggest-the-dissolving-fix"
      tag="Signal: a remedy is computable"
      blurb="The system computes what single change makes the overlap vanish — and offers it WITH the conflict. Problem and one-click cure arrive together; the user never has to diagnose.">
      <div className="stage">
        <div className="diagcard">
          <div className="dg-h">
            <span className={"dg-dot "+(applied?"done":"conf")}/>
            <b>{applied ? "Overlap resolved" : "Overlapping condition with VIP Escalation"}</b>
            <span className="dg-node">IF / Else</span>
          </div>
          {!applied ? (<>
            <div className="dg-pair">
              <span className="dg-wf">This workflow</span>
              <span className="dg-c hot">Requester VIP is Yes</span>
              <Ic.loop size={14} color="var(--purple)"/>
              <span className="dg-c hot">Requester VIP is Yes</span>
              <span className="dg-wf">VIP Escalation</span>
            </div>
            <p className="dg-why"><b>Effect:</b> both run on the same ticket and may fight over the assignment.</p>
            <div className="suggestbox">
              <Ic.bulb size={16} color="var(--blue)"/>
              <div style={{flex:1}}>
                <div className="sg-t">Suggested fix — dissolves the overlap</div>
                <div className="sg-d">Add <b>“AND Status is New”</b> here → the two conditions become mutually exclusive.</div>
              </div>
            </div>
            <div className="dg-acts">
              <button className="link">Preview</button>
              <button className="btn btn-outline btn-sm" onClick={()=>setApplied(true)}>Apply fix</button>
            </div>
          </>) : (
            <div className="dg-done">
              <Ic.checkC size={15} color="var(--green)"/> Added “AND Status is New” — no longer overlaps.
              <button className="link" onClick={()=>setApplied(false)} style={{marginLeft:"auto"}}><Ic.undo size={12}/> Undo</button>
            </div>
          )}
        </div>
        <div className="ctrlcard">
          <p className="note">The conflict card carries its own computed cure. <b>Apply fix</b> adds the dissolving predicate — preview-first and reversible. This is the NN/g ideal: explain the problem <i>and</i> the solution.</p>
        </div>
      </div>
    </Demo>
  );
}

/* ======================= OPTION E — Quiet ledger ======================= */
function OptionE() {
  const [open, setOpen] = useState(false);
  return (
    <Demo
      title="Quiet ledger"
      tag="Signal: user pull, not system push"
      blurb="Conflicts never interrupt. They accumulate in a silent counter — a bell/pill on the canvas — opened when the user decides. Publish still runs the final hard re-check as a safety net.">
      <div className="stage">
        <div className="canvasframe">
          <MiniCanvas/>
          <button className={"ledgerpill"+(open?" on":"")} onClick={()=>setOpen(o=>!o)}>
            <Ic.bell size={14}/> Conflicts <span className="lp-n">3</span>
          </button>
          {open && (
            <div className="ledger">
              <div className="ledger-h"><b>Conflicts on this workflow</b><button className="sp-act" style={{width:24,height:24}} onClick={()=>setOpen(false)}><Ic.close size={13}/></button></div>
              {PEERS.map(p=>(
                <div className="ledger-row" key={p.id}>
                  <span className="lr-ic"><Ic.loop size={13}/></span>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="lr-name">{p.name}</div>
                    <div className="lr-sub">overlaps on <b>{p.cond}</b></div>
                  </div>
                  <StatusPill s={p.status}/>
                </div>
              ))}
              <div className="ledger-foot">Nothing here interrupts you — open it when you’re ready.</div>
            </div>
          )}
        </div>
        <div className="ctrlcard">
          <p className="note">No node badges, no modals. A corner <b>“Conflicts (3)”</b> pill is the only signal; click it to pull the ledger open. Respects the builder’s flow entirely.</p>
        </div>
      </div>
    </Demo>
  );
}

/* ---------- shared demo chrome ---------- */
function Demo({ title, tag, blurb, children }) {
  return (
    <div className="demo">
      <div className="demo-head">
        <h2>{title}</h2>
        <span className="demo-tag">{tag}</span>
      </div>
      <p className="demo-blurb">{blurb}</p>
      {children}
    </div>
  );
}

const OPTIONS = [
  { key:"A", label:"Confidence-graded", sub:"squiggle → solid", icon:Ic.warn,      C:OptionA },
  { key:"B", label:"Live overlap meter", sub:"counts to zero",  icon:Ic.refresh,   C:OptionB },
  { key:"C", label:"Settle-gated",       sub:"no nag while typing", icon:Ic.gear,  C:OptionC },
  { key:"D", label:"Suggest-the-fix",    sub:"problem + cure",  icon:Ic.bulb,      C:OptionD },
  { key:"E", label:"Quiet ledger",       sub:"pull, not push",  icon:Ic.bell,      C:OptionE },
];

function ConflictTimingDemo() {
  const [opt, setOpt] = useState("A");
  const Active = OPTIONS.find(o=>o.key===opt).C;
  return (
    <div className="ctd">
      <div className="ctd-rail">
        <div className="ctd-brand"><span className="wm">Motadata <i>·</i></span><span className="ctd-kicker">Conflict timing</span></div>
        <div className="ctd-q">Which signal tells us a conflict is <b>real enough to show yet?</b></div>
        {OPTIONS.map(o=>(
          <button key={o.key} className={"ctd-opt"+(opt===o.key?" on":"")} onClick={()=>setOpt(o.key)}>
            <span className="ctd-k">{o.key}</span>
            <span className="ctd-oi">{React.createElement(o.icon,{size:16})}</span>
            <span style={{flex:1,textAlign:"left",minWidth:0}}><span className="ctd-ol">{o.label}</span><span className="ctd-os">{o.sub}</span></span>
          </button>
        ))}
        <div className="ctd-rec"><Ic.spark size={13}/> <span>Recommended spine: <b>A + B</b>, <b>C</b> underneath, <b>E</b> entry point · <b>D</b> stretch</span></div>
      </div>
      <div className="ctd-stage"><Active/></div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<ConflictTimingDemo/>);
