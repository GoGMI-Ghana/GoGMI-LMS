import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { LoadingSpinner } from "../../components/common";

export default function EvaluationPage() {
  const navigate = useNavigate();
  const [v, setV] = useState<Record<string,string>>({});
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checking, setChecking] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get<{submitted:boolean}>("/courses/evaluation/status/crs_maritime_governance")
      .then(r => { if (r.submitted) setSubmitted(true); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <LoadingSpinner />;

  if (submitted) return (
    <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      <h2 className="text-[18px] font-semibold text-gray-800 mt-4 mb-2">Evaluation Submitted</h2>
      <p className="text-[14px] text-gray-500 mb-4">Thank you for your feedback!</p>
      <button onClick={() => navigate("/certificates")} className="bg-[#1a2332] text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer">View Certificates</button>
    </div>
  );

  const submit = async () => {
    setErr(""); setSaving(true);
    try {
      await api.post("/courses/evaluation/submit", { courseId: "crs_maritime_governance", responses: v });
      setSubmitted(true); window.scrollTo({top:0,behavior:"smooth"});
    } catch(e) { setErr(e instanceof Error ? e.message : "Failed"); }
    setSaving(false);
  };

  const rate = (label: string, k: string) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
      <span className="text-[13px] text-gray-700 flex-1 pr-4">{label}</span>
      <div className="flex gap-2">{[1,2,3,4,5].map(n=>(
        <button key={n} type="button" onClick={()=>setV(p=>({...p,[k]:String(n)}))} className={"w-8 h-8 rounded-full text-[12px] font-semibold cursor-pointer "+(v[k]===String(n)?"bg-teal-500 text-white":"bg-gray-100 text-gray-500 hover:bg-gray-200")}>{n}</button>
      ))}</div>
    </div>
  );

  const radio = (opts: string[], k: string) => (
    <div className="flex flex-col gap-1.5 mt-2">{opts.map(o=>(
      <label key={o} className="flex items-center gap-2 cursor-pointer">
        <input type="radio" name={k} checked={v[k]===o} onChange={()=>setV(p=>({...p,[k]:o}))} className="accent-teal-500" />
        <span className="text-[13px] text-gray-700">{o}</span>
      </label>
    ))}</div>
  );

  const txt = (label: string, k: string) => (
    <div className="mt-3"><label className="block text-[13px] font-medium text-gray-700 mb-1">{label}</label>
    <textarea rows={3} value={v[k]||""} onChange={e=>setV(p=>({...p,[k]:e.target.value}))} className="w-full border border-gray-200 rounded-md px-3 py-2 text-[14px] outline-none resize-none" /></div>
  );

  const sec = (title: string, ch: React.ReactNode) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      <h2 className="text-[16px] font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">{title}</h2>{ch}
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Course Evaluation Form</h1>
        <p className="text-[14px] text-gray-500">Maritime Governance for Practitioners — African Maritime Practitioners Programme</p>
        <p className="text-[13px] text-gray-400 mt-1">Your feedback is confidential and will inform improvements to future editions.</p>
      </div>

      {err && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{err}</p></div>}

      {sec("Section A — Participant Information", <>
        <div className="mb-3"><label className="block text-[13px] font-medium text-gray-700 mb-1">A1. Country and organisation</label>
        <input value={v.a1||""} onChange={e=>setV(p=>({...p,a1:e.target.value}))} className="w-full border border-gray-200 rounded-md px-3 py-2 text-[14px] outline-none" /></div>
        <div><label className="block text-[13px] font-medium text-gray-700 mb-1">A2. Professional background</label>
        {radio(["Military / Naval","Government / Civil Service","Academia / Research","Private Sector","NGO / Civil Society","Other"],"a2")}</div>
      </>)}

      {sec("Section B — Overall Programme Assessment", <>
        <p className="text-[12px] text-gray-400 mb-3">Scale: 1 = Poor, 5 = Excellent</p>
        {rate("B1. Overall programme rating","b1")}
        {rate("B2. Content relevance to your role","b2")}
        {rate("B3. Programme structure and flow","b3")}
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">B4. Would you recommend this programme?</label>
        {radio(["Definitely yes","Probably yes","Not sure","Probably not","Definitely not"],"b4")}</div>
      </>)}

      {sec("Section C — Module-by-Module Rating", <>
        <p className="text-[12px] text-gray-400 mb-3">Rate each module: 1 = Poor, 5 = Excellent</p>
        {rate("Module 1 — Foundations of Maritime Governance","mod1")}
        {rate("Module 2 — SWOT Analysis of the Maritime Domain","mod2")}
        {rate("Module 3 — Introduction to Maritime Strategy Development","mod3")}
        {rate("Module 4 — Stakeholder Identification & Inter-Agency Coordination","mod4")}
        {rate("Module 5 — Developing a Strategy for Effective Maritime Governance","mod5")}
        {rate("Module 6 — Maritime Strategy Implementation","mod6")}
        {rate("Module 7 — Case Study: Applying the Full Strategy Development Cycle","mod7")}
        {rate("Module 8 — Capstone Group Presentation","mod8")}
      </>)}

      {sec("Section D — Facilitator Assessment", <>
        <p className="text-[12px] text-gray-400 mb-3">Rate Knowledge, Clarity of Delivery, and Engagement (1–5)</p>
        {[
          ["Dr. Alberta Ama Sagoe — Module 1","f1"],
          ["Cdr. Kofi Amponsah Duodu — Module 1","f2"],
          ["Dr. Ian Ralby — Module 2 (SWOT Analysis)","f3"],
          ["AVM Frank Hanson (Rtd) — Module 3 & Capstone","f4"],
          ["Phillip Heyl — Module 3 (Maritime Strategy)","f5"],
          ["Naval Capt. Ebenezer Yirenkyi — Modules 4 & 5","f6"],
          ["Dr. Osei Bonsu Dickson — Module 4 (Legal Dimensions)","f7"],
          ["Colonel William Ohemeng — Module 5 (Developing a Strategy)","f8"],
          ["Stephanie Schandorf — Module 6 (Implementation)","f9"],
          ["Commodore James Kontoh (Rtd) — Module 7 (Case Study)","f10"],
        ].map(([n,k])=>(
          <div key={k} className="mb-4 pb-3 border-b border-gray-100 last:border-0">
            <div className="text-[13px] font-semibold text-gray-800 mb-2">{n}</div>
            {rate("Knowledge & Expertise",k+"_k")}
            {rate("Clarity of Delivery",k+"_c")}
            {rate("Engagement & Interaction",k+"_e")}
          </div>
        ))}
      </>)}

      {sec("Section E — Case Study (Mahara)", <>
        <p className="text-[12px] text-gray-400 mb-3">Scale: 1 = Not effective/realistic, 5 = Very effective/realistic</p>
        {rate("E1. How effective was the Mahara Case Study?","e1")}
        {rate("E2. How realistic was the Mahara scenario?","e2")}
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">E3. Did the case study evolve meaningfully across modules?</label>
        {radio(["Yes, very effectively","Somewhat — could have been better connected across modules","Not very well — felt disconnected at times"],"e3")}</div>
        {txt("E4. What could be improved about the case study?","e4")}
      </>)}

      {sec("Section F — Virtual Delivery & Coordination", <>
        <p className="text-[12px] text-gray-400 mb-3">Scale: 1 = Poor, 5 = Excellent</p>
        {rate("Quality of Zoom sessions","f_zoom")}
        {rate("LMS platform (materials, assignments, recordings)","f_lms")}
        {rate("Course coordination and communication","f_coord")}
        {rate("Collaborative tools (Miro, Zoom breakout rooms)","f_collab")}
        {rate("Timeliness of schedule and session communications","f_time")}
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">F2. Were session times communicated clearly?</label>
        {radio(["Always","Most of the time","Sometimes","Rarely"],"f2")}</div>
        {txt("F3. Any issues with virtual delivery or coordination?","f3")}
      </>)}

      {sec("Section G — Assignments & Assessment", <>
        <p className="text-[12px] text-gray-400 mb-3">Scale: 1 = Poor, 5 = Excellent</p>
        {rate("Clarity of assignment briefs and instructions","g_clarity")}
        {rate("Relevance of assignments to course content","g_rel")}
        {rate("Usefulness of feedback provided on assignments","g_feed")}
        {rate("Quality of the COA Brief template and guidance","g_coa")}
        {rate("Overall assessment fairness","g_fair")}
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">G2. Was the workload manageable?</label>
        {radio(["Very manageable","Mostly manageable","Somewhat heavy but acceptable","Too heavy — needs to be reduced"],"g2")}</div>
      </>)}

      {sec("Section H — Learning Outcomes & Impact", <>
        {rate("H1. Confidence in developing a maritime strategy after this programme","h1")}
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">H2. Which module was most valuable?</label>
        {radio(["Module 1 — Foundations of Maritime Governance","Module 2 — SWOT Analysis","Module 3 — Introduction to Maritime Strategy Development","Module 4 — Stakeholder Identification & Inter-Agency Coordination","Module 5 — Developing a Strategy for Effective Maritime Governance","Module 6 — Maritime Strategy Implementation","Module 7 — Case Study","Module 8 — Capstone"],"h2")}</div>
        {txt("H3. Which module needs more depth or improvement? Please explain.","h3")}
        {txt("H4. Most important thing you are taking back to your institution?","h4")}
        {txt("H5. Topics or areas to cover in future editions?","h5")}
      </>)}

      {sec("Section I — Final Comments", <>
        {txt("I1. What did you enjoy most about the programme?","i1")}
        {txt("I2. What was the biggest gap or weakness?","i2")}
        {txt("I3. Any other comments, suggestions, or feedback?","i3")}
      </>)}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-center">
        <p className="text-[12px] text-gray-500">Thank you for completing this evaluation. Your feedback is deeply valued.</p>
        <p className="text-[11px] text-gray-400 mt-1">Gulf of Guinea Maritime Institute (GoGMI) | Maritime Governance for Practitioners</p>
      </div>

      <button onClick={submit} disabled={saving} className="w-full bg-[#1a2332] text-white rounded-lg py-3.5 text-[15px] font-medium cursor-pointer hover:bg-[#243044] transition-colors mb-8">
        {saving ? "Submitting..." : "Submit Evaluation"}
      </button>
    </div>
  );
}
