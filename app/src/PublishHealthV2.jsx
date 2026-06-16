import React, { useState, useEffect, useRef } from "react";
import { Ic, REVIEW, HealthRing } from "./App.jsx";

/* =====================================================================
   Publish Health V2 — stacked scenario cards instead of filter tabs.
   One vertical card per scenario: Errors / Warnings / Conflicts / Fixes.
   Every card is expandable-collapsible; the Errors card carries a
   "Fix errors" CTA that swaps the popover focus to the Fixes card.
   Rendered for selected==="publish" from App.jsx (V1 PublishPopover is
   kept there untouched — swap the import back to compare).
   ===================================================================== */

/* Extra demo warnings (local to V2) so the Warnings card can show
   progressive disclosure with 5+ items. Targets are real canvas nodes so
   hover still scrolls/flashes them; they don't feed the canvas badges
   (those come from REVIEW in App.jsx). */
const EXTRA_WARNS = [
  { id:"vw1", node:"Create Requests", icon:"ticket", tgt:"act0", title:"No assignee set on the created request",
    detail:"Requests created here land unassigned. Set a default technician group so they don't sit in the open queue." },
  { id:"vw2", node:"Update Assets", icon:"box", tgt:"act2", title:"Asset update has no failure path",
    detail:"If the asset update fails (locked record, missing CI), the workflow continues silently. Consider a failure branch or a notification." },
  { id:"vw3", node:"Send a mail…", icon:"share", tgt:"act4", title:"Mail template uses a deprecated placeholder",
    detail:"{{ticket.owner}} was replaced by {{request.technician}}. The old placeholder still resolves today but will stop after the next upgrade." },
  { id:"vw4", node:"IF/Else group", icon:"ifelse", tgt:"if3", title:"Two conditions check the same field",
    detail:"“Category is Security” and “Source is Phone” are evaluated for every incident. If volume grows, consider narrowing the trigger filter instead." },
];

const SECTIONS = {
  err:  { title:"Errors",    icon:"warn2",  blurb:"Must be fixed — the workflow can't run with these." },
  warn: { title:"Warnings",  icon:"warn",   blurb:"Worth a look — these won't block publishing." },
  conf: { title:"Conflicts", icon:"loop",   blurb:"Other workflows that fire on the same trigger." },
  fix:  { title:"Fixes",     icon:"spark",  blurb:"One-click fixes — error fixes are required, the rest optional." },
};

/* A single finding row inside a card — reuses the .ritem look. */
function Row({ kind, item, done, doneLabel, open, onToggle, right, children, S }) {
  return (
    <div className={"ritem"+(S?" hoverable":"")}
      onMouseEnter={S ? ()=>S.hoverCanvas(item.tgt) : undefined}
      onMouseLeave={S ? S.leaveCanvas : undefined}>
      <div className="ritem-h" onClick={onToggle}>
        <span className={"ritem-dot "+(done?"done":kind)}/>
        <span className={"ritem-title"+(done?" done":"")}>{done && doneLabel ? doneLabel : item.title}</span>
        <span className="ritem-node">{item.node}</span>
        <Ic.chevD size={13} color="#94a3b8" style={{transform:open?"none":"rotate(-90deg)", transition:".15s", flex:"0 0 13px"}}/>
      </div>
      {open && (
        <div className="ritem-body">
          <p className="ritem-detail">{item.detail}</p>
          {children}
          {right && <div className="ritem-show">{right}</div>}
        </div>
      )}
    </div>
  );
}

/* Card shell: colored icon + title + status pill in the header; body collapses. */
function HealthCard({ k, count, total, open, onToggle, flash, cardRef, children, cta }) {
  const meta = SECTIONS[k];
  const Icon = Ic[meta.icon];
  const clear = count === 0;
  return (
    <div ref={cardRef} className={"hsec"+(open?" open":"")+(flash?" flash":"")}>
      <div className="hsec-h" onClick={onToggle}>
        <span className={"hsec-ic "+k}><Icon size={14}/></span>
        <div className="hsec-t">
          <div className="hsec-title">{meta.title}
            {clear
              ? <span className="hsec-count ok"><Ic.check size={10}/> Clear</span>
              : <span className={"hsec-count "+k}>{count} open{total!=null && total!==count ? ` · ${total-count} done` : ""}</span>}
          </div>
          <div className="hsec-sub">{meta.blurb}</div>
        </div>
        <Ic.chevD size={14} color="#94a3b8" style={{transform:open?"none":"rotate(-90deg)", transition:".15s", flex:"0 0 14px"}}/>
      </div>
      {open && (
        <div className="hsec-body">
          {children}
          {cta && <div className="hsec-cta">{cta}</div>}
        </div>
      )}
    </div>
  );
}

export default function PublishPopoverV2({ S }) {
  const [name, setName] = useState("Workflow 16");
  const [desc, setDesc] = useState("");
  const [phase, setPhase] = useState("run");            // 'run' → draft pass, 'done' → results
  const [published, setPublished] = useState(false);
  const { resolved, setResolved, acked, setAcked } = S;  // lifted, so canvas badges stay live

  // which cards are expanded — errors first, the rest collapsed until needed
  const [open, setOpen] = useState({ err:true, warn:false, conf:false, fix:false });
  const [openRow, setOpenRow] = useState(()=>Object.fromEntries(REVIEW.errors.map(e=>[e.id,true])));
  const [allWarns, setAllWarns] = useState(false);       // progressive disclosure for the warning list
  const [fixFlash, setFixFlash] = useState(false);
  const fixRef = useRef(null);

  useEffect(() => { const t = setTimeout(()=>{ setPhase("done"); S.markReviewed(); }, 1400); return ()=>clearTimeout(t); }, []);
  const rerun = () => { setPhase("run"); setTimeout(()=>setPhase("done"), 1400); };

  const toggleSec = (k) => setOpen(o=>({ ...o, [k]:!o[k] }));
  const toggleRow = (id) => setOpenRow(r=>({ ...r, [id]:!r[id] }));

  // "Fix errors" CTA — the popover switches focus to the Fixes card
  const goFixes = () => {
    setOpen({ err:false, warn:false, conf:false, fix:true });
    setTimeout(()=>{
      fixRef.current && fixRef.current.scrollIntoView({ behavior:"smooth", block:"start" });
      setFixFlash(true); setTimeout(()=>setFixFlash(false), 1500);
    }, 60);
  };

  const WARNINGS = [...REVIEW.warnings, ...EXTRA_WARNS];
  const WARN_PEEK = 3;                                   // shown before "Show all"
  const errorsLeft = REVIEW.errors.filter(e=>!resolved[e.id]).length;
  const warnsLeft  = WARNINGS.filter(w=>!acked[w.id]).length;
  const confsLeft  = REVIEW.conflicts.filter(c=>!S.confResolved[c.id]).length;
  const optFixesLeft = (S.converted?0:1) + (S.converted2?0:1);
  const fixesLeft  = errorsLeft + optFixesLeft;          // required + optional
  const allLeft    = errorsLeft + warnsLeft + confsLeft;

  const canPublish = phase==="done" && errorsLeft===0 && name.trim() && !published;
  const publish = () => { if(!canPublish) return; setPublished(true); S.notify("ok", `Published — “${name}” is now live.`); };
  const applyAllFixes = () => {
    if(!S.converted) S.applyFix1();
    if(!S.converted2) S.applyFix2();
    setResolved(r=>{ const n={...r}; REVIEW.errors.forEach(e=>{ if(!n[e.id]) n[e.id]=e.chips[0]; }); return n; });
  };

  const verdict = phase==="run"
    ? { cls:"run", title:"Running a draft pass…", sub:"We dry-run every step to verify the workflow works before it goes live." }
    : published
    ? { cls:"ok", title:"Published — workflow is live", sub:"Everything ran as intended in the draft pass." }
    : errorsLeft>0
    ? { cls:"err", title:`${errorsLeft} error${errorsLeft>1?"s":""} must be fixed to publish`, sub:"Open the Errors card below — everything else is advisory." }
    : { cls:"ok", title:"Everything is running as intended", sub:"No blocking issues — review what's left whenever you like." };

  const visibleWarns = allWarns ? WARNINGS : WARNINGS.slice(0, WARN_PEEK);
  const hiddenLeft = WARNINGS.slice(WARN_PEEK).filter(w=>!acked[w.id]).length;

  return (
    <div className="sp">
      <div className="sp-top">
        <button className="sp-top gobk" style={{flex:1,justifyContent:"flex-start"}} onClick={()=>S.select(S.converted?"branch":"group")}><Ic.chevL size={14}/> Back to configuration</button>
        <button className="sp-act" onClick={rerun} title="Re-run draft pass"><Ic.refresh size={15}/></button>
        <button className="sp-act" onClick={()=>S.select(null)}><Ic.close size={15}/></button>
      </div>

      <div className="sp-scroll">
        <div className="sp-title"><span className="gic trig"><Ic.share size={16}/></span><h2>Publish workflow</h2></div>
        <div className="sp-blurb">Name your workflow and review its health. Errors must be fixed; warnings, conflicts and fixes won't block you.</div>

        <div className="field"><label className="lbl2">Name <span className="req">*</span></label>
          <input className="inp" value={name} onChange={e=>setName(e.target.value)} placeholder="Workflow name"/></div>
        <div className="field"><label className="lbl2">Description <span className="req">*</span></label>
          <textarea className="inp" rows="2" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What does this workflow do?"/></div>

        <div className={"health "+verdict.cls}>
          <div className="health-top">
            <HealthRing running={phase!=="done"} allClear={published || allLeft===0}
              passed={12 - allLeft} total={12} errN={errorsLeft} attnN={warnsLeft + confsLeft}/>
            <div className="health-verdict">Workflow Health</div>
            {phase==="done" && !published && <div className="health-meta">Draft pass · just now</div>}
          </div>
          <div className="health-sub"><b>{verdict.title}</b><br/>{verdict.sub}</div>
        </div>

        {phase==="done" && (<>
          {/* ---- 1 · Errors — blocking, with the "Fix errors" CTA ---- */}
          <HealthCard k="err" count={errorsLeft} total={REVIEW.errors.length}
            open={open.err} onToggle={()=>toggleSec("err")}
            cta={errorsLeft>0 && (
              <button className="btn btn-pri btn-sm" onClick={goFixes}><Ic.spark size={13}/> Fix {errorsLeft} error{errorsLeft>1?"s":""} →</button>
            )}>
            {REVIEW.errors.map(e=>(
              <Row key={e.id} kind="err" item={e} S={S} done={!!resolved[e.id]} doneLabel={e.title+" — resolved"}
                open={!!openRow[e.id]} onToggle={()=>toggleRow(e.id)}>
                {resolved[e.id] && (
                  <div className="ritem-acts"><span className="done-row"><Ic.checkC size={14}/> {resolved[e.id]}</span>
                    <button className="link" onClick={()=>setResolved(r=>{const n={...r}; delete n[e.id]; return n;})}>Change</button></div>
                )}
              </Row>
            ))}
            {errorsLeft===0 && <div className="fempty"><Ic.checkC size={15}/> All errors resolved</div>}
          </HealthCard>

          {/* ---- 2 · Warnings — long list, progressive disclosure ---- */}
          <HealthCard k="warn" count={warnsLeft} total={WARNINGS.length}
            open={open.warn} onToggle={()=>toggleSec("warn")}>
            {visibleWarns.map(w=>(
              <Row key={w.id} kind="warn" item={w} S={S} done={!!acked[w.id]}
                open={!!openRow[w.id]} onToggle={()=>toggleRow(w.id)}
                right={acked[w.id]
                  ? <span className="done-row" style={{color:"var(--muted)"}}><Ic.check size={13}/> Acknowledged</span>
                  : <button className="btn btn-ghost btn-sm" onClick={()=>setAcked(a=>({...a,[w.id]:true}))}>Got it</button>}/>
            ))}
            {WARNINGS.length > WARN_PEEK && (
              <button className="showmore" onClick={()=>setAllWarns(v=>!v)}>
                {allWarns
                  ? <>Show less <Ic.chevD size={12} style={{transform:"rotate(180deg)"}}/></>
                  : <>Show all {WARNINGS.length} warnings{hiddenLeft>0 ? ` (${hiddenLeft} more to review)` : ""} <Ic.chevD size={12}/></>}
              </button>
            )}
          </HealthCard>

          {/* ---- 3 · Conflicts — listed for awareness; resolution flow lands next iteration ---- */}
          <HealthCard k="conf" count={confsLeft} total={REVIEW.conflicts.length}
            open={open.conf} onToggle={()=>toggleSec("conf")}>
            {REVIEW.conflicts.map(c=>(
              <Row key={c.id} kind="conf" item={c} S={S} done={!!S.confResolved[c.id]} doneLabel={c.title+" — allowed"}
                open={!!openRow[c.id]} onToggle={()=>toggleRow(c.id)}
                right={<span style={{display:"inline-flex",alignItems:"center",gap:10}}>
                  <button className="link" onClick={()=>S.notify("info","Opening “Workflow 12 · VIP Escalation”…")}><Ic.ext size={12}/> View workflow</button>
                  <span className="soon">Resolution — next step</span>
                </span>}/>
            ))}
          </HealthCard>

          {/* ---- 4 · Fixes — required (errors) on top, optional (optimizations) below ---- */}
          <HealthCard k="fix" count={fixesLeft} total={REVIEW.errors.length + REVIEW.fixes.length}
            open={open.fix} onToggle={()=>toggleSec("fix")} flash={fixFlash} cardRef={fixRef}
            cta={<button className="btn btn-pri btn-sm" disabled={fixesLeft===0} style={fixesLeft===0?{opacity:.55,cursor:"not-allowed"}:null} onClick={applyAllFixes}>
              {fixesLeft===0 ? <>All fixes applied <Ic.check size={13}/></> : `Apply all (${fixesLeft})`}
            </button>}>
            <div className="fixgroup"><span className="reqpill">Required</span> Without these the workflow won't run.</div>
            {REVIEW.errors.map(e=>{
              const done = !!resolved[e.id];
              return (
                <Row key={"fx"+e.id} kind="fix" item={{...e, title:e.fixTitle}} S={S} done={done} doneLabel={e.fixTitle+" — applied"}
                  open={!!openRow["fx"+e.id]} onToggle={()=>toggleRow("fx"+e.id)}>
                  {!done ? (
                    <div className="rchips">{e.chips.map(c=>(
                      <button key={c} className="rchip" onClick={()=>setResolved(r=>({...r,[e.id]:c}))}><Ic.check size={12}/> {c}</button>
                    ))}</div>
                  ) : (
                    <div className="ritem-acts"><span className="done-row"><Ic.checkC size={14}/> {resolved[e.id]}</span>
                      <button className="link" onClick={()=>setResolved(r=>{const n={...r}; delete n[e.id]; return n;})}>Change</button></div>
                  )}
                </Row>
              );
            })}
            <div className="fixgroup"><span className="reqpill opt">Optional</span> Same outcomes, lighter structure — reversible.</div>
            {REVIEW.fixes.map(f=>{
              const done = f.group===1 ? S.converted : S.converted2;
              return (
                <Row key={f.id} kind="fix" item={f} S={S} done={done} doneLabel={f.title+" — applied"}
                  open={!!openRow[f.id]} onToggle={()=>toggleRow(f.id)}
                  right={done
                    ? <span className="done-row"><Ic.checkC size={14}/> Applied — reversible</span>
                    : <button className="btn btn-outline btn-sm" onClick={()=> f.group===1 ? S.applyFix1() : S.applyFix2()}>Apply fix</button>}/>
              );
            })}
          </HealthCard>
        </>)}
      </div>

      <div className="sp-foot">
        <button className="btn btn-ghost btn-sm" onClick={()=>S.select(null)}>Cancel</button>
        <button className="btn btn-pri btn-sm" disabled={!canPublish} style={!canPublish?{opacity:.55,cursor:"not-allowed"}:null}
          onClick={publish} title={errorsLeft>0?"Fix the errors first — they block publishing":""}>
          {published ? <>Published <Ic.check size={13}/></> : <><Ic.share size={13}/> Publish</>}
        </button>
      </div>
    </div>
  );
}
