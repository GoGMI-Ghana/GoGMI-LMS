import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function EvaluationPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [v, setV] = useState<Record<string,string>>({});
  const [saving, setSaving] = useState(false);

  if (submitted) return (
    <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
      <h2 className="text-[18px] font-semibold text-gray-800 mb-2">Thank you!</h2>
      <p className="text-[14px] text-gray-500 mb-4">Your evaluation has been submitted.</p>
      <button onClick={() => navigate("/certificates")} className="bg-[#1a2332] text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer">View Certificates</button>
    </div>
  );

  const handleSubmit = async () => {
    setSaving(true);
    try { await api.post("/courses/evaluation/submit", { courseId: "crs_maritime_governance", responses: v }); setSubmitted(true); }
    catch {}
    setSaving(false);
  };

  const R = (label: string, k: string) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-50">
      <span className="text-[13px] text-gray-700 flex-1 pr-4">{label}</span>
      <div className="flex gap-2">{[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => setV(p => ({...p,[k]:String(n)}))} className={"w-8 h-8 rounded-full text-[12px] font-semibold cursor-pointer " + (v[k]===String(n) ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-500")}>{n}</button>
      ))}</div>
    </div>
  );

  return (
    <div className="max-w-3xl">
      <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Course Evaluation Form</h1>
      <p className="text-[14px] text-gray-500 mb-6">Maritime Governance for Practitioners — Your feedback is confidential.</p>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Participant Information</h2>
        <div className="mb-3"><label className="block text-[13px] font-medium text-gray-700 mb-1">Country and organisation</label><input value={v.a1||""} onChange={e => setV(p=>({...p,a1:e.target.value}))} className="w-full border border-gray-200 rounded-md px-3 py-2 text-[14px] outline-none" /></div>
        <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Professional background</label>
        {["Military/Naval","Government","Academia","Private Sector","NGO","Other"].map(o => <label key={o} className="flex items-center gap-2 cursor-pointer my-1"><input type="radio" name="a2" checked={v.a2===o} onChange={() => setV(p=>({...p,a2:o}))} /><span className="text-[13px]">{o}</span></label>)}</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Overall Programme (1=Poor, 5=Excellent)</h2>
        {R("Overall programme rating","b1")}
        {R("Content relevance to role","b2")}
        {R("Programme structure and flow","b3")}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Module Ratings</h2>
        {R("Module 1 — Foundations","mod1")}{R("Module 2 — SWOT","mod2")}{R("Module 3 — Strategy Dev","mod3")}{R("Module 4 — Stakeholder","mod4")}{R("Module 5 — Developing Strategy","mod5")}{R("Module 6 — Implementation","mod6")}{R("Module 7 — Case Study","mod7")}{R("Module 8 — Capstone","mod8")}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Facilitator Ratings</h2>
        {[["Dr. Alberta Ama Sagoe","f1"],["Cdr. Kofi Duodu","f2"],["Dr. Ian Ralby","f3"],["AVM Frank Hanson","f4"],["Phillip Heyl","f5"],["Capt. Yirenkyi","f6"],["Dr. Osei Bonsu","f7"],["Col. William Ohemeng","f8"],["Stephanie Schandorf","f9"],["Cdre. James Kontoh","f10"]].map(([n,k]) => <div key={k} className="mb-3"><div className="text-[13px] font-medium text-gray-800 mb-1">{n}</div>{R("Knowledge",k+"k")}{R("Clarity",k+"c")}{R("Engagement",k+"e")}</div>)}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Case Study & Delivery</h2>
        {R("Case study effectiveness","e1")}{R("Realism of scenario","e2")}{R("Zoom quality","fz")}{R("LMS platform","fl")}{R("Coordination","fc")}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Learning Outcomes</h2>
        {R("Confidence in strategy development","h1")}
        <div className="mt-3"><label className="block text-[13px] font-medium text-gray-700 mb-1">Most valuable module?</label>
        {["Module 1","Module 2","Module 3","Module 4","Module 5","Module 6","Module 7","Module 8"].map(o => <label key={o} className="flex items-center gap-2 cursor-pointer my-1"><input type="radio" name="h2" checked={v.h2===o} onChange={() => setV(p=>({...p,h2:o}))} /><span className="text-[13px]">{o}</span></label>)}</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Final Comments</h2>
        <div className="mb-3"><label className="block text-[13px] font-medium text-gray-700 mb-1">What did you enjoy most?</label><textarea rows={3} value={v.i1||""} onChange={e => setV(p=>({...p,i1:e.target.value}))} className="w-full border border-gray-200 rounded-md px-3 py-2 text-[14px] outline-none resize-none" /></div>
        <div className="mb-3"><label className="block text-[13px] font-medium text-gray-700 mb-1">Biggest gap or weakness?</label><textarea rows={3} value={v.i2||""} onChange={e => setV(p=>({...p,i2:e.target.value}))} className="w-full border border-gray-200 rounded-md px-3 py-2 text-[14px] outline-none resize-none" /></div>
        <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Other comments?</label><textarea rows={3} value={v.i3||""} onChange={e => setV(p=>({...p,i3:e.target.value}))} className="w-full border border-gray-200 rounded-md px-3 py-2 text-[14px] outline-none resize-none" /></div>
      </div>

      <button onClick={handleSubmit} disabled={saving} className="w-full bg-[#1a2332] text-white rounded-lg py-3.5 text-[15px] font-medium cursor-pointer mb-8">{saving ? "Submitting..." : "Submit Evaluation"}</button>
    </div>
  );
}
