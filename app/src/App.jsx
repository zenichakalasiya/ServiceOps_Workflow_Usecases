import React, { useState, useEffect, useRef, useReducer } from "react";
import railDashboard from "./assets/rail/dashboard.svg";
import railTicket from "./assets/rail/ticket.svg";
import railUserExcl from "./assets/rail/user-exclamation.svg";
import railRepeat from "./assets/rail/repeat.svg";
import railShare from "./assets/rail/share.svg";
import railLaptop from "./assets/rail/laptop.svg";
import railPatch from "./assets/rail/patch.svg";
import railBox from "./assets/rail/box.svg";
import railProjects from "./assets/rail/projects.svg";
import railBulb from "./assets/rail/bulb-mask.svg";
import railReport from "./assets/rail/report.svg";
import railUserCheck from "./assets/rail/user-check.svg";
import railTasks from "./assets/rail/tasks.svg";
import logo5 from "./assets/rail/logo-5.svg";
import logo6 from "./assets/rail/logo-6.svg";
import logo7 from "./assets/rail/logo-7.svg";
import PublishPopoverV2 from "./PublishHealthV2.jsx";   // V2: stacked scenario cards
// Which publish review renders is env-driven so both can run side by side:
//   npm run dev     → V1 tabs            (http://localhost:5173)
//   npm run dev:v2  → V2 stacked cards   (http://localhost:5174)
const PUB_V2 = import.meta.env.VITE_PUBLISH_V2 === "1";

/* ===== Icons ===== */
const I = (p) => {
  const { sw = 1.7, vb = "0 0 24 24", children, size = 18, color, ...rest } = p;
  return (<svg width={size} height={size} viewBox={vb} fill="none" stroke={color || "currentColor"} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...rest}>{children}</svg>);
};
export const Ic = {
  plus:(p)=><I {...p}><path d="M12 5v14M5 12h14"/></I>,
  addbox:(p)=><I {...p}><rect x="3" y="3" width="18" height="18" rx="3.5"/><path d="M12 8v8M8 12h8"/></I>,
  target:(p)=><I {...p}><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/></I>,
  warn:(p)=><I {...p}><path d="M10.3 3.8L2.6 17.5A2 2 0 004.3 20.5h15.4a2 2 0 001.7-3L13.7 3.8a2 2 0 00-3.4 0z"/><path d="M12 9.5v4M12 16.8h.01"/></I>,
  calendar:(p)=><I {...p}><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></I>,
  bell:(p)=><I {...p}><path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10.5 20a2 2 0 003 0"/></I>,
  gear:(p)=><I {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></I>,
  keyboard:(p)=><I {...p}><rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/></I>,
  warn2:(p)=><I {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></I>,
  chevL:(p)=><I {...p}><path d="M15 6l-6 6 6 6"/></I>,
  chevR:(p)=><I {...p}><path d="M9 6l6 6-6 6"/></I>,
  chevD:(p)=><I {...p}><path d="M6 9l6 6 6-6"/></I>,
  close:(p)=><I {...p}><path d="M6 6l12 12M18 6L6 18"/></I>,
  spark:(p)=><I {...p}><path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4z"/><path d="M5 16l.8 2 .8-2 .8 2M18 4l.6 1.5.6-1.5"/></I>,
  check:(p)=><I {...p} sw={2.2}><path d="M5 12.5l4.2 4.2L19 7"/></I>,
  checkC:(p)=><I {...p}><circle cx="12" cy="12" r="9"/><path d="M8.3 12.3l2.6 2.6L16 9.5"/></I>,
  info:(p)=><I {...p}><circle cx="12" cy="12" r="9"/><path dy="M12 11v5M12 8h.01"/></I>,
  arrow:(p)=><I {...p}><path d="M5 12h14M13 6l6 6-6 6"/></I>,
  undo:(p)=><I {...p}><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 110 10h-4"/></I>,
  branch:(p)=><I {...p}><circle cx="6" cy="6" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><path d="M6 8.2v7.6M8.2 6H16M16 6a8 8 0 01-8 8"/></I>,
  ifelse:(p)=><I {...p}><circle cx="6" cy="5" r="2.2"/><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="19" r="2.2"/><path d="M6 7.2v9.6M6 12h9a3 3 0 013 3v1.6"/></I>,
  flag:(p)=><I {...p}><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></I>,
  trigger:(p)=><I {...p}><path d="M13 2L4.5 13H11l-1 9 8.5-11H12l1-9z"/></I>,
  swap:(p)=><I {...p}><path d="M7 4L3 8l4 4"/><path d="M3 8h13a4 4 0 014 4M17 20l4-4-4-4"/><path d="M21 16H8a4 4 0 01-4-4"/></I>,
  trash:(p)=><I {...p}><path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13"/></I>,
  dots:(p)=><I {...p}><circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none"/></I>,
  copy:(p)=><I {...p}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></I>,
  ext:(p)=><I {...p} size={p.size||13}><path d="M14 4h6v6M20 4l-9 9M18 13v5a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h5"/></I>,
  refresh:(p)=><I {...p} size={p.size||13}><path d="M20 11a8 8 0 00-14-4.6L4 8M4 4v4h4"/><path d="M4 13a8 8 0 0014 4.6L20 16M20 20v-4h-4"/></I>,
  eye:(p)=><I {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></I>,
  dashboard:(p)=><I {...p}><circle cx="12" cy="12" r="9"/><path d="M12 12l4-3"/></I>,
  ticket:(p)=><I {...p}><path d="M4 7.5A1.5 1.5 0 015.5 6h13A1.5 1.5 0 0120 7.5V10a2 2 0 000 4v2.5A1.5 1.5 0 0118.5 18h-13A1.5 1.5 0 014 16.5V14a2 2 0 000-4z"/><path d="M14 6v12"/></I>,
  people:(p)=><I {...p}><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0111 0M16 5.2a3 3 0 010 5.6M19.5 19a5.5 5.5 0 00-3-4.9"/></I>,
  loop:(p)=><I {...p}><path d="M17 3l3 3-3 3"/><path d="M20 6H8a4 4 0 00-4 4M7 21l-3-3 3-3"/><path d="M4 18h12a4 4 0 004-4"/></I>,
  share:(p)=><I {...p}><path d="M12 15V4M8 8l4-4 4 4M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4"/></I>,
  monitor:(p)=><I {...p}><rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M8 20.5h8M12 16.5v4"/></I>,
  box:(p)=><I {...p}><path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/></I>,
  sitemap:(p)=><I {...p}><rect x="9" y="3" width="6" height="5" rx="1.2"/><rect x="3" y="16" width="6" height="5" rx="1.2"/><rect x="15" y="16" width="6" height="5" rx="1.2"/><path d="M12 8v4M6 16v-2h12v2"/></I>,
  bulb:(p)=><I {...p}><path d="M9 18h6M10 21h4M8.5 14a5 5 0 117 0c-.8.8-1.5 1.6-1.5 2.5h-4c0-.9-.7-1.7-1.5-2.5z"/></I>,
  doc:(p)=><I {...p}><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/></I>,
  checklist:(p)=><I {...p}><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 1.5-2M4 12l1 1 1.5-2M4 18l1 1 1.5-2"/></I>,
  zoomin:(p)=><I {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8.5v5M8.5 11h5"/></I>,
  zoomout:(p)=><I {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8.5 11h5"/></I>,
  fit:(p)=><I {...p}><path d="M4 9V5.5A1.5 1.5 0 015.5 4H9M15 4h3.5A1.5 1.5 0 0120 5.5V9M20 15v3.5a1.5 1.5 0 01-1.5 1.5H15M9 20H5.5A1.5 1.5 0 014 18.5V15"/></I>,
  undo2:(p)=><I {...p}><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 110 10h-4"/></I>,
  redo2:(p)=><I {...p}><path d="M15 14l5-5-5-5"/><path d="M20 9H9a5 5 0 100 10h4"/></I>,
  hand:(p)=><I {...p}><path d="M8 11V5.5a1.5 1.5 0 013 0V11m0-.5V4.5a1.5 1.5 0 013 0V11m0-.5V6a1.5 1.5 0 013 0v7a6 6 0 01-6 6h-1.5a5 5 0 01-3.6-1.5L5 14.5a1.6 1.6 0 012.3-2.2L8 13"/></I>,
  cursor:(p)=><I {...p}><path d="M5 3l6.5 16 2.2-6.3L20 10.5z"/></I>,
  flow:(p)=><I {...p}><path d="M5 7l5 5-5 5M12 7l5 5-5 5"/></I>,
  merge:(p)=><I {...p}><path d="M6 21v-5a6 6 0 016-6 6 6 0 006-6V3"/><path d="M9 6l3-3 3 3"/></I>,
  clock:(p)=><I {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/></I>,
  search:(p)=><I {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></I>,
};
// Left rail (Figma "SideMenu"): icon assets exported from the design. `cls` = per-icon inset tweak, `on` = active item.
const RAIL = [
  {k:"dashboard", src:railDashboard}, {k:"ticket", src:railTicket}, {k:"user-exclamation", src:railUserExcl},
  {k:"repeat", src:railRepeat, on:true}, {k:"share", src:railShare}, {k:"laptop", src:railLaptop},
  {k:"patch", src:railPatch, cls:"patch"}, {k:"box", src:railBox, cls:"box"}, {k:"projects", src:railProjects},
  {k:"bulb", src:railBulb}, {k:"report", src:railReport}, {k:"user-check", src:railUserCheck}, {k:"tasks", src:railTasks},
];

/* ===== Data — an OR-ladder: many IF/Else, all leading to the SAME action ===== */
const CONDS = [
  ["Priority", "is", "Critical"],
  ["Impact", "is", "High"],
  ["Urgency", "is", "Urgent"],
  ["Category", "is", "Security"],
  ["Source", "is", "Phone"],
  ["Requester VIP", "is", "Yes"],
  ["SLA Status", "is", "Breached"],
];
const NC = CONDS.length;
const ACTION = "Flag as Major Incident";
const condText = (c) => `${c[0]} ${c[1]} ${c[2]}`;

// Per-condition "Is True" next node on the canvas (null = leave the connector dot unattached).
const NEXTS = [
  { label:"Create Requests", icon:"ticket", desc:"Open a new request" },
  { label:"Get Assets", icon:"box", sub:true, desc:"Fetch linked assets" }, // → 4 nested IF/Else
  { label:"Update Assets", icon:"box", desc:"Set asset status" },
  { label:"Get Requests", icon:"doc", desc:"Fetch related requests" },
  { label:"Send a mail to technician group's manager", icon:"share", desc:"Notify the team manager" },
  null,                                                  // 6th — dot only
  null,                                                  // 7th — dot only
];
// 4 nested IF/Else (2–3 conditions each) reached from "Get Assets"
const NEST_CONDS = [
  ["Asset Type","is","Server"],
  ["Asset State","is","In Use"],
  ["Warranty","is","Expired"],
  ["Location","is","Datacenter"],
];

/* IF/Else node geometry — vertical hierarchy: title / IF tag / condition box / Else tag.
   IF_PORT = vertical center of the condition box (Is True), ELSE_PORT = center of the Else tag (Is False). */
const IFW = 360, IFH = 156, TITLE_PORT = 25, IF_PORT = 60, ELSE_PORT = 134;

// node-selection panel catalogue (matches the "Node Selection" sidebar)
const NODE_SECTIONS = [
  { title:"Conditional Flows", items:[
    { key:"ifelse",  icon:"ifelse", name:"IF / Else",  desc:"Split the workflow into two paths based on a condition" },
    { key:"branch",  icon:"branch", name:"Branch",     desc:"Route to one of many paths based on a field value." },
    { key:"merge",   icon:"merge",  name:"Merge",      desc:"Bring split paths back together into a single flow." },
    { key:"loop",    icon:"loop",   name:"Loop",       desc:"Repeat actions for each item in a list or result set." },
    { key:"wait",    icon:"clock",  name:"Wait Node",  desc:"Pause the workflow for a set time or until a condition is met." },
  ] },
  { title:"ITSM Modules", items:[
    { key:"request", icon:"ifelse", name:"Request",    desc:"Split the workflow into two paths based on a condition" },
    { key:"problem", icon:"branch", name:"Problem",    desc:"Create or update problem records linked to incidents." },
    { key:"change",  icon:"merge",  name:"Change",     desc:"Create or manage change requests and their approvals." },
    { key:"release", icon:"loop",   name:"Release",    desc:"Create or update release records for deployments." },
    { key:"task",    icon:"clock",  name:"Task",       desc:"Split the workflow into two paths based on a condition" },
    { key:"approval",icon:"clock",  name:"Approval",   desc:"Split the workflow into two paths based on a condition" },
  ] },
];

// Workflow Module Configuration (ported from src-reference)
const MODULES = ["Incident", "Request", "Problem", "Change", "Release", "Asset", "Asset Movement", "CMDB", "Task"];
const FREQUENCIES = ["Every 2 minutes", "Hourly", "Daily", "Weekly", "Monthly"];
const SCHEDULE_TYPES = ["One Time", "Recurring"];
// command-bar activities
const CMDS = [
  { key:"addnode",  icon:"plus",      label:"Add node",            desc:"Insert a step into the workflow" },
  { key:"opennode", icon:"ifelse",    label:"Open node",           desc:"Jump to and configure a node" },
  { key:"note",     icon:"doc",       label:"Add sticky note",     desc:"Drop a note on the canvas" },
  { key:"publish",  icon:"share",     label:"Publish workflow",    desc:"Run the pre-publish review" },
  { key:"unpub",    icon:"undo",      label:"Unpublish workflow",  desc:"Take the workflow offline" },
  { key:"execute",  icon:"refresh",   label:"Execute workflow",    desc:"Run it once now" },
  { key:"rename",   icon:"doc",       label:"Rename",              desc:"Change the workflow name" },
  { key:"archive",  icon:"box",       label:"Archive",             desc:"Move to archived workflows" },
];

/* ===== layout engine ===== */
const ft = (b)=>({x:b.x+42, y:b.y});            // flow top
const fb = (b)=>({x:b.x+42, y:b.y+b.h});         // flow bottom
const rm = (b)=>({x:b.x+b.w, y:b.y+b.h/2});      // right middle
const lm = (b)=>({x:b.x, y:b.y+b.h/2});          // left middle
function frame(nodes) {
  const maxX = Math.max(...nodes.map(n=>n.x+n.w));
  const maxY = Math.max(...nodes.map(n=>n.y+n.h));
  return { contentW:Math.max(1200, maxX+500), contentH:Math.max(960, maxY+400) };
}

// Merge node geometry (shared with the renderer): header + one row per input + an empty "add input" slot
const M_W=248, M_HEAD=55, M_PAD=11, M_ROW=38;
const mergeRowCY = (k)=> M_HEAD + M_PAD + k*M_ROW + M_ROW/2;       // center y of input slot k
const mergeHeight = (slots)=> M_HEAD + M_PAD + slots*M_ROW + M_PAD;
// build merge nodes + the edges feeding them, from the merges state
function buildMerges(merges, P, pos) {
  const nodes=[], edges=[];
  (merges||[]).forEach((m,mi)=>{
    const ins = m.inputs.map(id=>P[id]).filter(Boolean);
    if (!ins.length) return;
    const slots = m.inputs.length;                                 // only the inputs the user added (no empty slot)
    const h = mergeHeight(slots);
    const portYs = ins.map(p=>p.y+IF_PORT);
    const cy = (Math.min(...portYs)+Math.max(...portYs))/2;
    let mp = { x: P[m.inputs[0]].x + IFW + 150, y: cy - h/2, w:M_W, h };
    if (pos[m.id]) mp = { ...mp, x:pos[m.id].x, y:pos[m.id].y };
    nodes.push({ id:m.id, type:"merge", ...mp, data:{ inputs:m.inputs, disabled:m.disabled, noEmpty:m.noEmpty, name:"Merge "+(mi+1) } });
    m.inputs.forEach((id,k)=>{ const ip=P[id]; if(!ip) return;
      edges.push({ from:{ x:ip.x+ip.w, y:ip.y+IF_PORT }, to:{ x:mp.x, y:mp.y+mergeRowCY(k) }, kind:"true" }); });
  });
  return { nodes, edges };
}

function buildBefore(pos, converted2, merges) {
  pos = pos || {};
  const NX=80, IFX=470, NW=IFW, NH=IFH, AW=236, AH=72, TOP=80, VSTEP=210;
  const ACTX = IFX + NW + 120;        // next-node (action) column
  const NESTX = ACTX + AW + 120;      // nested IF/Else column (off "Get Assets")
  const P = {};
  P.trig = { x:NX, y:TOP+TITLE_PORT-45, w:268, h:90 };   // centered against the first node's title row
  CONDS.forEach((c,i)=>{ P["if"+i] = { x:IFX, y:TOP+i*VSTEP, w:NW, h:NH }; });
  NEXTS.forEach((nx,i)=>{ if(nx) P["act"+i] = { x:ACTX, y:P["if"+i].y+IF_PORT-TITLE_PORT, w:AW, h:AH }; });
  Object.keys(P).forEach(id=>{ if(pos[id]){ P[id].x=pos[id].x; P[id].y=pos[id].y; } });

  const ifPort = (b)=>({ x:b.x+b.w, y:b.y+IF_PORT });   // Is True (right, IF tag)
  const actIn  = (b)=>({ x:b.x, y:b.y+TITLE_PORT });    // action input — at its title row
  const actOut = (b)=>({ x:b.x+b.w, y:b.y+TITLE_PORT });

  const nodes = [
    { id:"trig", type:"trigger", ...P.trig },
    ...CONDS.map((c,i)=>({ id:"if"+i, type:"ifelse", ...P["if"+i], data:{c, i, leftIn:true} })),
    ...NEXTS.map((nx,i)=> nx ? ({ id:"act"+i, type:"action", ...P["act"+i], data:{ text:nx.label, desc:nx.desc, icon:nx.icon, sub:!!nx.sub } }) : null).filter(Boolean),
  ];
  const edges=[], labels=[];
  // trigger → EACH IF/Else (first is the next step, the rest are parallel nodes)
  CONDS.forEach((c,i)=>{ edges.push({ from:rm(P.trig), to:{ x:P["if"+i].x, y:P["if"+i].y+TITLE_PORT }, kind:"flow" }); });
  NEXTS.forEach((nx,i)=>{ if(nx){                                  // each IF's Is True → its own next node
    edges.push({ from:ifPort(P["if"+i]), to:actIn(P["act"+i]), kind:"true" });
    labels.push({ x:(P["if"+i].x+P["if"+i].w+P["act"+i].x)/2, y:P["if"+i].y+IF_PORT-2, text:"Is True", kind:"true" });
  }});
  // 2nd group: nested sub-flow off "Get Assets" (act1)
  const nest = buildNested(NESTX, P["act1"], converted2, pos);
  nodes.push(...nest.nodes); edges.push(...nest.edges);
  edges.push({ from:actOut(P["act1"]), to:nest.entry, kind:"flow" });

  // merge nodes (user-added — converge two+ "Is True" paths from ANY group, main or nested)
  const allP = {}; nodes.forEach(nd=>{ allP[nd.id] = nd; });
  const mrg = buildMerges(merges, allP, pos);
  nodes.push(...mrg.nodes); edges.push(...mrg.edges);

  const ifs = CONDS.map((c,i)=>P["if"+i]);   // group lasso wraps only the main 7
  const lx=Math.min(...ifs.map(n=>n.x)), ly=Math.min(...ifs.map(n=>n.y));
  const lr=Math.max(...ifs.map(n=>n.x+n.w)), lb=Math.max(...ifs.map(n=>n.y+n.h));
  const lassos = [ { x:lx-16, y:ly-16, w:lr-lx+32, h:lb-ly+32, group:"g1", badge:`Group · ${NC} IF/Else conditions` } ];
  if (nest.lasso) lassos.push(nest.lasso);
  return { nodes, edges, labels, lassos, ...frame(nodes) };
}

// Branch row geometry — one branch per IF/Else condition (1:1), shared with the renderer
const BR_HEADER=48, BR_PAD=10, BR_ROW=72, DEF_ROW=46, FOOTER=38, BR_TAG_OFF=18;
const brRowCY = (j)=> BR_HEADER + BR_PAD + j*BR_ROW + BR_TAG_OFF;        // branch row j — aligned to the "Branch N" tag

// The 2nd group: the nested IF/Else chain off "Get Assets". Renders as 4 IF/Else (+ lasso) or a Branch when converted2.
function buildNested(NESTX, act1, converted2, pos) {
  const baseY = act1.y, nodes=[], edges=[];
  if (!converted2) {
    const P = {};
    NEST_CONDS.forEach((c,k)=>{ P["nest"+k] = { x:NESTX, y:baseY + k*210, w:IFW, h:IFH }; });
    Object.keys(P).forEach(id=>{ if(pos[id]){ P[id].x=pos[id].x; P[id].y=pos[id].y; } });
    NEST_CONDS.forEach((c,k)=>nodes.push({ id:"nest"+k, type:"ifelse", ...P["nest"+k], data:{c, i:k, nested:true, leftIn:k===0} }));
    for (let k=0;k<NEST_CONDS.length-1;k++) edges.push({ from:fb(P["nest"+k]), to:ft(P["nest"+(k+1)]), kind:"flow" });
    const ns = NEST_CONDS.map((c,k)=>P["nest"+k]);
    const lx=Math.min(...ns.map(n=>n.x)), ly=Math.min(...ns.map(n=>n.y)), lr=Math.max(...ns.map(n=>n.x+n.w)), lb=Math.max(...ns.map(n=>n.y+n.h));
    return { nodes, edges, entry:{ x:P["nest0"].x, y:P["nest0"].y+TITLE_PORT },
      lasso:{ x:lx-16, y:ly-16, w:lr-lx+32, h:lb-ly+32, group:"g2", badge:`Group · ${NEST_CONDS.length} IF/Else conditions` } };
  }
  const brH = BR_HEADER + BR_PAD + NEST_CONDS.length*BR_ROW + DEF_ROW + FOOTER;
  let bp = { x:NESTX, y:baseY, w:IFW, h:brH };
  if (pos["nbranch"]) bp = { ...bp, x:pos["nbranch"].x, y:pos["nbranch"].y };
  nodes.push({ id:"nbranch", type:"branch", ...bp, data:{ conds:NEST_CONDS } });
  return { nodes, edges, entry:{ x:bp.x, y:bp.y+TITLE_PORT }, lasso:null };
}

function buildAfter(pos, converted2, merges) {
  pos = pos || {};
  const NX=80, IFX=470, BRW=IFW, AW=236, AH=72, TOP=80;
  const ACTX = IFX + BRW + 120;
  const NESTX = ACTX + AW + 120;
  const brH = BR_HEADER + BR_PAD + NC*BR_ROW + DEF_ROW + FOOTER;
  const P = {};
  P.branch = { x:IFX, y:TOP, w:BRW, h:brH };
  P.trig = { x:NX, y:TOP+TITLE_PORT-45, w:268, h:90 };
  NEXTS.forEach((nx,j)=>{ if(nx) P["act"+j] = { x:ACTX, y:TOP+brRowCY(j)-TITLE_PORT, w:AW, h:AH }; });
  Object.keys(P).forEach(id=>{ if(pos[id]){ P[id].x=pos[id].x; P[id].y=pos[id].y; } });

  const actIn  = (b)=>({ x:b.x, y:b.y+TITLE_PORT });
  const actOut = (b)=>({ x:b.x+b.w, y:b.y+TITLE_PORT });
  const nodes = [
    { id:"trig", type:"trigger", ...P.trig },
    { id:"branch", type:"branch", ...P.branch, data:{} },
    ...NEXTS.map((nx,j)=> nx ? ({ id:"act"+j, type:"action", ...P["act"+j], data:{ text:nx.label, desc:nx.desc, icon:nx.icon, sub:!!nx.sub } }) : null).filter(Boolean),
  ];
  const edges=[], labels=[];
  edges.push({ from:rm(P.trig), to:{ x:P.branch.x, y:P.branch.y+TITLE_PORT }, kind:"flow" });
  NEXTS.forEach((nx,j)=>{ if(nx){                                  // each branch → the same next node the IF/Else fed
    const out = { x:P.branch.x+P.branch.w, y:P.branch.y+brRowCY(j) };
    edges.push({ from:out, to:actIn(P["act"+j]), kind:"branchout" });
    labels.push({ x:(out.x+P["act"+j].x)/2, y:out.y, text:"Branch "+(j+1), kind:"branchout" });
  }});
  // 2nd group: nested sub-flow off "Get Assets" (act1)
  const nest = buildNested(NESTX, P["act1"], converted2, pos);
  nodes.push(...nest.nodes); edges.push(...nest.edges);
  edges.push({ from:actOut(P["act1"]), to:nest.entry, kind:"flow" });

  // merge nodes (work after conversion too — e.g. merging the nested IF/Else group)
  const allP = {}; nodes.forEach(nd=>{ allP[nd.id] = nd; });
  const mrg = buildMerges(merges, allP, pos);
  nodes.push(...mrg.nodes); edges.push(...mrg.edges);

  const lassos = nest.lasso ? [nest.lasso] : [];
  return { nodes, edges, labels, lassos, ...frame(nodes) };
}

function edgePath(s, t) {
  if (Math.abs(s.x - t.x) < 1 || Math.abs(s.y - t.y) < 1) return `M${s.x},${s.y} L${t.x},${t.y}`;
  const mx = (s.x + t.x) / 2;
  return `M${s.x},${s.y} H${mx} V${t.y} H${t.x}`;
}
const EDGE_COLOR = { flow:"#c2cad6", true:"#7ec99a", false:"#ef9ea1", branchout:"#9fc4f2", default:"#cdd5e0" };

/* ===== drag-to-pan ===== */
function useDragScroll() {
  const cleanup = useRef(null);
  return React.useCallback((el) => {
    if (cleanup.current) { cleanup.current(); cleanup.current = null; }
    if (!el) return;
    let down=false, sx=0, sy=0, sl=0, st=0, moved=false;
    const onDown=(e)=>{ if(e.button!==0) return; if(e.target.closest("button,a,input,select,textarea,.gnode,.cnote,.sugg,.reopen,.lasso-badge")) return;
      down=true; moved=false; sx=e.clientX; sy=e.clientY; sl=el.scrollLeft; st=el.scrollTop; el.classList.add("grabbing"); };
    const onMove=(e)=>{ if(!down) return; const dx=e.clientX-sx, dy=e.clientY-sy; if(!moved && Math.abs(dx)+Math.abs(dy)>3) moved=true;
      if(moved){ e.preventDefault(); el.scrollLeft=sl-dx; el.scrollTop=st-dy; } };
    const onUp=()=>{ down=false; el.classList.remove("grabbing"); };
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove, {passive:false});
    window.addEventListener("mouseup", onUp);
    cleanup.current=()=>{ el.removeEventListener("mousedown",onDown); window.removeEventListener("mousemove",onMove); window.removeEventListener("mouseup",onUp); };
  }, []);
}

/* ===== chrome ===== */
function Logo(){return(<div className="logo"><svg viewBox="0 0 32 32" fill="none" width="24" height="24"><circle cx="16" cy="16" r="13" stroke="#e2e8f0" strokeWidth="3.4"/><path d="M16 3a13 13 0 0113 13" stroke="#2680eb" strokeWidth="3.4" strokeLinecap="round"/><path d="M29 16a13 13 0 01-7 11.5" stroke="#27c0c8" strokeWidth="3.4" strokeLinecap="round"/></svg><span className="wm">m<i>o</i>tadata</span></div>);}
function NavBar(){return(<div className="nav"><Logo/><div className="grow"/><button className="nav-plus"><Ic.plus size={19}/></button><button className="nav-ic"><Ic.calendar size={18}/></button><button className="nav-ic"><Ic.bell size={18}/></button><button className="nav-ic"><Ic.gear size={18}/></button><button className="nav-ic"><Ic.keyboard size={18}/></button><button className="nav-ic"><Ic.warn2 size={18}/></button><button className="nav-av">AS</button></div>);}
function RailLogo({size=25}){return(<span className="rail-logo" style={{width:size,height:size}}><img className="l7" src={logo7} alt=""/><img className="l6" src={logo6} alt=""/><img className="l5" src={logo5} alt=""/></span>);}
function Rail(){return(<div className="rail">
  <div className="rail-top">
    <div className="rail-brand"><RailLogo/></div>
    {RAIL.map(r=>(<button key={r.k} className={"rail-item"+(r.on?" on":"")} title={r.k}><span className={"rail-ic "+(r.cls||"")}><img src={r.src} alt=""/></span></button>))}
  </div>
  <div className="rail-bottom"><div className="rail-itsm"><span>ITSM</span></div><RailLogo size={24}/></div>
</div>);}

// full condition label (used by "Go to Previous Node")
const nodeShort = (id) => {
  let m = /^if(\d+)$/.exec(id);   if (m) { const c = CONDS[+m[1]]; return `IF · ${c[0]} ${c[1]} ${c[2]}`; }
  m = /^nest(\d+)$/.exec(id);     if (m) { const c = NEST_CONDS[+m[1]]; return `IF · ${c[0]} ${c[1]} ${c[2]}`; }
  return id;
};
// the node TYPE a merge input comes from (shown beside "Input N")
const nodeTypeName = (id) => {
  if (/^(if|nest)\d+$/.test(id)) return "IF / Else";
  if (id==="branch" || id==="nbranch") return "Branch";
  if (/^act\d+$/.test(id)) return "Action";
  if (id==="trig") return "Trigger";
  return id;
};

/* canvas minimap — node overview + a draggable-ish viewport rect; click to recenter */
function Minimap({ view, zoom }) {
  const W = 184, H = 108;
  const sc = Math.min(W / view.contentW, H / view.contentH);
  const iw = view.contentW * sc, ih = view.contentH * sc;
  const [vp, setVp] = useState({ left:0, top:0, w:0, h:0 });
  useEffect(() => {
    const el = document.querySelector(".canvas"); if (!el) return;
    const update = () => setVp({
      left: (el.scrollLeft / zoom) * sc, top: (el.scrollTop / zoom) * sc,
      w: (el.clientWidth / zoom) * sc, h: (el.clientHeight / zoom) * sc,
    });
    update(); el.addEventListener("scroll", update); window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [zoom, sc, view.contentW, view.contentH]);
  const recenter = (e) => {
    const el = document.querySelector(".canvas"); if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const cx = (e.clientX - r.left) / sc, cy = (e.clientY - r.top) / sc;   // → content coords
    el.scrollTo({ left: cx*zoom - el.clientWidth/2, top: cy*zoom - el.clientHeight/2, behavior:"smooth" });
  };
  return (
    <div className="minimap" style={{ width:W, height:H }} onClick={recenter}>
      <div className="mm-inner" style={{ width:iw, height:ih }}>
        {view.nodes.map(n => (<div key={n.id} className={"mm-node mm-"+n.type} style={{ left:n.x*sc, top:n.y*sc, width:Math.max(3,n.w*sc), height:Math.max(3,n.h*sc) }}/>))}
        <div className="mm-vp" style={{ left:vp.left, top:vp.top, width:vp.w, height:vp.h }}/>
      </div>
    </div>
  );
}

/* sticky note on the canvas — drag to move, double-click to edit */
function Note({ note, S }) {
  const [editing, setEditing] = useState(false);
  const onDown = (e) => {
    if (e.button!==0 || editing) return;
    if (e.target.closest(".cnote-x, .cnote-edit")) return;   // don't drag from the × or while typing
    e.preventDefault(); e.stopPropagation();
    const sx=e.clientX, sy=e.clientY, bx=note.x, by=note.y; let moved=false;
    document.body.style.userSelect="none";
    const onMove=(ev)=>{ const k=window.__scale||1; const dx=(ev.clientX-sx)/k, dy=(ev.clientY-sy)/k;
      if(!moved && Math.abs(dx)+Math.abs(dy)>3) moved=true;
      if(moved) S.moveNote(note.id, Math.max(8,bx+dx), Math.max(8,by+dy)); };
    const onUp=()=>{ window.removeEventListener("mousemove",onMove); window.removeEventListener("mouseup",onUp); document.body.style.userSelect=""; };
    window.addEventListener("mousemove",onMove); window.addEventListener("mouseup",onUp);
  };
  return (
    <div className="cnote" style={{ left:note.x, top:note.y }} onMouseDown={onDown} onDoubleClick={()=>setEditing(true)}>
      {editing
        ? <textarea className="cnote-edit" autoFocus defaultValue={note.text} placeholder="Type your note…"
            onBlur={(e)=>{ S.setNoteText(note.id, e.target.value); setEditing(false); }}/>
        : (note.text
            ? <div className="cnote-text">{note.text}</div>
            : <div className="cnote-ph"><b>I’m a note</b><br/><br/><b>Double click</b> to edit me.</div>)}
      <button className="cnote-x" title="Delete note" onClick={()=>S.deleteNote(note.id)}><Ic.close size={12}/></button>
    </div>
  );
}

/* ===== graph node renderer ===== */
function NodeCard({ n, S }) {
  const sel = (n.type==="ifelse" && S.selected==="group") || (n.type==="branch" && S.selected==="branch");
  const fl = (S.flash===n.id ? " flash" : "") + (S.annTop[n.id] ? " ann-"+S.annTop[n.id] : "")
    + (S.sfSeg && S.sfSeg.includes(n.id) ? " sf-member" : "");
  const common = { left:n.x, top:n.y, width:n.w, minHeight:n.h };
  if (n.type === "trigger")
    return (<div className={"gnode"+fl} style={common} onMouseDown={(e)=>S.startDrag(e,n)}>
      <div className="gh"><span className="gic trig"><Ic.trigger size={15}/></span> Trigger</div>
      <div className="condbox" style={{marginTop:8}}>Incident is <b>created</b></div>
      <span className="handle" style={{left:n.w-5, top:n.h/2-5}}/>
    </div>);
  if (n.type === "ifelse") {
    const { c } = n.data;
    return (<div className={"gnode gif"+(sel?" nsel":"")+fl} style={common} onMouseDown={(e)=>S.startDrag(e,n)}>
      <div className="gif-title"><span className="gic ifelse"><Ic.ifelse size={15}/></span> IF / Else</div>
      <div className="gif-iftag"><span className="ppill">IF</span></div>
      <div className="gif-cond"><div className="condbox sm trunc" title={`${c[0]} ${c[1]} ${c[2]}`}>{c[0]} {c[1]} <b>{c[2]}</b></div></div>
      <div className="gif-elsetag"><span className="ppill">Else</span></div>
      {n.data.leftIn && <span className="handle" style={{left:-5, top:TITLE_PORT-5}}/>}
      <span className="handle" style={{left:n.w-5, top:IF_PORT-5, borderColor:"#7ec99a"}}/>
      <span className="handle" style={{left:n.w-5, top:ELSE_PORT-5, borderColor:"#ef9ea1"}}/>
      {/* hover the node → "+" to pick the next node off the Is True port */}
      <span className="addnode" style={{left:n.w+24, top:IF_PORT-14}} title="Add next node"
        onMouseDown={e=>e.stopPropagation()} onClick={(e)=>{ e.stopPropagation(); S.openNodeSel(n.id); }}><Ic.plus size={15}/></span>
    </div>);
  }
  if (n.type === "action") {
    const { text, desc, icon, sub } = n.data;
    return (<div className={"gnode gact"+fl} style={common} onMouseDown={(e)=>S.startDrag(e,n)}>
      <div className="gact-h"><span className="gic action">{React.createElement(Ic[icon]||Ic.flag,{size:16})}</span>
        <div className="gact-title" title={text}>{text}</div></div>
      {desc && <div className="gact-desc">{desc}</div>}
      <span className="handle" style={{left:-5, top:TITLE_PORT-5}}/>
      {sub && <span className="handle" style={{left:n.w-5, top:TITLE_PORT-5, borderColor:"#9fc4f2"}}/>}
    </div>);
  }
  if (n.type === "merge") {
    const inputs = n.data.inputs;
    const selm = S.selMerge===n.id && S.selected==="merge";
    return (<div className={"gnode gmerge"+(selm?" nsel":"")+(n.data.disabled?" disabled":"")+fl} style={common} onMouseDown={(e)=>S.startDrag(e,n)}>
      <div className="gmerge-h">
        <span className="gic merge"><Ic.merge size={16}/></span>
        <div className="gmerge-title">{n.data.name || "Merge"}</div>
      </div>
      <div className="gmerge-desc">Waits for its inputs, then continues as one flow</div>
      {inputs.map((id,k)=>(
        <div className="gmerge-slot" key={id} style={{top:M_HEAD+M_PAD+k*M_ROW, height:M_ROW}}>
          <span className="handle" style={{left:-5, top:M_ROW/2-5, borderColor:"#7ec99a"}}/>
          <span className="gmerge-order">Input {k+1}</span>
          <span className="gmerge-src" title={nodeShort(id)}>{nodeTypeName(id)}</span>
        </div>
      ))}
      <span className="handle" style={{left:n.w-5, top:M_HEAD/2-5}}/>
    </div>);
  }
  if (n.type === "end")
    return (<div className={"gnode"+fl} style={{...common, borderStyle:"dashed", background:"#fafbfc", display:"flex", alignItems:"center", gap:9}} onMouseDown={(e)=>S.startDrag(e,n)}>
      <span className="gic end"><Ic.arrow size={14}/></span>
      <div className="gsub" style={{marginTop:0, fontWeight:700}}>{n.data.text}</div>
      <span className="handle" style={{left:37, top:-5}}/>
    </div>);
  if (n.type === "branch") {
    const conds = n.data.conds || CONDS;
    return (<div className={"gnode gbranch"+(sel?" nsel":"")+fl} style={{...common, padding:0}} onMouseDown={(e)=>S.startDrag(e,n)}>
      <div className="gh" style={{padding:"12px 12px 0", height:BR_HEADER}}><span className="gic branch"><Ic.branch size={15}/></span> Branch</div>
      <div style={{padding:`${BR_PAD}px 12px 0`}}>
        {conds.map((c,j)=>(
          <div className="brow2" style={{height:BR_ROW}} key={j}>
            <div className="bp"><span className="ppill branchp">Branch {j+1}</span></div>
            <div className="condbox sm" title={`If ${c[0]} ${c[1]} ${c[2]}`}>If {c[0]} {c[1]} <b>{c[2]}</b></div>
          </div>
        ))}
        <div className="brow2" style={{height:DEF_ROW, justifyContent:"center"}}>
          <div className="bp"><span className="ppill">Default</span><span className="gsub" style={{marginTop:0,marginLeft:6}}>No match → continue</span></div>
        </div>
      </div>
      <div style={{height:FOOTER, display:"flex", alignItems:"center", justifyContent:"flex-end", padding:"0 14px", borderTop:"1px solid var(--line-2)"}}>
        <span style={{color:"var(--blue)",fontSize:12,fontWeight:700,display:"inline-flex",alignItems:"center",gap:4}}>Collapse <Ic.chevD size={13} style={{transform:"rotate(180deg)"}}/></span>
      </div>
      <span className="handle" style={{left:-5, top:TITLE_PORT-5}}/>
      {conds.map((c,j)=>(<span key={"o"+j} className="handle" style={{left:n.w-5, top:BR_HEADER+BR_PAD+j*BR_ROW+BR_TAG_OFF-5, borderColor:"#9fc4f2"}}/>))}
      <span className="handle" style={{left:n.w-5, top:BR_HEADER+BR_PAD+conds.length*BR_ROW+DEF_ROW/2-5, borderColor:"#cdd5e0"}}/>
    </div>);
  }
  return null;
}

function GraphCanvas({ S, view, children }) {
  const pan = useDragScroll();
  const z = S.zoom;
  return (
    <div className={"canvas"+(S.tool==="pan"?" pan-tool":"")} ref={pan}>
      <div className="canvas-scaler" style={{ width:view.contentW*z, height:view.contentH*z }}>
      <div className="content" style={{ width:view.contentW, height:view.contentH, transform:`scale(${z})`, transformOrigin:"0 0" }}>
        {children}
        <svg className="edges" width={view.contentW} height={view.contentH}>
          {view.edges.map((e,i)=>{
            const d = e.rightExit ? `M${e.from.x},${e.from.y} H${e.from.x+34} V${e.to.y} H${e.to.x}` : edgePath(e.from,e.to);
            return (<path key={i} d={d} fill="none" stroke={EDGE_COLOR[e.kind]} strokeWidth={2} strokeDasharray={e.kind==="default"?"5 4":"none"} />);
          })}
        </svg>
        {view.labels.map((l,i)=>(<div key={i} className={"elabel "+l.kind} style={{left:l.x, top:l.y}}>{l.text}</div>))}
        {view.nodes.map((n)=>(<NodeCard key={n.id} n={n} S={S} />))}
        {Object.entries(S.ann).map(([id, list])=>{
          const n = view.nodes.find(x=>x.id===id);
          if (!n) return null;
          const LBL = { err:"Error", warn:"Warning" };
          const ICN = { err:Ic.warn, warn:Ic.warn };
          const confs = list.filter(a=>a.kind==="conf");   // collapse all conflicts on a node into ONE count badge
          const single = list.filter(a=>a.kind!=="conf");
          return (
            <div key={"ann"+id} className="nbadges" style={{ left:n.x, top:n.y-44, width:n.w }}>
              {single.map((a,i)=>(
                <div key={i} className={"nbadge "+a.kind}>
                  {React.createElement(ICN[a.kind], { size:15 })}
                  <span className="lbl">{LBL[a.kind]}</span>
                  <div className="ntip">{a.tip}</div>
                </div>
              ))}
              {confs.length>0 && (
                <div className="nbadge conf">
                  <Ic.loop size={15}/>
                  <span className="lbl">Conflict{confs.length>1?"s":""}</span>
                  <span className="nb-n">{confs.length}</span>
                  <div className="ntip conftip" onClick={e=>e.stopPropagation()}>
                    <b>{confs.length} workflow{confs.length>1?"s":""} conflict here</b>
                    <div className="ct-reason">{NODE_REASON[confs[0].conf.otype]}</div>
                    <button className="ct-link" onClick={()=>S.showConflictDetail(id)}>Show details <Ic.arrow size={12}/></button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {/* sub-flow conflict trail — drawn only while its sidebar card is hovered (keeps the canvas calm) */}
        {S.sfSeg && (()=>{
          const seg = S.sfSeg.map(id=>view.nodes.find(n=>n.id===id)).filter(Boolean);
          if (seg.length<2) return null;
          return (<React.Fragment key="sftrail">
            <svg className="sf-trail" width={view.contentW} height={view.contentH}>
              {seg.slice(0,-1).map((a,i)=>{ const [f,t]=segPorts(a,seg[i+1]); return <path key={i} d={edgePath(f,t)} className="sf-trail-path"/>; })}
            </svg>
            <div className="sf-chip" style={{ left:seg[0].x, top:seg[0].y-34 }}><Ic.flow size={12}/> Flow conflict</div>
          </React.Fragment>);
        })()}
      </div>
      </div>
    </div>
  );
}

/* ===== reusable condition list (same conditions in IF/Else and Branch) ===== */
function CondList({ conds = CONDS }) {
  const [open, setOpen] = useState(0);
  return (<>
    {conds.map((c, i) => {
      const isOpen = open === i;
      return (
        <div className="condwrap" key={i}>
          <div className="condhd" onClick={()=>setOpen(isOpen?-1:i)}>
            {isOpen ? <Ic.chevD size={14} color="#94a3b8"/> : <Ic.chevR size={14} color="#94a3b8"/>}
            Condition {i+1}
            {!isOpen && <span style={{marginLeft:"auto",fontSize:11.5,fontWeight:600,color:"var(--muted)"}}>{condText(c)}</span>}
          </div>
          {isOpen && (<>
            <div className="condgrid"><div className="sel filled">{c[0]} <Ic.chevD size={14}/></div><div className="sel filled">{c[1]} <Ic.chevD size={14}/></div></div>
            <div className="valrow"><span className="dd">Direct <Ic.chevD size={12}/></span><div className="valbox">{c[2]}</div></div>
          </>)}
        </div>
      );
    })}
  </>);
}

/* ===== side popover — IF/Else group (the configured conditions) ===== */

/* Existing workflows this draft collides with. Exactly one is currently ACTIVE
   (published + activated and running); the rest are published-but-idle. */
export const EXIST_WFS = {
  wf12: { code:"WF-12", name:"VIP Escalation",      status:"active",    lastRun:"Jun 12, 2026 · 14:32" },
  wf07: { code:"WF-07", name:"Major Incident",      status:"published", lastRun:"Jun 12, 2026 · 11:08" },
  wf30: { code:"WF-30", name:"SLA Breach Watch",    status:"published", lastRun:"Jun 12, 2026 · 09:15" },
  wf68: { code:"WF-68", name:"Priority Bump",       status:"published", lastRun:"Jun 11, 2026 · 22:11" },
  wf44: { code:"WF-44", name:"Security Triage",     status:"published", lastRun:"Jun 10, 2026 · 16:20" },
  wf21: { code:"WF-21", name:"Auto-Assign Network", status:"published", lastRun:"Jun 11, 2026 · 18:45" },
  wf61: { code:"WF-61", name:"Requester Notify",    status:"published", lastRun:"Jun 12, 2026 · 08:02" },
  wf53: { code:"WF-53", name:"Asset Sync",          status:"published", lastRun:"Jun 09, 2026 · 13:50" },
};
// per-overlap-type fix recipes (the "how can the user fix it" shown in the Fixes tab)
const CFIX = {
  trigger:   { ic:"trigger", word:"Trigger",   chips:["Run after it","Narrow trigger","Allow both"] },
  condition: { ic:"ifelse",  word:"Condition", chips:["Add excluding condition","Allow both"] },
  action:    { ic:"flag",    word:"Action",    chips:["Write conditionally","Set write order","Allow both"] },
};

/* ===== Pre-publish review (Publish drawer) =====
   A simulated draft run checks every step, then reports in 4 buckets:
   Errors (block publish) · Warnings (review, won't block) · Conflicts (cross-workflow) · Fixes (known, one-click). */
export const REVIEW = {
  errors: [
    { id:"e1", node:"Send a mail…", icon:"share", tgt:"act4", title:"Recipient is required", fixTitle:"Set a recipient",
      tip:"Set a recipient — the mail step can't send without one",
      detail:"This mail step has no recipient. Pick who should receive it — the workflow can't run while this is empty.",
      chips:["Technician Group Manager","IT Helpdesk Group"] },
    { id:"e2", node:"Get Requests", icon:"doc", tgt:"act3", title:"Filter criteria not set", fixTitle:"Add filter criteria",
      tip:"Add filter criteria — this step would pull every record",
      detail:"This step fetches requests but no criteria is configured, so it would pull every record. Set at least one filter.",
      chips:["Open · last 7 days","Linked to this incident"] },
  ],
  warnings: [
    { id:"w1", node:"IF/Else group", icon:"ifelse", tgt:"if5", title:"2 “Is True” paths have no next step",
      tip:"This path ends silently — attach a next node so something runs when it matches",
      detail:"“Requester VIP is Yes” and “SLA Status is Breached” end silently — nothing runs when they match. Attach a next node, or remove them if unused." },
    { id:"w2", node:"Trigger", icon:"trigger", tgt:"trig", title:"High-volume trigger",
      tip:"This fires on every new incident — expect bursts during business hours",
      detail:"This fires on every new incident. Expect bursts during business hours — every action below runs for each one." },
  ],
  // 10 cross-workflow conflicts. `wf` → EXIST_WFS; `tgt` is the colliding node in THIS draft.
  // Several share a tgt → that node collides with multiple workflows (shown as a count on canvas).
  conflicts: [
    { id:"c1",  wf:"wf12", tgt:"trig",  otype:"trigger",   element:"Incident is created",
      title:"Trigger shared with VIP Escalation", detail:"Both fire on Incident created and match “Requester VIP is Yes”, so both run on the same ticket and their assignments may fight." },
    { id:"c2",  wf:"wf07", tgt:"trig",  otype:"trigger",   element:"Incident is created",
      title:"Trigger shared with Major Incident", detail:"Major Incident also fires on Incident created. Two priority changes may race on the same ticket." },
    { id:"c3",  wf:"wf30", tgt:"trig",  otype:"trigger",   element:"Incident is created",
      title:"Trigger shared with SLA Breach Watch", detail:"SLA Breach Watch starts its clock on the same trigger — ordering matters so the SLA isn’t set after escalation." },
    { id:"c4",  wf:"wf68", tgt:"if0",   otype:"condition", element:"Priority is Critical",
      title:"Condition overlaps Priority Bump", detail:"Priority Bump also matches “Priority is Critical” and writes Priority — your value may be overwritten." },
    { id:"c5",  wf:"wf07", tgt:"if0",   otype:"condition", element:"Priority is Critical",
      title:"Condition overlaps Major Incident", detail:"Major Incident matches the same “Priority is Critical” branch and acts on it too." },
    { id:"c6",  wf:"wf44", tgt:"if3",   otype:"condition", element:"Category is Security",
      title:"Condition overlaps Security Triage", detail:"Security Triage matches “Category is Security” and routes the ticket elsewhere — they may disagree." },
    { id:"c11", wf:"wf07", tgt:"if3",   otype:"condition", element:"Category is Security",
      title:"Condition overlaps Major Incident", detail:"Major Incident also matches “Category is Security” and may escalate the same ticket in parallel." },
    { id:"c12", wf:"wf21", tgt:"if3",   otype:"condition", element:"Category is Security",
      title:"Condition overlaps Auto-Assign Network", detail:"Auto-Assign Network routes Security-category tickets too, so the two routings may disagree." },
    { id:"c7",  wf:"wf21", tgt:"act0",  otype:"action",    element:"set Assignment",
      title:"Both set assignment on Create Requests", detail:"Auto-Assign Network writes the assignee on the created request — last writer wins, so your assignment may be replaced." },
    { id:"c8",  wf:"wf61", tgt:"act0",  otype:"action",    element:"set Assignment",
      title:"Requester Notify touches the same request", detail:"Requester Notify updates the same created request; ordering decides which note lands first." },
    { id:"c9",  wf:"wf53", tgt:"act2",  otype:"action",    element:"set Asset Status",
      title:"Both write Asset Status on Update Assets", detail:"Asset Sync writes the asset status field too — concurrent writes can clobber each other." },
    { id:"c10", wf:"wf53", tgt:"nest0", otype:"condition", element:"Asset Type is Server",
      title:"Asset check overlaps Asset Sync", detail:"Asset Sync evaluates “Asset Type is Server” on the same assets — both may act on the same records." },
  ],
  fixes: [
    { id:"f1", group:1, node:"IF/Else group", icon:"branch", tgt:"if0", title:"Convert 7 IF/Else → 1 Branch",
      detail:"Known cleanup: the 7 stacked IF/Else can become one Branch (7 paths + Default), each path keeping its next step. Same outcomes — one click, reversible." },
    { id:"f2", group:2, node:"After Get Assets", icon:"branch", tgt:"nest0", title:"Convert 4 IF/Else → 1 Branch",
      detail:"The 4 asset checks after “Get Assets” can also become one Branch. Same outcomes, lighter structure." },
  ],
};
// every review card starts expanded; the user collapses what they don't need
const ALL_OPEN = Object.fromEntries(
  [...REVIEW.errors, ...REVIEW.warnings, ...REVIEW.conflicts, ...REVIEW.fixes].map(x=>[x.id, true]));

// ---- conflicts are grouped BY NODE: one card per colliding node, listing the workflows on it ----
const NODE_LABEL = { trig:"Trigger", if0:"IF · Priority is Critical", if3:"IF · Category is Security",
  act0:"Create Requests", act2:"Update Assets", nest0:"IF · Asset Type is Server" };
const NODE_ICON  = { trigger:"trigger", condition:"ifelse", action:"flag" };
const ROW_ICON   = { Trigger:"trigger", Condition:"ifelse", Action:"flag" };   // comparison-table row labels → icons
// the reason is shared across all workflows colliding on the same node (so it's shown once)
const NODE_REASON = {
  trigger:"These workflows all start from the same trigger, so they run together on every matching ticket.",
  condition:"These workflows match this same condition, so they act on the same set of tickets.",
  action:"These workflows write the same field on this step — whichever runs last overwrites the others.",
};
const CONF_GROUPS = Object.values(REVIEW.conflicts.reduce((acc,c)=>{
  (acc[c.tgt] = acc[c.tgt] || { tgt:c.tgt, otype:c.otype, element:c.element, label:NODE_LABEL[c.tgt]||c.tgt, items:[] }).items.push(c);
  return acc;
}, {}));
const groupOf = (tgt) => CONF_GROUPS.find(g=>g.tgt===tgt);

// ---- SUB-FLOW (chain) conflicts: a contiguous segment of nodes overlapping other workflows ----
// Kept intentionally small (one chain, two overlap points) so the canvas/data never feel overwhelmed.
// Lives only while the nested group is un-converted (needs2); converting restructures it away.
const SUBFLOWS = [
  // MAIN flow: Trigger → Priority is Critical → Create Request — collides with 3 workflows.
  // It SUBSUMES the per-node conflicts on these nodes: resolving the flow clears them too.
  { id:"s2", label:"Critical-incident intake", segment:["trig","if0","act0"], detailed:true,
    path:"Trigger → Priority is Critical → Create Request",
    overlaps:[
      { nodeLabel:"Trigger", what:"Incident is created", otype:"trigger" },
      { nodeLabel:"Priority is Critical", what:"Priority is Critical", otype:"condition" },
      { nodeLabel:"Create Requests", what:"creates a request", otype:"action" },
    ],
    subsumes:["c1","c2","c3","c4","c5","c7","c8"],   // node conflicts cleared when the flow is resolved
    workflows:[
      { wf:"wf12", why:"Fires on the same trigger and the same Priority = Critical branch, then raises priority on the very ticket you’re creating a request for — the two updates race.",
        rows:[ {k:"Trigger",a:"Incident is created",b:"Incident is created",hot:true},
               {k:"Condition",a:"Priority is Critical",b:"Priority is Critical",hot:true},
               {k:"Action",a:"Create Request",b:"Raise Priority to Critical",hot:false} ] },
      { wf:"wf07", why:"Same trigger and the same Priority = Critical condition, and it also creates a major-incident record — duplicating the request this flow creates.",
        rows:[ {k:"Trigger",a:"Incident is created",b:"Incident is created",hot:true},
               {k:"Condition",a:"Priority is Critical",b:"Priority is Critical",hot:true},
               {k:"Action",a:"Create Request",b:"Create Major-Incident record",hot:true} ] },
      { wf:"wf30", why:"Shares the trigger and starts an SLA clock; if it runs after this flow, the SLA is set on an already-created request.",
        rows:[ {k:"Trigger",a:"Incident is created",b:"Incident is created",hot:true},
               {k:"Condition",a:"Priority is Critical",b:"SLA target at risk",hot:false},
               {k:"Action",a:"Create Request",b:"Start SLA timer",hot:false} ] },
    ] },
];
const subflowWfs = (s) => s.workflows ? s.workflows.map(w=>w.wf) : [...new Set(s.points.map(p=>p.wf))];
// trail leg between two segment nodes: rightward if the next node is to the right, else downward
const segPorts = (a, b) => b.x >= a.x + a.w - 8
  ? [{ x:a.x+a.w, y:a.y+a.h/2 }, { x:b.x, y:b.y+b.h/2 }]
  : [{ x:a.x+a.w/2, y:a.y+a.h }, { x:b.x+b.w/2, y:b.y }];

// the other workflow involved in the conflict (read-only context for awareness + resolution)
const CONFLICT_WF = {
  name:"Workflow 12 · VIP Escalation", status:"Published", trigger:"Incident · Is Created",
  plain:"When an incident is created and the requester is a VIP, this workflow raises the priority to Critical, requests escalation approval, and notifies the duty manager.",
  steps:["Incident Created (Trigger)","If Requester VIP is Yes","Raise Priority to Critical","Notify Duty Manager"],
  overlap:"Requester VIP is Yes",
};

/* Anchored "Same-trigger workflows" panel at the trigger node (conflict awareness, Option-5 pattern) */
function ConflictPanel({ x, y, S, onClose, onPreview }) {
  const [hover, setHover] = useState(false);
  return (
    <div className="confpanel" style={{ left:x, top:y }}>
      <svg width="46" height="2" style={{ position:"absolute", left:-46, top:26 }}><line x1="0" y1="1" x2="46" y2="1" stroke="#ddd2fa" strokeWidth="1.5" strokeDasharray="3 3"/></svg>
      <div className="confpanel-h">
        <Ic.layers size={15}/>
        <span style={{flex:1}}>Same-trigger workflows</span>
        <span className="ccount">2</span>
        <button className="sp-act" style={{width:24,height:24,border:"none",color:"#5a40c0"}} onClick={onClose}><Ic.close size={13}/></button>
      </div>
      <div className="confpanel-b">
        <div className="wfrow cur">
          <span className="wfic"><Ic.loop size={13}/></span>
          <div style={{flex:1,minWidth:0}}><div className="wfname">Workflow 16 <span style={{color:"var(--faint)",fontWeight:600}}>· this workflow</span></div><div className="wfsub">12 steps</div></div>
          <span className="statpill draft">Draft</span>
        </div>
        <div className="wfrow" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onClick={onPreview}>
          <span className="wfic"><Ic.loop size={13}/></span>
          <div style={{flex:1,minWidth:0}}><div className="wfname">{CONFLICT_WF.name}</div><div className="wfsub">{CONFLICT_WF.steps.length} steps</div></div>
          <span className="statpill pub">Published</span>
          {hover && (
            <div className="wfpeek">
              {CONFLICT_WF.steps.map((s,i)=>(<div key={i} className="wfpeek-row"><span className="dotn"/>{s}</div>))}
              <div style={{fontSize:10.5,color:"var(--faint)",padding:"5px 2px 0"}}>Click to open a read-only preview</div>
            </div>
          )}
        </div>
        <div className="confpanel-foot">
          <span style={{fontSize:11,color:"var(--faint)",fontWeight:600}}>Both fire on <b style={{color:"var(--ink-2)"}}>Incident created</b></span>
          <button className="link" onClick={()=>{ onClose(); S.setPublishView("conflict"); S.select("publish"); }}>Resolve conflict →</button>
        </div>
      </div>
    </div>
  );
}

/* Read-only preview of the other workflow (from the anchored panel) */
function ConflictPreview({ S, onClose }) {
  return (<>
    <div className="scrim fade-in" onClick={onClose}/>
    <div className="modal-wrap pop-in">
      <div className="modal" style={{width:520, maxHeight:560}}>
        <div className="modal-head">
          <span className="pi" style={{background:"var(--purple-bg)",color:"var(--purple)"}}><Ic.loop size={16}/></span>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <h2 style={{fontSize:15.5,fontWeight:800,margin:0,color:"#1c2533"}}>{CONFLICT_WF.name}</h2>
              <span className="statpill pub">Published</span>
            </div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{CONFLICT_WF.trigger}</div>
          </div>
          <button className="sp-act" onClick={onClose}><Ic.close size={16}/></button>
        </div>
        <div className="modal-body">
          <p style={{fontSize:12.5,color:"var(--muted)",lineHeight:1.55,margin:"0 0 13px"}}>{CONFLICT_WF.plain}</p>
          {CONFLICT_WF.steps.map((s,i)=>(
            <div key={i} className="wfstep"><span className="wfstep-n">{i+1}</span>{s}
              {s.includes(CONFLICT_WF.overlap) && <span className="ppill" style={{marginLeft:"auto",color:"#5a40c0",background:"var(--purple-bg)",borderColor:"var(--purple-line)"}}>overlap</span>}</div>
          ))}
        </div>
        <div className="modal-foot">
          <span style={{fontSize:11.5,color:"var(--faint)"}}>Read-only preview</span>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
            <button className="btn btn-outline btn-sm" onClick={()=>S.notify("info","Opening “Workflow 12 · VIP Escalation”…")}>Open full workflow</button>
          </div>
        </div>
      </div>
    </div>
  </>);
}

// workflow code chip with an info icon → hover shows last execution date + time
function WfChip({ wfk }) {
  const w = EXIST_WFS[wfk];
  if (!w) return null;
  return (
    <span className="wfchip">{w.code}
      <span className="wfinfo"><Ic.info size={12}/>
        <span className="wfinfo-tip">Last execution<br/><b>{w.lastRun}</b></span>
      </span>
    </span>
  );
}
const StatusPill = ({ wfk }) => {
  const w = EXIST_WFS[wfk]; if (!w) return null;
  return w.status==="active"
    ? <span className="statpill active"><span className="adot"/> Active · running</span>
    : <span className="statpill pub">Published · idle</span>;
};
// short canvas-tooltip line for a conflict
const confTip = (c) => `Overlaps ${EXIST_WFS[c.wf]?.name} on ${c.element}`;

function ReviewItem({ kind, item, done, doneLabel, children, open, onToggle, onHover, onLeave, showRight }) {
  return (
    <div className={"ritem"+(onHover?" hoverable":"")} onMouseEnter={onHover} onMouseLeave={onLeave}>
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
          {showRight && <div className="ritem-show">{showRight}</div>}
        </div>
      )}
    </div>
  );
}

// Segmented filter — the ONE place counts live; chips toggle the single list below
function FilterBar({ filter, setFilter, counts }) {
  const TABS = [
    { k:"all",  label:"All" },
    { k:"err",  label:"Errors" },
    { k:"warn", label:"Warnings" },
    { k:"conf", label:"Conflicts" },
    { k:"fix",  label:"Fixes" },
  ];
  return (
    <div className="fbar">
      {TABS.map(t=>(
        <button key={t.k} className={"fchip "+t.k+(filter===t.k?" on":"")} onClick={()=>setFilter(t.k)}>
          {t.label} <span className="n">{counts[t.k]===0 && t.k!=="all" ? <Ic.check size={11}/> : counts[t.k]}</span>
        </button>
      ))}
    </div>
  );
}

/* Lighthouse-style progress ring: checks passed (green) · needs review (amber) · failing (red).
   Spins while the draft pass runs; full green + check when everything is clear. */
export function HealthRing({ running, allClear, passed, total, errN, attnN }) {
  const R = 16, C = 2 * Math.PI * R;
  if (running) return (
    <svg className="hring" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r={R} fill="none" stroke="var(--blue-100)" strokeWidth="3.5"/>
      <circle className="hring-spin" cx="20" cy="20" r={R} fill="none" stroke="var(--blue)" strokeWidth="3.5"
        strokeLinecap="round" strokeDasharray={`${C*0.28} ${C}`}/>
    </svg>
  );
  const segs = [
    { n: passed, color: "var(--green)" },
    { n: attnN,  color: "var(--amber)" },
    { n: errN,   color: "var(--red)" },
  ].filter(s => s.n > 0);
  let off = 0;
  return (
    <svg className="hring" width="40" height="40" viewBox="0 0 40 40">
      <g transform="rotate(-90 20 20)">
        <circle cx="20" cy="20" r={R} fill="none" stroke="var(--line-2)" strokeWidth="3.5"/>
        {segs.map((s, i) => {
          const el = (
            <circle key={i} cx="20" cy="20" r={R} fill="none" stroke={s.color} strokeWidth="3.5"
              strokeDasharray={`${C*s.n/total} ${C}`} strokeDashoffset={-off}/>
          );
          off += C * s.n / total;
          return el;
        })}
      </g>
      {allClear
        ? <path d="M13.5 20.5l4 4L26.5 16" stroke="var(--green)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        : <text x="20" y="21" textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize:10, fontWeight:800, fill:"var(--ink-2)", fontFamily:"inherit" }}>{passed}/{total}</text>}
    </svg>
  );
}

/* clean dropdown — input-style trigger + (optionally searchable) menu (matches the reference) */
function Picker({ value, placeholder, options, onChange, search }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ql = q.trim().toLowerCase();
  const opts = search ? options.filter(o=>!ql || o.toLowerCase().includes(ql)) : options;
  const close = () => { setOpen(false); setQ(""); };
  return (
    <div className="picker">
      <button className={"pick-trigger"+(value?"":" ph")} onClick={()=>setOpen(o=>!o)}>
        <span>{value || placeholder}</span><Ic.chevD size={16}/>
      </button>
      {open && (<>
        <div className="prevscrim" onClick={close}/>
        <div className="picker-menu">
          {search && <div className="picker-search"><Ic.search size={14} color="#94a3b8"/><input autoFocus placeholder="Search" value={q} onChange={e=>setQ(e.target.value)}/></div>}
          <div className="picker-list">
            {opts.map(o=>(
              <button key={o} className={"picker-opt"+(o===value?" on":"")} onClick={()=>{ onChange(o); close(); }}>
                {o}{o===value && <Ic.check size={14}/>}
              </button>
            ))}
            {!opts.length && <div className="picker-empty">No match</div>}
          </div>
        </div>
      </>)}
    </div>
  );
}

/* Workflow Module Configuration — Name / Type / Module / Schedule (ported from src-reference) */
function ModulePopover({ S }) {
  const c = S.mod, set = S.setMod;
  const next = c.name && c.module;
  return (
    <div className="sp">
      <div className="sp-top"><div style={{flex:1}}/><button className="sp-act" onClick={()=>S.select(null)}><Ic.close size={15}/></button></div>
      <div className="sp-scroll">
        <div className="sp-title"><span className="gic trig"><Ic.loop size={16}/></span><h2>Workflow Module Configuration</h2></div>
        <div className="sp-blurb">Pick an Event or Schedule to start this workflow. <a>Doc <Ic.ext/></a></div>

        <div className="field"><label className="lbl2">Workflow Name <span className="req">*</span></label>
          <input className="inp" value={c.name} onChange={e=>set({ name:e.target.value })} placeholder="Name"/></div>

        <div className="field"><label className="lbl2">Select Workflow Type</label>
          <div className="seg2 blue"><button className={c.kind==="event"?"on":""} onClick={()=>set({ kind:"event" })}>Event</button><button className={c.kind==="periodic"?"on":""} onClick={()=>set({ kind:"periodic" })}>Periodic</button></div>
          <div className="infonote"><Ic.info size={14}/><span>{c.kind==="event"
            ? "Runs automatically when something happens — like a new ticket, a status change, or an SLA breach."
            : "Runs on a schedule you set — daily, weekly, or at a specific time, whether or not anything has changed."}</span></div>
        </div>

        <div className="field"><label className="lbl2">Select module <span className="req">*</span></label>
          <Picker value={c.module} placeholder="Select Module" options={MODULES} onChange={v=>set({ module:v })} search/></div>

        {c.kind==="periodic" && (<>
          <div className="field"><label className="lbl2">Schedule Type <span className="req">*</span></label>
            <Picker value={c.scheduleType} placeholder="Select Schedule Type" options={SCHEDULE_TYPES} onChange={v=>set({ scheduleType:v })}/></div>
          {c.scheduleType==="Recurring" && (
            <div className="field"><label className="lbl2">Frequency <span className="req">*</span></label>
              <Picker value={c.frequency} placeholder="Select Interval" options={FREQUENCIES} onChange={v=>set({ frequency:v })}/></div>
          )}
          <div className="field"><label className="lbl2">Start At <span className="req">*</span></label>
            <div className="datefield"><input className="inp" style={{border:"none",padding:0,flex:1}} placeholder="Select Date"/><Ic.clock size={16} color="var(--blue)"/></div></div>
          <div className="infonote amber"><Ic.warn2 size={14}/><span>You’ve set this workflow to run on a schedule. At this frequency, only up to <b>100 records</b> will be processed per cycle. To run more, increase the time interval.</span></div>
        </>)}
      </div>
      <div className="sp-foot">
        <div style={{flex:1}}/>
        <button className="btn btn-pri btn-sm" disabled={!next} style={!next?{opacity:.5,cursor:"not-allowed"}:null} onClick={()=>{ S.notify("ok","Module configured — pick a trigger next."); S.select("trigger"); }}>Next</button>
      </div>
    </div>
  );
}

/* Command bar — every workflow activity in one searchable list */
function CommandBar({ S }) {
  const [q, setQ] = useState("");
  const ql = q.trim().toLowerCase();
  const items = CMDS.filter(x => !ql || x.label.toLowerCase().includes(ql));
  return (
    <div className="sp">
      <div className="sp-top"><div style={{flex:1}}/><button className="sp-act" onClick={()=>S.select(null)}><Ic.close size={15}/></button></div>
      <div className="sp-scroll">
        <div className="sp-title"><span className="gic trig"><Ic.search size={16}/></span><h2>Command bar</h2></div>
        <div className="sp-blurb">Search and run any workflow action.</div>
        <div className="nsearch"><Ic.search size={15} color="#94a3b8"/><input autoFocus placeholder="Type a command…" value={q} onChange={e=>setQ(e.target.value)}/></div>
        {items.map(it=>(
          <button key={it.key} className="nsrow" onClick={()=>S.runCmd(it.key)}>
            <span className="nsrow-ic">{React.createElement(Ic[it.icon]||Ic.box, { size:18 })}</span>
            <div style={{minWidth:0}}><div className="nsrow-name">{it.label}</div><div className="nsrow-desc">{it.desc}</div></div>
          </button>
        ))}
        {!items.length && <div className="fempty"><Ic.search size={15}/> No command matches</div>}
      </div>
    </div>
  );
}

/* one Next-Node row: icon → connector → card (label + dashed add steps, optional parallel) */
function NnsRow({ S, icon="trigger", iconStyle, label, addText, parallel, src="trig" }) {
  return (
    <div className="nns-row">
      <span className="nns-ic" style={iconStyle}>{React.createElement(Ic[icon]||Ic.trigger, { size:16 })}</span>
      <div className="nns-card">
        <div className="nns-label">{label}</div>
        <button className="addstep" onClick={()=>S.openNodeSel(src)}><Ic.addbox size={16} color="#94a3b8"/> {addText}</button>
        {parallel && <button className="addstep" onClick={()=>S.openNodeSel(src)}><Ic.addbox size={16} color="#94a3b8"/> Add parallel node</button>}
      </div>
    </div>
  );
}

/* Node Selection panel — opens when a node's "+" is clicked (replaces the current drawer) */
function NodeSelectionPanel({ S }) {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const ql = q.trim().toLowerCase();
  const secs = NODE_SECTIONS.filter(s => tab==="all" || (tab==="cond" && s.title==="Conditional Flows") || (tab==="itsm" && s.title==="ITSM Modules"));
  return (
    <div className="sp">
      <div className="sp-top"><div style={{flex:1}}/><button className="sp-act" onClick={()=>S.select(S.converted?"branch":"group")}><Ic.close size={15}/></button></div>
      <div className="sp-scroll">
        <div className="sp-title"><h2>{S.addCtx?.replace ? "Replace The Node" : "Node Selection"}</h2></div>
        <div className="sp-blurb">{S.addCtx?.replace ? "Pick a node to replace this step." : "Pick a step/node to add to your workflow."}</div>
        <div className="nsearch"><Ic.search size={15} color="#94a3b8"/><input placeholder="Search actions, conditions, or modules…" value={q} onChange={e=>setQ(e.target.value)}/></div>
        <div className="nstabs">
          <button className={tab==="all"?"on":""} onClick={()=>setTab("all")}>All</button>
          <button className={tab==="cond"?"on":""} onClick={()=>setTab("cond")}>Conditional Flows</button>
          <button className={tab==="itsm"?"on":""} onClick={()=>setTab("itsm")}>ITSM Modules Asset &amp; CMDB</button>
        </div>
        {secs.map(sec=>{
          const items = sec.items.filter(it => !ql || it.name.toLowerCase().includes(ql));
          if (!items.length) return null;
          return (
            <div key={sec.title} className="nssec-wrap">
              <div className="nssec">{sec.title}</div>
              {items.map(it=>(
                <button key={it.key} className="nsrow" onClick={(e)=>S.pickNode(it.key, e)}>
                  {it.key==="merge" && S.merges.length>0
                    ? <span className="nsrow-ic submenu"><span className="ic-d"><Ic.merge size={18}/></span><span className="ic-h"><Ic.chevL size={18}/></span></span>
                    : <span className="nsrow-ic">{React.createElement(Ic[it.icon]||Ic.box, { size:18 })}</span>}
                  <div style={{minWidth:0}}><div className="nsrow-name">{it.name}</div><div className="nsrow-desc">{it.desc}</div></div>
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Merge node configuration (matches the Merge sidebar) */
function MergePopover({ S }) {
  const m = S.merges.find(x=>x.id===S.selMerge);
  const [showPrev, setShowPrev] = useState(false);
  const [menu, setMenu] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [mtype, setMtype] = useState("all");
  const [waitBy, setWaitBy] = useState("cal");
  const reset = () => { setTitle(""); setDesc(""); setMtype("all"); setWaitBy("cal"); S.notify("info","Merge configuration reset"); };
  if (!m) return null;
  return (
    <div className="sp">
      <div className="sp-top">
        <button className={"gobk"+(showPrev?" on":"")} style={{flex:1,justifyContent:"flex-start"}} onClick={()=>setShowPrev(v=>!v)}><Ic.chevL size={14}/> Go to Previous Node <Ic.checklist size={14}/></button>
        <button className="sp-act" title="Replace node" onClick={()=>S.openNodeSel(m.id, true)}><Ic.swap size={15}/></button>
        <button className="sp-act danger" title="Delete node" onClick={()=>S.deleteMerge(m.id)}><Ic.trash size={15}/></button>
        <div style={{position:"relative"}}>
          <button className="sp-act" title="More" onClick={()=>setMenu(v=>!v)}><Ic.dots size={15}/></button>
          {menu && (<>
            <div className="prevscrim" onClick={()=>setMenu(false)}/>
            <div className="dotsmenu">
              <button className="dm-item" onClick={()=>{ setMenu(false); S.duplicateMerge(m.id); }}><Ic.copy size={14}/> Duplicate</button>
              <button className="dm-item" onClick={()=>{ setMenu(false); S.toggleMergeDisabled(m.id); }}>{m.disabled ? <><Ic.check size={14}/> Enable</> : <><Ic.close size={14}/> Disable</>}</button>
              <button className="dm-item" onClick={()=>{ setMenu(false); reset(); }}><Ic.undo size={14}/> Reset fields</button>
              <div className="dm-sep"/>
              <button className="dm-item danger" onClick={()=>{ setMenu(false); S.deleteMerge(m.id); }}><Ic.trash size={14}/> Delete</button>
            </div>
          </>)}
        </div>
        <button className="sp-act" onClick={()=>S.select(null)}><Ic.close size={15}/></button>
      </div>
      {/* dropdown (overlays, doesn't push the scroll) */}
      {showPrev && (<>
        <div className="prevscrim" onClick={()=>setShowPrev(false)}/>
        <div className="prevdrop">
          <div className="prevlist-h">{m.inputs.length} inputs merge into this node</div>
          {m.inputs.map(id=>(
            <button key={id} className="prevrow" onClick={()=>{ setShowPrev(false); S.openGroup(/^nest/.test(id)?2:1); S.showOnCanvas(id); }}>
              <span className="gic ifelse" style={{width:24,height:24,flex:"0 0 24px"}}><Ic.ifelse size={13}/></span>
              <span className="prevrow-t">{nodeShort(id)}</span>
              <Ic.chevR size={13} color="#94a3b8"/>
            </button>
          ))}
        </div>
      </>)}
      <div className="sp-scroll">
        <div className="sp-title"><span className="gic" style={{background:"var(--blue-50)",color:"var(--blue)"}}><Ic.merge size={16}/></span><h2>Merge {S.merges.findIndex(x=>x.id===m.id)+1}</h2></div>
        <div className="sp-blurb">Brings split paths back together — once the chosen inputs arrive, the workflow continues as one. <a>Doc <Ic.ext/></a></div>

        <div className="field"><label className="lbl2">Title <span className="req">*</span></label><input className="inp" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title"/></div>
        <div className="field"><label className="lbl2">Description <span className="req">*</span></label><textarea className="inp" rows="3" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description"/></div>

        <div className="field"><label className="lbl2">Merge Type <span className="req">*</span></label>
          <div className="seg2"><button className={mtype==="all"?"on":""} onClick={()=>setMtype("all")}>Wait for All</button><button className={mtype==="any"?"on":""} onClick={()=>setMtype("any")}>Wait for Any</button></div></div>

        <div className="field"><label className="lbl2">Maximum Wait Based On</label>
          <div className="seg2"><button className={waitBy==="cal"?"on":""} onClick={()=>setWaitBy("cal")}>Calendar Hours</button><button className={waitBy==="biz"?"on":""} onClick={()=>setWaitBy("biz")}>Business Hours</button></div></div>

        <div className="field"><label className="lbl2">Duration <span className="req">*</span></label>
          <div className="durrow"><span className="dd">Direct <Ic.chevD size={12}/></span><div className="durval">Select Duration</div><Ic.clock size={16} color="var(--blue)"/></div></div>

        <div className="nns">
          <h3>Next Node Selection</h3>
          <p className="sub">Pick the next step in your workflow</p>
          <NnsRow S={S} icon="clock" iconStyle={{background:"var(--blue-50)",color:"var(--blue)"}} label="Next Step" addText="Add the next step after merge node" parallel src={m.id}/>
        </div>
      </div>
    </div>
  );
}

function PublishPopover({ S }) {
  const [name, setName] = useState("Workflow 16");
  const [desc, setDesc] = useState("");
  const [phase, setPhase] = useState("run");          // 'run' → draft pass, 'done' → results
  const { resolved, setResolved, acked, setAcked } = S;   // lifted to App so canvas badges stay in sync
  const filter = S.pubFilter, setFilter = S.setPubFilter;  // lifted so the canvas can deep-link to the Fixes tab
  const view = S.publishView, setView = S.setPublishView;  // review | fixes | conflict (lifted for canvas deep-links)
  const [confChoice, setConfChoice] = useState(null);
  const { confNode, setConfNode, sfDetail, setSfDetail } = S;   // lifted so the canvas tooltip can deep-link
  const [openItem, setOpenItem] = useState(ALL_OPEN);   // all cards expanded by default
  const [wfHover, setWfHover] = useState(null);         // { wfc, top } — workflow whose overlap detail flyout shows (left of drawer)
  const [published, setPublished] = useState(false);
  const [cleared, setCleared] = useState(false);        // brief celebratory state when the LAST error is resolved
  const prevErr = useRef(null);
  const groupLeft = (g) => g.items.filter(c=>!S.confResolved[c.id]).length;   // unresolved conflicts on a node

  useEffect(() => { const t = setTimeout(()=>{ setPhase("done"); S.markReviewed(); }, 1400); return ()=>clearTimeout(t); }, []);
  const rerun = () => { setPhase("run"); setTimeout(()=>setPhase("done"), 1400); };

  // counts = outstanding items only; the filter bar is the ONLY place they're displayed
  const errorsLeft = REVIEW.errors.filter(e=>!resolved[e.id]).length;
  const warnsLeft = REVIEW.warnings.filter(w=>!acked[w.id]).length;
  const confLeft = REVIEW.conflicts.filter(c=>!S.confResolved[c.id]).length;
  const subflows = SUBFLOWS.filter(s => !s.needs2 || !S.converted2);   // s1 hides once its group is restructured
  const subflowsLeft = subflows.filter(s=>!S.sfResolved[s.id]).length;
  // nodes already represented by a flow conflict — don't list their node cards separately
  const flowNodes = new Set(subflows.filter(s=>s.detailed).flatMap(s=>s.segment));
  const confGroups = CONF_GROUPS.filter(g=>!flowNodes.has(g.tgt));
  const confNodesLeft = confGroups.filter(g=>groupLeft(g)>0).length;   // Conflicts tab counts the remaining colliding NODES
  // the Fixes tab fixes everything actionable: error fixes + conversions + flow + node-group conflict fixes
  const fixesLeft = (S.converted?0:1) + (S.converted2?0:1) + errorsLeft + subflowsLeft + confNodesLeft;
  const counts = { err:errorsLeft, warn:warnsLeft, conf:confNodesLeft + subflowsLeft, fix:fixesLeft };
  counts.all = counts.err + counts.warn + counts.conf;
  const advisory = counts.warn + counts.conf;   // non-blocking items left after errors are gone
  // detect the moment the last error clears → fire a brief success pulse
  useEffect(() => {
    if (phase==="done" && !published && prevErr.current>0 && errorsLeft===0) {
      setCleared(true); const t=setTimeout(()=>setCleared(false), 1600);
      prevErr.current = errorsLeft; return ()=>clearTimeout(t);
    }
    prevErr.current = errorsLeft;
  }, [errorsLeft, phase, published]);
  const canPublish = phase==="done" && errorsLeft===0 && name.trim() && !published;
  const toggleItem = (id)=>setOpenItem(s=>({...s,[id]:!s[id]}));
  const publish = () => { if(!canPublish) return; setPublished(true); S.notify("ok", `Published — “${name}” is now live.`); };

  const verdict = phase==="run"
    ? { cls:"run", ic:<Ic.refresh size={19}/>, title:"Running a draft pass…", sub:"We dry-run every step to verify the workflow works before it goes live." }
    : published
    ? { cls:"ok", ic:<Ic.checkC size={20}/>, title:"Published — workflow is live", sub:"Everything ran as intended in the draft pass." }
    : cleared
    ? { cls:"ok pulse", ic:<Ic.checkC size={20}/>, title:"Errors cleared — ready to publish", sub:advisory>0 ? `Nothing is blocking now · ${advisory} advisory item${advisory>1?"s":""} left to review.` : "Nothing is blocking — you’re good to publish." }
    : errorsLeft>0
    ? { cls:"err", ic:<Ic.warn2 size={20}/>, title:`${errorsLeft} error${errorsLeft>1?"s":""} must be fixed to publish`, sub:"Review the findings below — errors block publishing, the rest won't." }
    : advisory>0
    ? { cls:"ok", ic:<Ic.checkC size={20}/>, title:"No blocking issues — ready to publish", sub:`${advisory} advisory item${advisory>1?"s":""} left to review — they won’t block you.` }
    : { cls:"ok", ic:<Ic.checkC size={20}/>, title:"Everything is running as intended", sub:"All checks passed — nothing left to review." };

  // one flat, severity-sorted list driven by the filter; the Fixes tab lists every known fix
  const items = filter==="fix"
    ? [
        ...REVIEW.errors.map(e=>({ kind:"efix", item:e })),
        ...REVIEW.fixes.map(f=>({ kind:"fix", item:f })),
        ...subflows.map(s=>({ kind:"sffix", item:s })),       // flow conflict fixes (upfront)
        ...confGroups.map(g=>({ kind:"gfix", item:g })),      // node-group conflict fixes
      ]
    : [
        ...REVIEW.errors.map(e=>({ kind:"err", item:e })),
        ...REVIEW.warnings.map(w=>({ kind:"warn", item:w })),
        ...subflows.map(s=>({ kind:"subflow", item:s })),     // flow conflicts FIRST (broader scope)
        ...confGroups.map(g=>({ kind:"conf", item:g })),      // then the remaining node-grouped cards
      ].filter(x => filter==="all" || x.kind===filter || (filter==="conf" && x.kind==="subflow"));

  // ---- Sub-flow (chain) conflict detail: full scan of the flow vs each existing workflow ----
  if (view === "subflow" && sfDetail) {
    const s = sfDetail;
    const done = !!S.sfResolved[s.id];
    return (
      <div className="sp">
        <div className="sp-top">
          <button className="sp-act" onClick={()=>{ setView("review"); setFilter("conf"); }} title="Back to conflicts"><Ic.chevL size={16}/></button>
          <div style={{flex:1}}/>
          <button className="sp-act" onClick={()=>S.select(null)}><Ic.close size={15}/></button>
        </div>
        <div className="sp-scroll"
          onMouseEnter={()=>S.hoverSubflow(s)} onMouseLeave={S.leaveSubflow}>
          <div className="sp-title"><span className="gic" style={{background:"var(--purple-bg)",color:"var(--purple)"}}><Ic.flow size={16}/></span>
            <h2>{s.label}</h2><span className="sf-tag" style={{marginLeft:2}}>flow</span></div>
          <p className="sp-blurb" style={{marginTop:8}}>This <b>whole flow</b> collides with <b>{s.workflows.length} existing workflows</b>. Resolving it here also clears the per-node conflicts on these {s.overlaps.length} nodes — you don’t have to fix each node separately.</p>

          {/* collapsed workflow cards: reason only; the overlap detail shows in a flyout on hover */}
          <label className="lbl2" style={{margin:"4px 0 7px"}}>{s.workflows.length} workflows it collides with</label>
          {s.workflows.map((wfc,i)=>{
            const w = EXIST_WFS[wfc.wf];
            return (
              <div className="sfwf" key={i}
                onMouseEnter={(e)=>setWfHover({ wfc, top:e.currentTarget.getBoundingClientRect().top })}
                onMouseLeave={()=>setWfHover(null)}>
                <div className="sfwf-h">
                  <span className="wfic2"><Ic.loop size={13}/></span>
                  <span className="wfrow2-name">{w.code} · {w.name}</span>
                  <span className={"wfstat "+w.status}><span className="wfstat-dot"/>{w.status==="active"?"Active":"Published"}</span>
                </div>
                <p className="sfwf-why"><b>Why:</b> {wfc.why}</p>
                <div className="sfwf-foot">
                  <span className="wfrow2-sub">Last run {w.lastRun}</span>
                  <button className="link" onClick={()=>S.openExistingWorkflow(w)}><Ic.ext size={12}/> View workflow</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* overlap-detail flyout — appears to the LEFT of the drawer, over the canvas, on card hover */}
        {wfHover && (()=>{
          const { wfc } = wfHover; const w = EXIST_WFS[wfc.wf];
          const top = Math.max(64, Math.min(wfHover.top, window.innerHeight - 40 - (54 + wfc.rows.length*34)));
          return (
            <div className="wf-flyout" style={{ top }}>
              <div className="wf-flyout-h"><span className="wfic2" style={{width:24,height:24,flex:"0 0 24px"}}><Ic.loop size={12}/></span> {w.code} · what overlaps</div>
              <div className="sfcmp">
                <div className="sfcmp-head"><span/><span>This flow</span><span/><span>{w.code}</span></div>
                {wfc.rows.map((r,j)=>(
                  <div className={"sfcmp-row"+(r.hot?" hot":"")} key={j}>
                    <span className="sfcmp-k">{React.createElement(Ic[ROW_ICON[r.k]]||Ic.info, { size:14 })}</span>
                    <span className="sfcmp-a">{r.a}</span>
                    <span className="sfcmp-op">{r.hot?"=":"≠"}</span>
                    <span className="sfcmp-b">{r.b}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
        <div className="sp-foot">
          <button className="btn btn-ghost btn-sm" onClick={()=>{ setView("review"); setFilter("conf"); }}>Back</button>
          {done
            ? <span className="done-row"><Ic.checkC size={14}/> Resolved <button className="link" style={{marginLeft:8}} onClick={()=>S.unresolveSubflow(s)}>Change</button></span>
            : <button className="btn btn-pri btn-sm" onClick={()=>{ S.resolveSubflow(s); S.notify("ok","Flow conflict resolved — the node conflicts on this flow are cleared too"); setView("review"); setFilter("conf"); }}>Resolve flow conflict</button>}
        </div>
      </div>
    );
  }

  // ---- Node conflict detail: the workflows colliding on one node (back → conflicts list) ----
  if (view === "confnode" && confNode) {
    const g = confNode;
    return (
      <div className="sp">
        <div className="sp-top">
          <button className="sp-act" onClick={()=>{ setView("review"); setFilter("conf"); }} title="Back to conflicts"><Ic.chevL size={16}/></button>
          <div style={{flex:1}}/>
          <button className="sp-act" onClick={()=>S.select(null)}><Ic.close size={15}/></button>
        </div>
        <div className="sp-scroll">
          <div className="sp-title"><span className="gic" style={{background:"var(--purple-bg)",color:"var(--purple)"}}>{React.createElement(Ic[NODE_ICON[g.otype]], { size:16 })}</span><h2>{g.label}</h2></div>
          {/* shared node-base reason — shown once for all workflows on this node */}
          <div className="overlap" style={{marginTop:4}}>
            <span className={"ov-ic "+NODE_ICON[g.otype]}>{React.createElement(Ic[NODE_ICON[g.otype]], { size:13 })}</span>
            <span className="ov-t">{CFIX[g.otype].word} overlap</span>
            <span className="ov-el">{g.element}</span>
          </div>
          <p className="sp-blurb" style={{marginTop:0}}>{NODE_REASON[g.otype]}</p>

          <label className="lbl2" style={{marginBottom:8}}>{g.items.length} existing workflow{g.items.length>1?"s":""} conflict here</label>
          {g.items.map(c=>{
            const w = EXIST_WFS[c.wf];
            return (
              <div className="wfrow2" key={c.id}>
                <div className="wfrow2-top">
                  <span className="wfic2"><Ic.loop size={14}/></span>
                  <span className="wfrow2-name">{w.code} · {w.name}</span>
                  <span className={"wfstat "+w.status}><span className="wfstat-dot"/>{w.status==="active"?"Active · running":"Published · idle"}</span>
                </div>
                <div className="wfrow2-foot">
                  <span className="wfrow2-sub">Last run {w.lastRun}</span>
                  <button className="link" onClick={()=>S.openExistingWorkflow(w)}><Ic.ext size={12}/> View workflow</button>
                </div>
              </div>
            );
          })}
          <p className="hint" style={{marginTop:12}}>Opening a workflow shows it in a new tab with the same conflict highlighted, so you can fix the overlap from that side.</p>
        </div>
      </div>
    );
  }

  // ---- Conflict sub-screen: compare the two workflows, then choose a resolution ----
  if (view === "conflict") {
    const c = REVIEW.conflicts[0];
    const done = !!S.confResolved[c.id];
    return (
      <div className="sp">
        <div className="sp-top">
          <button className="sp-act" onClick={()=>setView("review")} title="Back to publish review"><Ic.chevL size={16}/></button>
          <div style={{flex:1}}/>
          <button className="sp-act" onClick={()=>S.select(null)}><Ic.close size={15}/></button>
        </div>
        <div className="sp-scroll">
          <div className="sp-title"><span className="gic" style={{background:"var(--purple-bg)",color:"var(--purple)"}}><Ic.loop size={16}/></span><h2>Conflict</h2></div>
          <div className="sp-blurb">Two workflows fire on the same trigger and match the same condition — both will run on the same ticket.</div>

          <div className="cmp">
            <div className="cmpcard cur">
              <div className="cmphead">This workflow <span className="statpill draft">Draft</span></div>
              <div className="cmprow"><Ic.trigger size={12}/> Incident is created</div>
              <div className="cmprow hot"><Ic.ifelse size={12}/> Requester VIP is Yes</div>
            </div>
            <div className="cmpvs"><Ic.loop size={15}/></div>
            <div className="cmpcard">
              <div className="cmphead">VIP Escalation <span className="statpill pub">Published</span></div>
              <div className="cmprow"><Ic.trigger size={12}/> Incident is created</div>
              <div className="cmprow hot"><Ic.ifelse size={12}/> Requester VIP is Yes</div>
            </div>
          </div>
          <p className="hint" style={{margin:"0 0 16px"}}>The highlighted condition is the overlap — assignments from the two runs may fight each other.</p>

          <label className="lbl2" style={{marginBottom:8}}>How do you want to resolve it?</label>
          {!done ? (<>
            <div className={"optsel"+(confChoice==="allow"?" on":"")} onClick={()=>setConfChoice("allow")}>
              <span className="radio2"/>
              <div><b>Allow both — intended</b>
                <p>Records this overlap as a deliberate decision. Both workflows keep running on matching incidents, and this conflict is cleared from the review.</p></div>
            </div>
            <div className="optsel dis">
              <span className="radio2"/>
              <div><b>Merge workflows <span className="soon">Coming soon</span></b>
                <p>Combine the two into a single workflow — one trigger, with branch paths covering both behaviours.</p></div>
            </div>
          </>) : (
            <div className="optpop" style={{background:"#f0faf4"}}>
              <div className="oph" style={{marginBottom:0}}>
                <span className="opic"><Ic.checkC size={15} color="var(--green)"/></span>
                <div style={{flex:1}}><div className="optitle" style={{fontSize:12.5}}>Resolved — both run intentionally</div></div>
                <button className="link" onClick={()=>{ S.unresolveConflict(c.id); setConfChoice(null); }}>Change</button>
              </div>
            </div>
          )}
        </div>
        <div className="sp-foot">
          <button className="btn btn-ghost btn-sm" onClick={()=>setView("review")}>Back</button>
          {!done && (
            <button className="btn btn-pri btn-sm" disabled={confChoice!=="allow"} style={confChoice!=="allow"?{opacity:.55,cursor:"not-allowed"}:null}
              onClick={()=>{ S.resolveConflict(c.id); S.notify("ok","Conflict resolved — both workflows will run intentionally"); setView("review"); }}>
              Apply resolution
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---- Fixes sub-screen: back arrow (top-left) returns to the publish review, state intact ----
  if (view === "fixes") return (
    <div className="sp">
      <div className="sp-top">
        <button className="sp-act" onClick={()=>setView("review")} title="Back to publish review"><Ic.chevL size={16}/></button>
        <div style={{flex:1}}/>
        <button className="sp-act" onClick={()=>S.select(null)}><Ic.close size={15}/></button>
      </div>
      <div className="sp-scroll">
        <div className="sp-title"><span className="gic trig" style={{background:"var(--blue-50)",color:"var(--blue)"}}><Ic.spark size={16}/></span><h2>Fixes</h2></div>
        <div className="sp-blurb">Known issues we already know how to fix. Each applies in one click and is fully reversible.</div>
        {REVIEW.errors.map(e=>{
          const done = !!resolved[e.id];
          return (
            <div className="ritem hoverable" key={e.id} onMouseEnter={()=>S.hoverCanvas(e.tgt)} onMouseLeave={S.leaveCanvas}>
              <div className="ritem-h" style={{cursor:"default"}}>
                <span className={"ritem-dot "+(done?"done":"fix")}/>
                <span className={"ritem-title"+(done?" done":"")}>{done ? e.fixTitle+" — applied" : e.fixTitle}</span>
                <span className="ritem-node">{e.node}</span>
              </div>
              <div className="ritem-body">
                <p className="ritem-detail">{e.detail}</p>
                {!done ? (
                  <div className="rchips">{e.chips.map(c=>(
                    <button key={c} className="rchip" onClick={()=>setResolved(r=>({...r,[e.id]:c}))}><Ic.check size={12}/> {c}</button>
                  ))}</div>
                ) : (
                  <div className="ritem-acts"><span className="done-row"><Ic.checkC size={14}/> {resolved[e.id]}</span>
                    <button className="link" onClick={()=>setResolved(r=>{const n={...r}; delete n[e.id]; return n;})}>Change</button></div>
                )}
              </div>
            </div>
          );
        })}
        {REVIEW.fixes.map(f=>{
          const done = f.group===1 ? S.converted : S.converted2;
          return (
            <div className="ritem hoverable" key={f.id} onMouseEnter={()=>S.hoverCanvas(f.tgt)} onMouseLeave={S.leaveCanvas}>
              <div className="ritem-h" style={{cursor:"default"}}>
                <span className={"ritem-dot "+(done?"done":"fix")}/>
                <span className={"ritem-title"+(done?" done":"")}>{done ? f.title+" — applied" : f.title}</span>
                <span className="ritem-node">{f.node}</span>
              </div>
              <div className="ritem-body">
                <p className="ritem-detail">{f.detail}</p>
                <div className="ritem-acts">
                  {done
                    ? <span className="done-row"><Ic.checkC size={14}/> Applied — reversible from the Branch panel</span>
                    : <button className="btn btn-outline btn-sm" onClick={()=> f.group===1 ? S.applyFix1() : S.applyFix2()}>Apply fix</button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="sp-foot">
        <button className="btn btn-ghost btn-sm" onClick={()=>setView("review")}>Back</button>
        <button className="btn btn-pri btn-sm" disabled={fixesLeft===0} style={fixesLeft===0?{opacity:.55,cursor:"not-allowed"}:null}
          onClick={()=>{
            if(!S.converted) S.applyFix1();
            if(!S.converted2) S.applyFix2();
            setResolved(r=>{ const n={...r}; REVIEW.errors.forEach(e=>{ if(!n[e.id]) n[e.id]=e.chips[0]; }); return n; });
          }}>
          {fixesLeft===0 ? <>All fixes applied <Ic.check size={13}/></> : `Apply all (${fixesLeft})`}
        </button>
      </div>
    </div>
  );

  return (
    <div className="sp">
      <div className="sp-top">
        <button className="sp-top gobk" style={{flex:1,justifyContent:"flex-start"}} onClick={()=>S.select(S.converted?"branch":"group")}><Ic.chevL size={14}/> Back to configuration</button>
        <button className="sp-act" onClick={rerun} title="Re-run draft pass"><Ic.refresh size={15}/></button>
        <button className="sp-act" onClick={()=>S.select(null)}><Ic.close size={15}/></button>
      </div>
      <div className="sp-scroll">
        <div className="sp-title"><span className="gic trig"><Ic.share size={16}/></span><h2>Publish workflow</h2></div>
        <div className="sp-blurb">Name your workflow and review its health. Errors must be fixed; warnings, conflicts and fixes are good to review but won't block you.</div>

        <div className="field"><label className="lbl2">Name <span className="req">*</span></label>
          <input className="inp" value={name} onChange={e=>setName(e.target.value)} placeholder="Workflow name"/></div>
        <div className="field"><label className="lbl2">Description <span className="req">*</span></label>
          <textarea className="inp" rows="2" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What does this workflow do?"/></div>

        <div className="revhead">
          <div className={"health "+verdict.cls}>
            <div className="health-top">
              <HealthRing running={phase!=="done"} allClear={published || counts.all===0}
                passed={12 - counts.all} total={12} errN={errorsLeft} attnN={warnsLeft + counts.conf}/>
              <div className="health-verdict">Workflow Health</div>
              {phase==="done" && !published && <div className="health-meta">Draft pass · just now</div>}
            </div>
            <div className="health-sub"><b>{verdict.title}</b><br/>{verdict.sub}</div>
          </div>
          {phase==="done" && <FilterBar filter={filter} setFilter={setFilter} counts={counts} />}
        </div>

        {phase==="done" && (<>
          {items.length===0 && <div className="fempty"><Ic.checkC size={15}/> Nothing outstanding here</div>}

          {items.map(({kind, item})=>{
            const hov = { onHover:()=>S.hoverCanvas(item.tgt), onLeave:S.leaveCanvas };
            if (kind==="err") return (
              <ReviewItem key={item.id} kind="err" item={item} done={!!resolved[item.id]} doneLabel={item.title+" — resolved"}
                open={!!openItem[item.id]} onToggle={()=>toggleItem(item.id)} {...hov}
                showRight={!resolved[item.id] && <button className="btn btn-outline btn-sm" onClick={()=>setFilter("fix")}>Apply Fix</button>}>
                {resolved[item.id] && (
                  <div className="ritem-acts"><span className="done-row"><Ic.checkC size={14}/> {resolved[item.id]}</span>
                    <button className="link" onClick={()=>setResolved(r=>{const n={...r}; delete n[item.id]; return n;})}>Change</button></div>
                )}
              </ReviewItem>
            );
            if (kind==="warn") return (
              <ReviewItem key={item.id} kind="warn" item={item} done={!!acked[item.id]}
                open={!!openItem[item.id]} onToggle={()=>toggleItem(item.id)} {...hov}
                showRight={acked[item.id]
                  ? <span className="done-row" style={{color:"var(--muted)"}}><Ic.check size={13}/> Acknowledged</span>
                  : <button className="btn btn-ghost btn-sm" onClick={()=>setAcked(a=>({...a,[item.id]:true}))}>Got it</button>} />
            );
            if (kind==="conf") {   // item is a NODE GROUP — whole card navigates to its workflow list
              const left = groupLeft(item);
              const done = left===0;
              return (
                <div className={"confcard"+(done?" done":"")} key={item.tgt}
                  onMouseEnter={()=>S.hoverCanvas(item.tgt)} onMouseLeave={S.leaveCanvas}
                  onClick={()=>{ setConfNode(item); setView("confnode"); }}>
                  <div className="confcard-h">
                    <span className={"ritem-dot "+(done?"done":"conf")}/>
                    <span className="confcard-t">{item.label}</span>
                    <span className={"confcard-n"+(done?" done":"")}>{done ? <><Ic.check size={11}/> resolved</> : `${left} workflow${left>1?"s":""}`}</span>
                    <Ic.chevR size={14} color="#94a3b8" style={{flex:"0 0 14px"}}/>
                  </div>
                  <p className="confcard-r">{NODE_REASON[item.otype]}</p>
                </div>
              );
            }
            if (kind==="subflow") {   // a CHAIN conflict — distinct card; hover lights the trail on canvas
              const wfs = subflowWfs(item);
              if (item.detailed) {     // rich flow → whole card opens the detail sub-screen
                const sdone = !!S.sfResolved[item.id];
                return (
                  <div className={"confcard subflow"+(sdone?" done":"")} key={item.id}
                    onMouseEnter={()=>S.hoverSubflow(item)} onMouseLeave={S.leaveSubflow}
                    onClick={()=>{ setSfDetail(item); setView("subflow"); }}>
                    <div className="confcard-h">
                      <span className="sf-cic"><Ic.flow size={13}/></span>
                      <span className="confcard-t">{item.label} <span className="sf-tag">flow</span></span>
                      <span className={"confcard-n"+(sdone?" done":"")}>{sdone ? <><Ic.check size={11}/> resolved</> : `${wfs.length} workflows`}</span>
                      <Ic.chevR size={14} color="#94a3b8" style={{flex:"0 0 14px"}}/>
                    </div>
                    <p className="confcard-r">{item.path} — overlaps at {item.overlaps.length} points. Resolving the flow clears the node conflicts on it too.</p>
                  </div>
                );
              }
              const open = !!openItem[item.id];   // small inline chain (step list)
              return (
                <div className="confcard subflow" key={item.id}
                  onMouseEnter={()=>S.hoverSubflow(item)} onMouseLeave={S.leaveSubflow}>
                  <div className="confcard-h" onClick={()=>toggleItem(item.id)} style={{cursor:"pointer"}}>
                    <span className="sf-cic"><Ic.flow size={13}/></span>
                    <span className="confcard-t">{item.label} <span className="sf-tag">flow</span></span>
                    <span className="confcard-n">{wfs.length} workflow{wfs.length>1?"s":""}</span>
                    <Ic.chevD size={13} color="#94a3b8" style={{flex:"0 0 13px", transform:open?"none":"rotate(-90deg)", transition:".15s"}}/>
                  </div>
                  <p className="confcard-r">A chain of {item.segment.length} steps overlaps other workflows at {item.points.length} points along the way.</p>
                  {open && (
                    <div className="sf-steps">
                      {item.points.map((p,i)=>(
                        <div className="sf-step" key={i}>
                          <span className="sf-stepn">{i+1}</span>
                          <div style={{flex:1,minWidth:0}}>
                            <div className="sf-step-el">{p.nodeLabel}</div>
                            <div className="sf-step-r">{p.reason}</div>
                            <div className="sf-step-wf"><WfChip wfk={p.wf}/> <span className={"wfstat "+EXIST_WFS[p.wf].status}><span className="wfstat-dot"/>{EXIST_WFS[p.wf].status==="active"?"Active":"Published"}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            if (kind==="efix") {   // an error's known fix, with its options inline
              const edone = !!resolved[item.id];
              return (
                <ReviewItem key={"fx"+item.id} kind="fix" item={{...item, title:item.fixTitle}} done={edone} doneLabel={item.fixTitle+" — applied"}
                  open={!!openItem[item.id]} onToggle={()=>toggleItem(item.id)} {...hov}>
                  {!edone ? (
                    <div className="rchips">{item.chips.map(c=>(
                      <button key={c} className="rchip" onClick={()=>setResolved(r=>({...r,[item.id]:c}))}><Ic.check size={12}/> {c}</button>
                    ))}</div>
                  ) : (
                    <div className="ritem-acts"><span className="done-row"><Ic.checkC size={14}/> {resolved[item.id]}</span>
                      <button className="link" onClick={()=>setResolved(r=>{const n={...r}; delete n[item.id]; return n;})}>Change</button></div>
                  )}
                </ReviewItem>
              );
            }
            if (kind==="sffix") {   // FLOW conflict fix — resolving clears the node conflicts it covers
              const sdone = !!S.sfResolved[item.id];
              const wfn = subflowWfs(item).length;
              return (
                <div className={"confcard subflow"+(sdone?" done":"")} key={"sf"+item.id}
                  onMouseEnter={()=>S.hoverSubflow(item)} onMouseLeave={S.leaveSubflow}>
                  <div className="confcard-h">
                    <span className="sf-cic"><Ic.flow size={13}/></span>
                    <span className="confcard-t">{item.label} <span className="sf-tag">flow</span></span>
                    <span className={"confcard-n"+(sdone?" done":"")}>{sdone ? <><Ic.check size={11}/> resolved</> : `${wfn} workflows`}</span>
                  </div>
                  <p className="confcard-r">{item.path || `${item.segment.length}-step chain`}{item.subsumes ? " — fixing the flow clears the node conflicts on it too." : "."}</p>
                  <div className="ritem-show">
                    {sdone
                      ? <span className="done-row"><Ic.checkC size={14}/> Resolved <button className="link" style={{marginLeft:8}} onClick={()=>S.unresolveSubflow(item)}>Change</button></span>
                      : <span style={{flex:1,display:"flex",alignItems:"center",justifyContent:item.detailed?"space-between":"flex-end",gap:10}}>
                          {item.detailed && <button className="link" onClick={()=>{ setSfDetail(item); setView("subflow"); }}>See details</button>}
                          <button className="btn btn-outline btn-sm" onClick={()=>{ S.resolveSubflow(item); S.notify("ok", item.subsumes?"Flow conflict resolved — node conflicts cleared too":"Flow conflict resolved"); }}>Resolve flow</button>
                        </span>}
                  </div>
                </div>
              );
            }
            if (kind==="gfix") {   // NODE-GROUP conflict fix — same node grouping as the Conflicts tab
              const gdone = groupLeft(item)===0;
              const rec = CFIX[item.otype];
              const resolveGroup = ()=>item.items.forEach(ci=>S.resolveConflict(ci.id));
              const unresolveGroup = ()=>item.items.forEach(ci=>S.unresolveConflict(ci.id));
              return (
                <ReviewItem key={"gf"+item.tgt} kind="conf" item={{ title:item.label, node:`${item.items.length} wf`, detail:NODE_REASON[item.otype] }}
                  done={gdone} doneLabel={item.label+" — resolved"}
                  open={!!openItem[item.tgt]} onToggle={()=>toggleItem(item.tgt)}
                  onHover={()=>S.hoverCanvas(item.tgt)} onLeave={S.leaveCanvas}>
                  <div className="overlap">
                    <span className={"ov-ic "+rec.ic}>{React.createElement(Ic[rec.ic], { size:13 })}</span>
                    <span className="ov-t">{rec.word} overlap</span>
                    <span className="ov-el">{item.element}</span>
                  </div>
                  {!gdone ? (<>
                    <p className="ov-how">How to fix — pick one:</p>
                    <div className="rchips">{rec.chips.map(c=>(
                      <button key={c} className="rchip" onClick={resolveGroup}><Ic.check size={12}/> {c}</button>
                    ))}</div>
                  </>) : (
                    <div className="ritem-acts"><span className="done-row"><Ic.checkC size={14}/> Resolved</span>
                      <button className="link" onClick={unresolveGroup}>Change</button></div>
                  )}
                </ReviewItem>
              );
            }
            const fdone = item.group===1 ? S.converted : S.converted2;   // kind === "fix" (conversion)
            return (
              <ReviewItem key={item.id} kind="fix" item={item} done={fdone} doneLabel={item.title+" — applied"}
                open={!!openItem[item.id]} onToggle={()=>toggleItem(item.id)} {...hov}
                showRight={fdone
                  ? <span className="done-row"><Ic.checkC size={14}/> Applied — reversible</span>
                  : <button className="btn btn-outline btn-sm" onClick={()=> item.group===1 ? S.applyFix1() : S.applyFix2()}>Apply fix</button>} />
            );
          })}
        </>)}
      </div>
      <div className="sp-foot">
        <button className="btn btn-ghost btn-sm" onClick={()=>S.select(S.converted?"branch":"group")}>Cancel</button>
        <button className={"btn btn-pri btn-sm"} disabled={!canPublish} style={!canPublish?{opacity:.55,cursor:"not-allowed"}:null} onClick={publish}>
          {published ? <>Published <Ic.check size={13}/></> : phase!=="done" ? "Checking…" : errorsLeft>0 ? `Fix ${errorsLeft} error${errorsLeft>1?"s":""} to publish` : "Publish workflow"}
        </button>
      </div>
    </div>
  );
}

// Action node config — same layout for every action; only title + description change per node
function ActionPopover({ S, act }) {
  const a = act || { text:"Action", desc:"", icon:"flag" };
  return (
    <div className="sp">
      <div className="sp-top">
        <button className="sp-top gobk" style={{flex:1,justifyContent:"flex-start"}} onClick={()=>S.select(S.converted?"branch":"group")}><Ic.chevL size={14}/> Go to {S.converted?"Branch":"IF/Else"} Node</button>
        <button className="sp-act" title="Replace node" onClick={()=>S.openNodeSel(null, true)}><Ic.swap size={15}/></button>
        <button className="sp-act danger"><Ic.trash size={15}/></button>
        <button className="sp-act"><Ic.dots size={15}/></button>
        <button className="sp-act" onClick={()=>S.select(null)}><Ic.close size={15}/></button>
      </div>
      <div className="sp-scroll">
        <div className="sp-title"><span className="gic action">{React.createElement(Ic[a.icon]||Ic.flag,{size:16})}</span><h2>{a.text}</h2></div>
        <div className="sp-blurb">Define a condition to split this workflow into two paths — one for when it's true, one for when it's not. <a>Doc <Ic.ext/></a></div>

        <div className="field"><label className="lbl2">Title <span className="req">*</span></label><input className="inp" key={a.text} defaultValue={a.text} placeholder="Title"/></div>
        <div className="field"><label className="lbl2">Description <span className="req">*</span></label><textarea className="inp" rows="3" key={a.desc} defaultValue={a.desc}/></div>

        <div className="bcard">
          <div className="bcard-h"><span className="bn">Attribute 1</span></div>
          <label className="lbl2">Select Attribute <span className="req">*</span></label>
          <div className="sel" style={{marginBottom:8}}>Select Attribute <Ic.chevD size={15}/></div>
          <div className="valrow"><span className="dd">Direct <Ic.chevD size={12}/></span><div className="valbox" style={{color:"var(--faint)"}}>Select value</div></div>
        </div>

        <button className="btn btn-ghost btn-sm" style={{marginBottom:8}}><Ic.plus size={13}/> Add Field</button>

        <div className="nns">
          <h3>Next Node Selection inside the loop</h3>
          <p className="sub">Pick the next step in your workflow</p>
          <NnsRow S={S} icon={a.icon||"flag"} iconStyle={{background:"var(--blue-50)",color:"var(--blue)"}} label="Next Step" addText="Add next node to run inside this loop" parallel src="trig"/>
        </div>
      </div>
      <div className="sp-foot">
        <button className="btn btn-ghost btn-sm">Reset</button>
        <button className="btn btn-pri btn-sm">Save</button>
      </div>
    </div>
  );
}

// Trigger node config (shown when the Trigger node is clicked)
function TriggerPopover({ S }) {
  return (
    <div className="sp">
      <div className="sp-top">
        <div style={{flex:1}}/>
        <button className="sp-act" title="Replace node" onClick={()=>S.openNodeSel(null, true)}><Ic.swap size={15}/></button>
        <button className="sp-act danger"><Ic.trash size={15}/></button>
        <button className="sp-act"><Ic.dots size={15}/></button>
        <button className="sp-act" onClick={()=>S.select(null)}><Ic.close size={15}/></button>
      </div>
      <div className="sp-scroll">
        <div className="sp-title"><span className="gic trig"><Ic.trigger size={16}/></span><h2>Trigger Selection</h2></div>
        <div className="sp-blurb">Pick the event that fires this workflow — everything else runs after it. <a>Doc <Ic.ext/></a></div>

        <div className="field"><label className="lbl2">Title <span className="req">*</span></label><input className="inp" defaultValue="Trigger" placeholder="Title"/></div>
        <div className="field"><label className="lbl2">Description <span className="req">*</span></label><textarea className="inp" rows="2" defaultValue="1. Subject Is Changed"/></div>

        <div className="bcard">
          <div className="bcard-h"><span className="bn">Trigger 1</span></div>
          <label className="lbl2">Select Attribute <span className="req">*</span></label>
          <div className="sel filled" style={{marginBottom:8}}>Subject <Ic.chevD size={15}/></div>
          <div className="condgrid">
            <div className="trigval"><Ic.chevD size={12} color="#94a3b8"/> <span className="radio"/> Any</div>
            <div className="trigval"><Ic.chevD size={12} color="#94a3b8"/> <span className="radio"/> Any</div>
          </div>
        </div>

        <div className="bcard">
          <div className="bcard-h"><span className="bn">Trigger 2</span></div>
          <label className="lbl2">Select Attribute <span className="req">*</span></label>
          <div className="sel" style={{marginBottom:8}}>Select Attribute <Ic.chevD size={15}/></div>
          <div className="condgrid">
            <div className="trigval"><Ic.chevD size={12} color="#94a3b8"/> From</div>
            <div className="trigval"><Ic.chevD size={12} color="#94a3b8"/> To</div>
          </div>
        </div>

        <button className="btn btn-ghost btn-sm" style={{marginBottom:8}}><Ic.plus size={13}/> Add Trigger</button>
        <p className="hint">You can add multiple triggers to this workflow. If any one of them occurs, the workflow will run.</p>

        <div className="nns">
          <h3>Next Node Selection</h3>
          <p className="sub">Pick the next step in your workflow</p>
          <div className="nns-row">
            <span className="nns-ic" style={{background:"var(--blue-50)",color:"var(--blue)"}}><Ic.trigger size={16}/></span>
            <div className="nns-card">
              <div className="nns-label">Next Step</div>
              {[0,1,2,3,4,5,6].map(i=>(
                <button key={i} className="nns-filled" onClick={()=>{ S.openGroup(1); S.showOnCanvas("if"+i); }}>
                  <span className="nns-fic"><Ic.ifelse size={13}/></span> IF / Else <Ic.chevR size={13} color="#94a3b8" style={{marginLeft:"auto"}}/>
                </button>
              ))}
              <button className="addstep" onClick={()=>S.openNodeSel("trig")}><Ic.addbox size={16} color="#94a3b8"/> Add parallel node</button>
            </div>
          </div>
        </div>
      </div>
      <div className="sp-foot">
        <button className="btn btn-ghost btn-sm">Reset</button>
        <button className="btn btn-pri btn-sm">Save</button>
      </div>
    </div>
  );
}

// 2nd group's optimize card (nested IF/Else off "Get Assets") — shown below the 1st in both drawers
function OptCard2({ S }) {
  if (S.optDismissed2) return null;
  if (!S.converted2) return (
    <div className="optpop">
      <button className="opx" onClick={S.dismissOpt2} title="Dismiss"><Ic.close size={14}/></button>
      <div className="oph"><span className="opic"><Ic.spark size={16}/></span>
        <div><div className="oplbl">Optimize · optional</div><div className="optitle">Convert {NEST_CONDS.length} IF/Else → 1 Branch</div></div></div>
      <div className="opsub">A 2nd group: the {NEST_CONDS.length} asset checks after “Get Assets” can become one Branch — each its own path. Same outcomes.</div>
      <button className="btn btn-outline btn-sm" onClick={S.apply2}>Convert</button>
    </div>
  );
  return (
    <div className="optpop" style={{background:"#f0faf4"}}>
      <div className="oph"><span className="opic"><Ic.checkC size={16} color="var(--green)"/></span>
        <div style={{flex:1,minWidth:0}}><div className="oplbl" style={{color:"var(--green-ink)"}}>Optimized · 2nd group</div><div className="optitle">{NEST_CONDS.length} IF/Else → 1 Branch</div></div></div>
      <button className="btn btn-ghost btn-sm" onClick={S.undo2}><Ic.undo size={13}/> Undo optimization</button>
    </div>
  );
}

function GroupPopover({ S }) {
  const g2 = S.selectedGroup === 2;
  const conds = g2 ? NEST_CONDS : CONDS;
  const count = conds.length;
  const groupName = g2 ? "Asset checks (after “Get Assets”)" : "Major-incident signals";
  return (
    <div className="sp">
      <div className="sp-top">
        <div style={{flex:1}}/>
        <button className="sp-act" title="Replace node" onClick={()=>S.openNodeSel(null, true)}><Ic.swap size={15}/></button>
        <button className="sp-act danger"><Ic.trash size={15}/></button>
        <button className="sp-act"><Ic.dots size={15}/></button>
        <button className="sp-act" onClick={()=>S.select(null)}><Ic.close size={15}/></button>
      </div>
      <div className="sp-scroll">
        <div className="sp-title"><span className="gic ifelse"><Ic.ifelse size={16}/></span>
          <h2>IF / Else</h2>
          <span className="ppill branchp" style={{marginLeft:6}}>{count}-step group</span>
        </div>
        <div className="sp-blurb">One of a stacked chain of <b>{count} IF/Else</b> steps — <b>{groupName}</b>. Configure this step, or convert the whole group into one Branch. <a>Doc <Ic.ext/></a></div>

        {g2 ? <OptCard2 S={S} /> : (!S.optDismissed && (
          <div className="optpop">
            <button className="opx" onClick={S.dismissOpt} title="Dismiss"><Ic.close size={14}/></button>
            <div className="oph"><span className="opic"><Ic.spark size={16}/></span>
              <div><div className="oplbl">Optimize · optional</div><div className="optitle">Convert {NC} IF/Else → 1 Branch</div></div></div>
            <div className="opsub">These {NC} IF/Else become one Branch — each its own path, keeping its next step. Same outcomes, one node, easier to manage.</div>
            <button className="btn btn-outline btn-sm" onClick={S.openPreview}>See preview</button>
          </div>
        ))}

        <div className="field"><label className="lbl2">Title <span className="req">*</span></label><input className="inp" defaultValue={g2?"Check asset condition":"Detect major incident"} placeholder="Title"/></div>
        <div className="field"><label className="lbl2">Select Source Node <span className="req">*</span></label>
          <div className="sel filled">{g2?"Get Assets":"Incident"} <Ic.chevD size={15}/></div>
          <p className="hint">The previous step/node whose data you want to use in this node</p></div>

        <span className="checkif">Check IF</span>
        <div className="matchrow">Match <span className="seg-mini">Any <Ic.refresh size={11}/></span> of these {count} configured conditions</div>
        <CondList conds={conds}/>
        <span className="addc"><Ic.plus size={13}/> Add Condition</span>

        <div className="nns">
          <h3>Next Node Selection</h3>
          <p className="sub">Pick the next step for each path</p>
          <NnsRow S={S} icon="flag" iconStyle={{background:"var(--green-bg)",color:"var(--green)"}} label="Is True" addText="Add the next step when the condition is true" src={g2?"nest0":"if0"}/>
          <NnsRow S={S} icon="arrow" iconStyle={{background:"#eef1f6",color:"#7a879a"}} label="Else" addText="Add the next step when the condition is false" src={g2?"nest0":"if0"}/>
        </div>
      </div>
      <div className="sp-foot">
        <button className="btn btn-ghost btn-sm">Reset</button>
        <button className="btn btn-pri btn-sm">Save</button>
      </div>
    </div>
  );
}

/* ===== side popover — Branch (same conditions, single path) ===== */
function BranchPopover({ S }) {
  const g2 = S.selectedGroup === 2;
  const count = g2 ? NEST_CONDS.length : NC;
  return (
    <div className="sp">
      <div className="sp-top">
        <button className="gobk" style={{flex:1,justifyContent:"flex-start"}}><Ic.chevL size={14}/> Go to IF/Else Node</button>
        <button className="sp-act" title="Replace node" onClick={()=>S.openNodeSel(null, true)}><Ic.swap size={15}/></button>
        <button className="sp-act danger"><Ic.trash size={15}/></button>
        <button className="sp-act"><Ic.dots size={15}/></button>
        <button className="sp-act" onClick={()=>S.select(null)}><Ic.close size={15}/></button>
      </div>
      <div className="sp-scroll">
        <div className="sp-title"><span className="gic branch"><Ic.branch size={16}/></span>
          <h2>Branch</h2>
          <span className="ppill branchp" style={{marginLeft:6}}>{count} paths</span>
        </div>
        <div className="sp-blurb">Send the workflow down different paths depending on what the value is — like sorting tickets into the right team. <a>Doc <Ic.ext/></a></div>

        <div className="optpop" style={{background:"#f0faf4"}}>
          <div className="oph"><span className="opic"><Ic.checkC size={16} color="var(--green)"/></span>
            <div style={{flex:1,minWidth:0}}><div className="oplbl" style={{color:"var(--green-ink)"}}>Optimized</div><div className="optitle">{count} IF/Else → 1 Branch</div></div></div>
          <button className="btn btn-ghost btn-sm" onClick={g2?S.undo2:S.undo}><Ic.undo size={13}/> Undo optimization</button>
        </div>

        <div className="field"><label className="lbl2">Title <span className="req">*</span></label><input className="inp" defaultValue="Detect major incident" placeholder="Title"/></div>
        <div className="field"><label className="lbl2">Description <span className="req">*</span></label><textarea className="inp" rows="2" defaultValue="Flag the incident as major when any major-incident signal is met." placeholder="Description"/></div>
        <div className="field"><label className="lbl2">Select Source Node <span className="req">*</span></label><div className="sel filled">Incident <Ic.chevD size={15}/></div>
          <p className="hint">The previous step/node whose data you want to use in this node</p></div>

        <div className="bcard">
          <div className="bcard-h"><span className="bn on">Branch 1</span>
            <span style={{flex:1,fontSize:12,fontWeight:600,color:"var(--muted)"}}>→ {ACTION}</span>
            <button className="sp-act" style={{width:26,height:26}}><Ic.copy size={13}/></button>
            <button className="sp-act danger" style={{width:26,height:26}}><Ic.trash size={13}/></button>
          </div>
          <div className="field" style={{marginBottom:11}}><label className="lbl2">Name <span className="req">*</span></label><input className="inp" defaultValue="Major incident" placeholder="Name"/></div>
          <div className="field" style={{marginBottom:11}}><label className="lbl2">Select Type <span className="req">*</span></label><div className="sel filled">Condition <Ic.chevD size={15}/></div></div>
          <span className="checkif">Check IF</span>
          <div className="matchrow">Match <span className="seg-mini">Any <Ic.refresh size={11}/></span> of this following condition</div>
          <CondList/>
          <span className="addc"><Ic.plus size={13}/> Add Condition</span>
          <div style={{marginTop:12}}><button className="addgrp"><Ic.plus size={13}/> Add Condition Group</button></div>
        </div>

        <button className="addbranch"><Ic.plus size={14}/> Add Branch</button>

        <div className="bcard def">
          <div className="bcard-h"><span className="bn">Default</span></div>
          <label className="lbl2">Name <span className="req">*</span></label>
          <input className="inp" defaultValue="Default Branch"/>
          <p className="hint">Executed when no branch conditions are met</p>
        </div>

        <div className="nns">
          <h3>Next Node Selection</h3>
          <p className="sub">Pick the next step in your workflow</p>
          <NnsRow S={S} icon="branch" iconStyle={{background:"var(--orange-bg)",color:"var(--orange)"}} label="Branch 1" addText="Add step when condition is met" src="branch"/>
          <NnsRow S={S} icon="branch" iconStyle={{background:"#eef1f6",color:"#7a879a"}} label="Default" addText="Add step when no condition is met" src="branch"/>
        </div>
      </div>
      <div className="sp-foot">
        <button className="btn btn-ghost btn-sm">Reset</button>
        <button className="btn btn-pri btn-sm">Save</button>
      </div>
    </div>
  );
}

/* ===== preview modal (no mapping, single branch single path) ===== */
function MiniBefore() {
  return (<div className="mini-stack">
    {CONDS.map((c, i) => (
      <React.Fragment key={i}>
        <div className="mini-if">
          <div className="t"><Ic.ifelse size={12} color="var(--orange)"/> IF {condText(c)}</div>
          <div className="s"><Ic.arrow size={10} color="var(--green)"/> Is True → {NEXTS[i] ? NEXTS[i].label : "—"}</div>
        </div>
        {i < NC-1 && <div className="mini-conn"/>}
      </React.Fragment>
    ))}
  </div>);
}
function MiniAfter() {
  return (<div className="mini-branch">
    <div className="mini-bh"><Ic.branch size={14} color="var(--orange)"/> Branch · {NC} paths + Default</div>
    {CONDS.map((c, j) => (
      <div className="mini-path" key={j} style={{padding:"6px 8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <span className="ppill branchp">Branch {j+1}</span>
          <span style={{fontSize:11,fontWeight:700,color:"var(--ink)"}}>If {condText(c)}</span>
          {NEXTS[j] && <span style={{fontSize:10.5,color:"var(--muted)",fontWeight:700}}>→ {NEXTS[j].label}</span>}
        </div>
      </div>
    ))}
    <div className="mini-path def"><span className="ppill">Default</span> <span style={{fontSize:10.5,color:"var(--muted)",fontWeight:700,marginLeft:6}}>No match → continue</span></div>
  </div>);
}
function PreviewModal({ S, onClose }) {
  return (<>
    <div className="scrim fade-in" onClick={onClose}/>
    <div className="modal-wrap pop-in">
      <div className="modal">
        <div className="modal-head">
          <span className="pi"><Ic.branch size={17}/></span>
          <div style={{flex:1}}>
            <h2 style={{fontSize:16,fontWeight:800,color:"#1c2533",margin:0}}>Convert {NC} IF/Else → 1 Branch</h2>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:1}}>Each IF/Else becomes its own branch path (1:1), keeping the same next step. Same outcomes, one node.</div>
          </div>
          <button className="sp-act" onClick={onClose}><Ic.close size={17}/></button>
        </div>
        <div className="modal-body">
          <div className="pvcols">
            <div className="pvcol">
              <div className="pvhd"><span className="pn before">{NC}</span> Before — stacked IF / Else</div>
              <div className="pvbox"><MiniBefore/></div>
            </div>
            <div className="pvarrow"><span className="circle"><Ic.arrow size={17}/></span></div>
            <div className="pvcol">
              <div className="pvhd"><span className="pn after">1</span> After — Branch <span style={{color:"var(--faint)",fontWeight:700}}>· {NC} paths + Default</span></div>
              <div className="pvbox"><MiniAfter/></div>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <span style={{fontSize:12,color:"var(--muted)",display:"flex",alignItems:"center",gap:7}}><Ic.info size={14} color="#7c8aa0"/> Non-destructive — you can undo this anytime.</span>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-pri" onClick={()=>{ S.apply(); onClose(); }}><Ic.branch size={14}/> Convert to Branch</button>
          </div>
        </div>
      </div>
    </div>
  </>);
}

/* ===== workflow builder ===== */
function Workflow() {
  const [converted, setConverted] = useState(false);
  const [converted2, setConverted2] = useState(false);   // 2nd group (nested off Get Assets)
  const [selected, setSelected] = useState("group");  // side drawer open by default
  const [selectedAct, setSelectedAct] = useState(null);  // data of the clicked action node
  const [selectedGroup, setSelectedGroup] = useState(1); // which IF/Else group's drawer is open (1=main, 2=nested)
  const [preview, setPreview] = useState(false);
  const [optDismissed, setOptDismissed] = useState(false);
  const [optDismissed2, setOptDismissed2] = useState(false);
  const [toast, setToast] = useState(null);
  const [pos, setPos] = useState({});                 // per-node position overrides (dragging)
  const [flash, setFlash] = useState(null);           // node id briefly highlighted by "Show on canvas"
  const [resolved, setResolved] = useState({});       // error id → chosen fix (lifted so the canvas reacts live)
  const [acked, setAcked] = useState({});             // warning id → acknowledged
  const [reviewed, setReviewed] = useState(false);    // true once the publish draft pass has run → canvas badges on
  const [confResolved, setConfResolved] = useState({}); // conflict id → resolved ("allow both")
  const [confPanel, setConfPanel] = useState(false);   // anchored same-trigger panel at the trigger
  const [confPreview, setConfPreview] = useState(false); // read-only preview of the other workflow
  const [publishView, setPublishView] = useState("review"); // review | fixes | conflict (lifted for deep-links)
  const [pubFilter, setPubFilter] = useState("all");        // active tab in the review (lifted so canvas can deep-link to Fixes)
  const [zoom, setZoom] = useState(1);                      // canvas zoom (0.25–2); minimize/maximize the workflow
  const [tool, setTool] = useState("select");              // "select" (move nodes) | "pan" (hand — drag to pan)
  const [sfHover, setSfHover] = useState(null);            // a sub-flow whose trail is lit on canvas (hover only)
  const [sfResolved, setSfResolved] = useState({});        // sub-flow id → resolved
  const [confNode, setConfNode] = useState(null);          // node group whose detail sub-screen is open (lifted for canvas deep-link)
  const [sfDetail, setSfDetail] = useState(null);          // sub-flow whose detail sub-screen is open
  const [merges, setMerges] = useState([]);                // user-added merge nodes: [{ id, inputs:[nodeId] }]
  const mergeSeq = useRef(0);                               // monotonic id source (stable across deletes)
  const [notes, setNotes] = useState([]);                  // sticky notes on canvas: [{ id, x, y, text }]
  const [mod, setModState] = useState({ name:"", kind:"event", module:"", scheduleType:"Recurring", frequency:"Daily" });
  const [addCtx, setAddCtx] = useState(null);              // { source } — node whose "+" opened the Node Selection panel
  const [selMerge, setSelMerge] = useState(null);          // merge id whose config panel is open
  const [hoverMerge, setHoverMerge] = useState(null);      // merge id awaiting the connect-existing choice
  const [choiceTop, setChoiceTop] = useState(160);         // y of the connect-choice popup (aligned to the Merge row)
  const posRef = useRef(pos); posRef.current = pos;         // latest positions, for the undo/redo snapshot
  const histRef = useRef({ stack:[{}], i:0 });             // node-position history
  const [, bumpHist] = useReducer(x=>x+1, 0);

  useEffect(()=>{ window.__scale = zoom; }, [zoom]);        // keep node-drag math in sync with the zoom
  useEffect(()=>{ if(!toast) return; const t=setTimeout(()=>setToast(null), 4600); return ()=>clearTimeout(t); }, [toast]);
  // a "View workflow" link opens this app in a new tab with ?conflicts=1 → boot straight into the conflict review
  useEffect(()=>{ if(new URLSearchParams(location.search).get("conflicts")==="1"){ setReviewed(true); setPublishView("review"); setPubFilter("conf"); setSelected("publish"); } }, []);

  const ZMIN=0.25, ZMAX=2;
  const clampZ = (z)=>Math.min(ZMAX, Math.max(ZMIN, Math.round(z*100)/100));
  const zoomIn  = ()=>setZoom(z=>clampZ(z+0.1));
  const zoomOut = ()=>setZoom(z=>clampZ(z-0.1));
  const zoomFit = ()=>{ const el=document.querySelector(".canvas"); if(!el) return;
    const z = clampZ(Math.min((el.clientWidth-40)/view.contentW, (el.clientHeight-40)/view.contentH));
    setZoom(z); requestAnimationFrame(()=>el.scrollTo({left:0,top:0,behavior:"smooth"})); };
  const zoomReset = ()=>setZoom(1);
  // node-position undo / redo
  const pushHist = (snap)=>{ const h=histRef.current; h.stack=h.stack.slice(0,h.i+1); h.stack.push({...snap}); h.i=h.stack.length-1; bumpHist(); };
  const undoMove = ()=>{ const h=histRef.current; if(h.i<=0) return; h.i--; setPos(h.stack[h.i]); bumpHist(); };
  const redoMove = ()=>{ const h=histRef.current; if(h.i>=h.stack.length-1) return; h.i++; setPos(h.stack[h.i]); bumpHist(); };
  const canUndo = histRef.current.i>0;
  const canRedo = histRef.current.i < histRef.current.stack.length-1;

  // drag a node freely; a clean click (no movement) opens its config panel
  const startDrag = (e, n) => {
    if (e.button !== 0) return;
    if (tool === "pan") return;          // hand tool: let the canvas pan instead of moving the node
    e.preventDefault();
    const sx=e.clientX, sy=e.clientY, bx=n.x, by=n.y;
    let moved=false;
    document.body.style.userSelect="none";
    const onMove=(ev)=>{
      const k=window.__scale||1;
      const dx=(ev.clientX-sx)/k, dy=(ev.clientY-sy)/k;
      if(!moved && Math.abs(dx)+Math.abs(dy)>3) moved=true;
      if(moved) setPos(p=>({...p, [n.id]:{ x:Math.max(8,bx+dx), y:Math.max(8,by+dy) }}));
    };
    const onUp=()=>{
      window.removeEventListener("mousemove",onMove); window.removeEventListener("mouseup",onUp);
      document.body.style.userSelect="";
      if(moved) setTimeout(()=>pushHist(posRef.current), 0);   // record the move for undo/redo
      if(!moved){
        if(n.type==="trigger") setSelected("trigger");
        else if(n.type==="action"){ setSelectedAct(n.data); setSelected("action"); }
        else if(n.type==="ifelse"){ setSelectedGroup(n.data.nested?2:1); setSelected("group"); }
        else if(n.type==="branch"){ setSelectedGroup(n.id==="nbranch"?2:1); setSelected("branch"); }
        else if(n.type==="merge"){ setSelMerge(n.id); setSelected("merge"); }
      }
    };
    window.addEventListener("mousemove",onMove); window.addEventListener("mouseup",onUp);
  };

  const openGroup = (g=1) => { setSelectedGroup(g); setSelected("group"); };
  const openPreview = () => setPreview(true);
  const apply = () => { setConverted(true); setSelected("branch");
    setToast({ kind:"ok", msg:`Converted ${NC} IF/Else → 1 Branch · ${NC} paths · non-destructive`, undo:true }); };
  const undo = () => { setConverted(false); setSelected("group"); setOptDismissed(false);
    setToast({ kind:"info", msg:"Reverted — your IF/Else steps are back, unchanged" }); };
  const dismissOpt = () => setOptDismissed(true);
  const showOpt = () => { setOptDismissed(false); setSelected("group"); };
  const apply2 = () => { setConverted2(true);
    setToast({ kind:"ok", msg:`Converted ${NEST_CONDS.length} IF/Else → 1 Branch · non-destructive`, undo:true }); };
  const undo2 = () => { setConverted2(false);
    setToast({ kind:"info", msg:"Reverted — the asset checks are back as IF/Else" }); };
  const dismissOpt2 = () => setOptDismissed2(true);
  const notify = (kind,msg) => setToast({ kind, msg });
  // apply conversions from the publish review without switching the drawer away from it
  const applyFix1 = () => { setConverted(true); setToast({ kind:"ok", msg:`Converted ${NC} IF/Else → 1 Branch · non-destructive`, undo:true }); };
  const applyFix2 = () => { setConverted2(true); setToast({ kind:"ok", msg:`Converted ${NEST_CONDS.length} IF/Else → 1 Branch · non-destructive` }); };

  const view = converted ? buildAfter(pos, converted2, merges) : buildBefore(pos, converted2, merges);

  // ----- add-node / merge handlers -----
  const openNodeSel = (sourceId, replace) => { setAddCtx({ source:sourceId, replace:!!replace }); setSelected("nodesel"); };
  const existingMerge = merges[0];   // (single-group demo) the merge a new input could join
  const addMergeNew = (sourceId) => {
    const id = "m"+(mergeSeq.current++);
    setMerges(ms=>[...ms, { id, inputs:[sourceId] }]);
    setSelMerge(id); setSelected("merge"); setAddCtx(null); setHoverMerge(null);
  };
  const connectToMerge = (mergeId, sourceId) => {
    // connecting a node re-shows the empty slot so the user can keep adding inputs
    setMerges(ms=>ms.map(m=>m.id===mergeId && !m.inputs.includes(sourceId) ? { ...m, inputs:[...m.inputs, sourceId], noEmpty:false } : m));
    setSelMerge(mergeId); setSelected("merge"); setAddCtx(null); setHoverMerge(null);
  };
  const removeMergeInput = (mergeId, sourceId) => setMerges(ms=>ms.map(m=>m.id===mergeId ? { ...m, inputs:m.inputs.filter(i=>i!==sourceId) } : m).filter(m=>m.inputs.length));
  const removeMergeEmpty = (mergeId) => setMerges(ms=>ms.map(m=>m.id===mergeId ? { ...m, noEmpty:true } : m));   // remove the auto-added empty input slot
  // node-config actions (functional for the user-added merge node)
  const deleteMerge = (mergeId) => { setMerges(ms=>ms.filter(m=>m.id!==mergeId)); setSelected(null); setToast({ kind:"info", msg:"Merge node deleted" }); };
  const duplicateMerge = (mergeId) => {
    const m = merges.find(x=>x.id===mergeId); if(!m) return;
    const nid = "m"+(mergeSeq.current++);   // unique id
    const base = view.nodes.find(x=>x.id===mergeId);
    setMerges(ms=>[...ms, { id:nid, inputs:[...m.inputs], disabled:m.disabled }]);
    if (base) setPos(p=>({ ...p, [nid]:{ x:base.x+40, y:base.y+40 } }));
    setSelMerge(nid); setToast({ kind:"ok", msg:"Merge node duplicated" });
  };
  const toggleMergeDisabled = (mergeId) => setMerges(ms=>ms.map(m=>m.id===mergeId ? { ...m, disabled:!m.disabled } : m));
  // canvas toolbar actions
  const setMod = (patch) => setModState(s=>({ ...s, ...patch }));
  const addNote = () => {
    const el = document.querySelector(".canvas");
    const x = (el ? el.scrollLeft + 120 : 120), y = (el ? el.scrollTop + 120 : 120);
    const id = "note"+notes.length+"_"+mergeSeq.current++;
    setNotes(ns=>[...ns, { id, x, y, text:"" }]); setToast({ kind:"info", msg:"Note added — double-click to edit" });
  };
  const setNoteText = (id, text) => setNotes(ns=>ns.map(nt=>nt.id===id ? { ...nt, text } : nt));
  const moveNote = (id, x, y) => setNotes(ns=>ns.map(nt=>nt.id===id ? { ...nt, x, y } : nt));
  const deleteNote = (id) => setNotes(ns=>ns.filter(nt=>nt.id!==id));
  const runCmd = (key) => {
    setSelected(null);
    if (key==="addnode") openNodeSel("trig");
    else if (key==="opennode") setSelected(converted?"branch":"group");
    else if (key==="note") addNote();
    else if (key==="publish") { setPublishView("review"); setSelected("publish"); }
    else notify("info", `“${CMDS.find(c=>c.key===key)?.label}” — coming soon.`);
  };
  const pickNode = (key, e) => {   // a row in the Node Selection panel was clicked
    if (addCtx?.replace) {   // replacing the current node, not adding a next one
      const label = NODE_SECTIONS.flatMap(s=>s.items).find(i=>i.key===key)?.name || key;
      notify("ok", `Node replaced with “${label}”.`); setSelected(null); setAddCtx(null); return;
    }
    if (key==="merge") {
      if (merges.length > 0) {   // existing merges → let the user choose WHICH one (pinned left of this row)
        if (e) setChoiceTop(e.currentTarget.getBoundingClientRect().top);
        setHoverMerge(true);
      } else addMergeNew(addCtx.source);
    } else { setSelected(null); notify("info", `“${key}” node — config coming next.`); setAddCtx(null); }   // other node types: stubbed for now
  };

  // scroll the canvas to a review item's node and pulse it (visual treatment TBD — placeholder ring for now)
  const showOnCanvas = (tgt) => {
    let id = tgt;
    if (converted && /^if\d/.test(id)) id = "branch";       // group 1 became the Branch node
    if (converted2 && /^nest\d/.test(id)) id = "nbranch";   // nested group became its Branch
    const n = view.nodes.find(x=>x.id===id);
    const el = document.querySelector(".canvas");
    if (!n || !el) return;
    const visibleW = el.clientWidth - 432;                  // drawer overlays the right side
    el.scrollTo({ left:Math.max(0, (n.x + n.w/2)*zoom - visibleW/2), top:Math.max(0, (n.y + n.h/2)*zoom - el.clientHeight/2), behavior:"smooth" });
    setFlash(id); setTimeout(()=>setFlash(f=>f===id?null:f), 2200);
  };
  // hover variant: scroll to the node and keep it highlighted while the cursor stays on the card
  const hoverCanvas = (tgt) => {
    let id = tgt;
    if (converted && /^if\d/.test(id)) id = "branch";
    if (converted2 && /^nest\d/.test(id)) id = "nbranch";
    const n = view.nodes.find(x=>x.id===id);
    const el = document.querySelector(".canvas");
    if (!n || !el) return;
    const visibleW = el.clientWidth - 432;
    el.scrollTo({ left:Math.max(0, (n.x + n.w/2)*zoom - visibleW/2), top:Math.max(0, (n.y + n.h/2)*zoom - el.clientHeight/2), behavior:"smooth" });
    setFlash(id);
  };
  const leaveCanvas = () => setFlash(null);

  // canvas scenario badges: nodeId → [{kind, tip}] — live, from unresolved review findings (after the draft pass)
  const annOf = (tgt) => {
    let id = tgt;
    if (converted && /^if\d/.test(id)) id = "branch";
    if (converted2 && /^nest\d/.test(id)) id = "nbranch";
    return id;
  };
  const ann = {}, annTop = {};
  if (reviewed) {
    const push = (tgt, entry) => { const id = annOf(tgt); (ann[id] = ann[id] || []).push(entry); };
    REVIEW.errors.forEach(e => { if (!resolved[e.id]) push(e.tgt, { kind:"err", tip:e.tip }); });
    REVIEW.warnings.forEach(w => { if (!acked[w.id]) push(w.tgt, { kind:"warn", tip:w.tip }); });
    REVIEW.conflicts.forEach(c => { if (!confResolved[c.id]) push(c.tgt, { kind:"conf", tip:confTip(c), conf:c }); });
    const rank = { err:3, conf:2, warn:1 };
    Object.entries(ann).forEach(([id, list]) => { annTop[id] = list.slice().sort((a,b)=>rank[b.kind]-rank[a.kind])[0].kind; });
  }

  // resolve the hovered sub-flow's segment to CURRENT node ids (remap if a group was converted), deduped
  const sfSeg = sfHover ? [...new Set(sfHover.segment.map(annOf))] : null;

  const S = { converted, converted2, selected, select:setSelected, selectedGroup, openGroup, openPreview, apply, undo, apply2, undo2,
    optDismissed, dismissOpt, optDismissed2, dismissOpt2, startDrag, notify, applyFix1, applyFix2, showOnCanvas, flash,
    resolved, setResolved, acked, setAcked, markReviewed:()=>setReviewed(true), ann, annTop,
    confResolved, resolveConflict:(id)=>setConfResolved(r=>({...r,[id]:true})), unresolveConflict:(id)=>setConfResolved(r=>{const n={...r}; delete n[id]; return n;}),
    publishView, setPublishView, pubFilter, setPubFilter, openConfPanel:()=>setConfPanel(true), hoverCanvas, leaveCanvas,
    gotoFixes:(tgt)=>{ setPublishView("review"); setPubFilter("fix"); setSelected("publish"); if(tgt) showOnCanvas(tgt); },
    openExistingWorkflow:(w)=>{ window.open(`${location.pathname}?conflicts=1&wf=${w.code}`, "_blank"); notify("info", `Opening ${w.code} · ${w.name} in a new tab — same conflict highlighted.`); },
    zoom, tool, sfHover, sfSeg,
    hoverSubflow:(s)=>{ setSfHover(s); const n=view.nodes.find(x=>x.id===annOf(s.segment[0])); if(n){ const el=document.querySelector(".canvas"); if(el) el.scrollTo({ left:Math.max(0,(n.x+n.w/2)*zoom-(el.clientWidth-432)/2), top:Math.max(0,(n.y)*zoom-el.clientHeight/2), behavior:"smooth" }); } },
    leaveSubflow:()=>setSfHover(null),
    sfResolved, resolveSubflow:(s)=>{ setSfResolved(r=>({...r,[s.id]:true})); if(s.subsumes) setConfResolved(r=>{ const n={...r}; s.subsumes.forEach(id=>n[id]=true); return n; }); },
    unresolveSubflow:(s)=>{ setSfResolved(r=>{const n={...r}; delete n[s.id]; return n;}); if(s.subsumes) setConfResolved(r=>{ const n={...r}; s.subsumes.forEach(id=>delete n[id]); return n; }); },
    confNode, setConfNode, sfDetail, setSfDetail,
    merges, addCtx, selMerge, hoverMerge, choiceTop, existingMerge, openNodeSel, pickNode, addMergeNew, connectToMerge, removeMergeInput,
    setHoverMerge, setSelMerge, deleteMerge, duplicateMerge, toggleMergeDisabled, removeMergeEmpty,
    mod, setMod, addNote, runCmd, notes, setNoteText, deleteNote, moveNote,
    // open the right detail screen for a conflicted node: the flow detail if it's on a flow, else the node detail
    showConflictDetail:(nodeId)=>{
      const flow = SUBFLOWS.find(s=>s.detailed && s.segment.map(annOf).includes(nodeId));
      if (flow) { setSfDetail(flow); setPublishView("subflow"); }
      else { const g = CONF_GROUPS.find(gr=>annOf(gr.tgt)===nodeId); if(!g) return; setConfNode(g); setPublishView("confnode"); }
      setPubFilter("conf"); setSelected("publish");
    } };

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0}}>
      <NavBar/>
      <div className="body">
        <Rail/>
        <div className="work-main">
          <div className="head">
            <button className="back"><Ic.chevL size={18}/></button>
            <h1>Create Workflow</h1>
            <span style={{fontSize:12.5,color:"var(--faint)",fontWeight:700}}>· Workflow 16</span>
            <div className="grow"/>
            {converted
              ? <button className="chip chip-green" onClick={undo} title="Undo the conversion"><Ic.undo size={14}/> Optimized · Undo</button>
              : (optDismissed
                  ? <button className="chip chip-blue" onClick={showOpt}><Ic.spark size={14}/> Optimize available</button>
                  : null)}
            <button className="btn btn-ghost">Save As Draft</button>
            <button className="btn btn-pri" onClick={()=>{ setPublishView("review"); setSelected("publish"); }}><Ic.share size={14}/> Publish</button>
          </div>
          <div className="work">
            <GraphCanvas S={S} view={view}>
              {view.lassos.filter(l => l.group==="g1" ? !optDismissed : !optDismissed2).map((l,i)=>(
                <div key={i} className="lasso" style={{ left:l.x, top:l.y, width:l.w, height:l.h }}>
                  <span className="lasso-badge" onClick={()=>openGroup(l.group==="g2"?2:1)}><Ic.ifelse size={11}/> {l.badge}</span>
                </div>
              ))}
              {confPanel && (()=>{ const t=view.nodes.find(n=>n.id==="trig"); return t ? (
                <ConflictPanel x={t.x+t.w+48} y={t.y-6} S={S} onClose={()=>setConfPanel(false)} onPreview={()=>setConfPreview(true)} />
              ) : null; })()}
              {notes.map(nt=>(<Note key={nt.id} note={nt} S={S} />))}
            </GraphCanvas>

            {selected && (selected==="nodesel" ? <NodeSelectionPanel S={S}/> : selected==="merge" ? <MergePopover S={S}/> : selected==="module" ? <ModulePopover S={S}/> : selected==="cmdbar" ? <CommandBar S={S}/> : selected==="publish" ? (PUB_V2 ? <PublishPopoverV2 S={S}/> : <PublishPopover S={S}/>) : selected==="branch" ? <BranchPopover S={S}/> : selected==="trigger" ? <TriggerPopover S={S}/> : selected==="action" ? <ActionPopover S={S} act={selectedAct}/> : <GroupPopover S={S}/>)}

            {/* bottom-left canvas controls — two containers */}
            <div className="cvdock-wrap">
              {/* actions */}
              <div className="cvdock-bar standalone">
                <button className="cvd-btn" onClick={()=>openNodeSel("trig")}><Ic.plus size={17}/><span className="cvd-tip">Add Node</span></button>
                <button className="cvd-btn" onClick={()=>setSelected("cmdbar")}><Ic.search size={17}/><span className="cvd-tip">Search</span></button>
                <button className="cvd-btn" onClick={addNote}><Ic.doc size={17}/><span className="cvd-tip">Add sticky note</span></button>
                <span className="cvd-sep"/>
                <button className="cvd-btn" onClick={undoMove} disabled={!canUndo}><Ic.undo2 size={16}/><span className="cvd-tip">Undo</span></button>
                <button className="cvd-btn" onClick={redoMove} disabled={!canRedo}><Ic.redo2 size={16}/><span className="cvd-tip">Redo</span></button>
              </div>
              {/* minimap + zoom */}
              <div className="cvdock">
                <Minimap view={view} zoom={zoom}/>
                <div className="cvdock-bar">
                  <button className="cvd-btn" onClick={zoomOut} disabled={zoom<=ZMIN}><Ic.zoomout size={17}/><span className="cvd-tip">Zoom out</span></button>
                  <button className="cvd-pct" onClick={zoomReset} title="Reset to 100%">{Math.round(zoom*100)}%</button>
                  <button className="cvd-btn" onClick={zoomIn} disabled={zoom>=ZMAX}><Ic.zoomin size={17}/><span className="cvd-tip">Zoom in</span></button>
                  <button className="cvd-btn" onClick={zoomFit}><Ic.fit size={16}/><span className="cvd-tip">Fit</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* choose WHICH merge to connect to — pinned to the left of the drawer, aligned with the Merge row */}
      {hoverMerge && addCtx && (<>
        <div className="prevscrim" style={{zIndex:39}} onClick={()=>setHoverMerge(null)}/>
        <div className="merge-choice" style={{ top:Math.max(64, choiceTop) }} onMouseDown={e=>e.stopPropagation()}>
          <div className="mc-h">Connect this node to…</div>
          {merges.map((m,i)=>{
            const has = m.inputs.includes(addCtx.source);
            return (
              <button key={m.id} className="mc-opt" disabled={has} title={has?"Already connected to this merge":""} onClick={()=>!has && connectToMerge(m.id, addCtx.source)}>
                <Ic.merge size={13}/> <span style={{flex:1,textAlign:"left"}}>Merge {i+1}</span>
                <span className="mc-meta">{has ? "connected" : `${m.inputs.length} input${m.inputs.length>1?"s":""}`}</span>
              </button>
            );
          })}
          <div className="dm-sep"/>
          <button className="mc-opt" onClick={()=>addMergeNew(addCtx.source)}><Ic.plus size={13}/> Add new merge node</button>
        </div>
      </>)}

      {preview && <PreviewModal S={S} onClose={()=>setPreview(false)} />}
      {confPreview && <ConflictPreview S={S} onClose={()=>setConfPreview(false)} />}
      {toast && (
        <div className="toast">
          <span className={"ck"+(toast.kind==="info"?" info":"")}>{toast.kind==="info"?<Ic.undo size={12} color="#fff"/>:<Ic.check size={12} color="#fff"/>}</span>
          {toast.msg}
          {toast.undo && <button className="undo" onClick={undo}><Ic.undo size={13}/> Undo</button>}
        </div>
      )}
    </div>
  );
}

/* ===== root: the app fills the whole window, no presentation frame ===== */
export default function App() {
  return (
    <div id="app"><Workflow /></div>
  );
}
