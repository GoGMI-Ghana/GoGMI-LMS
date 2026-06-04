import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { LoadingSpinner } from "../../components/common";

const COURSE_ID = "crs_maritime_governance";

const ratingRow = (label: string, key: string, values: Record<string, string>, set: (v: Record<string, string>) => void) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-[13px] text-gray-700 flex-1 pr-4">{label}</span>
    <div className="flex gap-3">{[1, 2, 3, 4, 5].map(n => (
      <button key={n} onClick={() => set({ ...values, [key]: String(n) })} className={`w-8 h-8 rounded-full text-[12px] font-semibold cursor-pointer transition-colors ${values[key] === String(n) ? "bg-brand-teal text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{n}</button>
    ))}</div>
  </div>
);

const radioGroup = (options: string[], key: string, values: Record<string, string>, set: (v: Record<string, string>) => void) => (
  <div className="flex flex-col gap-2 mt-2">{options.map(opt => (
    <label key={opt} className="flex items-center gap-2 cursor-pointer">
      <input type="radio" name={key} checked={values[key] === opt} onChange={() => set({ ...values, [key]: opt })} className="accent-brand-teal" />
      <span className="text-[13px] text-gray-700">{opt}</span>
    </label>
  ))}</div>
);

export default function EvaluationPage() {
  const navigate = useNavigate();
  const [v, setV] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<{ submitted: boolean }>("/courses/evaluation/status/" + COURSE_ID)
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
      <button onClick={() => navigate("/certificates")} className="bg-brand-navy text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light">View Certificates</button>
    </div>
  );

  const handleSubmit = async () => {
    setError("");
    const required = ["a1", "a2", "b1", "b2", "b3", "b4", "mod1", "mod2", "mod3", "mod4", "mod5", "mod6", "mod7", "mod8", "e1", "e2", "e3", "h1", "h2"];
    const missing = required.filter(k => !v[k]);
    if (missing.length > 0) { setError("Please complete all required fields before submitting."); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setSubmitting(true);
    try {
      await api.post("/courses/evaluation/submit", { courseId: COURSE_ID, responses: v });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to submit"); }
    finally { setSubmitting(false); }
  };

  const section = (title: string, children: React.ReactNode) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      <h2 className="text-[16px] font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Course Evaluation Form</h1>
        <p className="text-[14px] text-gray-500">Maritime Governance for Practitioners — African Maritime Practitioners Programme</p>
        <p className="text-[13px] text-gray-400 mt-1">Your feedback is confidential and will directly inform improvements to future editions.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{error}</p></div>}

      {section("Section A — Participant Information", <>
        <div className="mb-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">A1. Country and organisation</label><input type="text" value={v.a1 || ""} onChange={e => setV({ ...v, a1: e.target.value })} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal" /></div>
        <div><label className="block text-[13px] font-medium text-gray-700 mb-1">A2. Professional background</label>
        {radioGroup(["Military / Naval", "Government / Civil Service", "Academia / Research", "Private Sector", "NGO / Civil Society", "Other"], "a2", v, setV)}
        {v.a2 === "Other" && <input type="text" placeholder="Please specify" value={v.a2other || ""} onChange={e => setV({ ...v, a2other: e.target.value })} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal mt-2" />}
        </div>
      </>)}

      {section("Section B — Overall Programme Assessment", <>
        <p className="text-[12px] text-gray-400 mb-3">Scale: 1 = Poor, 5 = Excellent</p>
        {ratingRow("B1. Overall programme rating", "b1", v, setV)}
        {ratingRow("B2. Content relevance to your role", "b2", v, setV)}
        {ratingRow("B3. Programme structure and flow", "b3", v, setV)}
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">B4. Would you recommend this programme to a colleague?</label>
        {radioGroup(["Definitely yes", "Probably yes", "Not sure", "Probably not", "Definitely not"], "b4", v, setV)}</div>
      </>)}

      {section("Section C — Module-by-Module Rating", <>
        <p className="text-[12px] text-gray-400 mb-3">Rate each module: 1 = Poor, 5 = Excellent</p>
        {ratingRow("Module 1 — Foundations of Maritime Governance", "mod1", v, setV)}
        {ratingRow("Module 2 — SWOT Analysis of the Maritime Domain", "mod2", v, setV)}
        {ratingRow("Module 3 — Intro to Maritime Strategy Development", "mod3", v, setV)}
        {ratingRow("Module 4 — Stakeholder Identification & Coordination", "mod4", v, setV)}
        {ratingRow("Module 5 — Developing a Strategy for Effective Governance", "mod5", v, setV)}
        {ratingRow("Module 6 — Maritime Strategy Implementation", "mod6", v, setV)}
        {ratingRow("Module 7 — Case Study", "mod7", v, setV)}
        {ratingRow("Module 8 — Capstone Group Presentation", "mod8", v, setV)}
      </>)}

      {section("Section D — Facilitator Assessment", <>
        <p className="text-[12px] text-gray-400 mb-3">Rate: 1 = Poor, 5 = Excellent</p>
        {[
          ["Dr. Alberta Ama Sagoe (Module 1)", "fac_sagoe"],
          ["Cdr. Kofi Amponsah Duodu (Module 1)", "fac_duodu"],
          ["Dr. Ian Ralby (Module 2 — SWOT)", "fac_ralby"],
          ["AVM Frank Hanson Rtd (Module 3 & Capstone)", "fac_hanson"],
          ["Phillip Heyl (Module 3 — Strategy)", "fac_heyl"],
          ["Naval Capt. Ebenezer Yirenkyi (Modules 4 & 5)", "fac_yirenkyi"],
          ["Dr. Osei Bonsu Dickson (Module 4 — Legal)", "fac_dickson"],
          ["Colonel William Ohemeng (Module 5)", "fac_william"],
          ["Stephanie Schandorf (Module 6)", "fac_stephanie"],
          ["Commodore James Kontoh Rtd (Module 7)", "fac_kontoh"],
        ].map(([label, key]) => (
          <div key={key} className="mb-3 pb-3 border-b border-gray-50 last:border-0">
            <div className="text-[13px] font-medium text-gray-800 mb-2">{label}</div>
            {ratingRow("Knowledge & Expertise", key + "_k", v, setV)}
            {ratingRow("Clarity of Delivery", key + "_c", v, setV)}
            {ratingRow("Engagement & Interaction", key + "_e", v, setV)}
          </div>
        ))}
      </>)}

      {section("Section E — Case Study (Mahara)", <>
        <p className="text-[12px] text-gray-400 mb-3">Scale: 1 = Not effective/realistic, 5 = Very effective/realistic</p>
        {ratingRow("E1. Case study effectiveness", "e1", v, setV)}
        {ratingRow("E2. Realism of Mahara scenario", "e2", v, setV)}
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">E3. Did the case study evolve meaningfully across modules?</label>
        {radioGroup(["Yes, very effectively", "Somewhat — could have been better connected", "Not very well — felt disconnected at times"], "e3", v, setV)}</div>
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">E4. What could be improved about the case study?</label><textarea rows={3} value={v.e4 || ""} onChange={e => setV({ ...v, e4: e.target.value })} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal resize-none" /></div>
      </>)}

      {section("Section F — Virtual Delivery & Coordination", <>
        <p className="text-[12px] text-gray-400 mb-3">Scale: 1 = Poor, 5 = Excellent</p>
        {ratingRow("Zoom session quality", "f_zoom", v, setV)}
        {ratingRow("LMS platform", "f_lms", v, setV)}
        {ratingRow("Course coordination", "f_coord", v, setV)}
        {ratingRow("Collaborative tools (Miro, Zoom breakout)", "f_collab", v, setV)}
        {ratingRow("Timeliness of communications", "f_time", v, setV)}
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">F2. Were schedule changes communicated clearly?</label>
        {radioGroup(["Always", "Most of the time", "Sometimes", "Rarely"], "f2", v, setV)}</div>
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">F3. Any issues with virtual delivery?</label><textarea rows={3} value={v.f3 || ""} onChange={e => setV({ ...v, f3: e.target.value })} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal resize-none" /></div>
      </>)}

      {section("Section G — Assignments & Assessment", <>
        <p className="text-[12px] text-gray-400 mb-3">Scale: 1 = Poor, 5 = Excellent</p>
        {ratingRow("Clarity of assignment briefs", "g_clarity", v, setV)}
        {ratingRow("Relevance of assignments", "g_relevance", v, setV)}
        {ratingRow("Usefulness of feedback", "g_feedback", v, setV)}
        {ratingRow("COA Brief template quality", "g_coa", v, setV)}
        {ratingRow("Overall assessment fairness", "g_fairness", v, setV)}
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">G2. Was the workload manageable?</label>
        {radioGroup(["Very manageable", "Mostly manageable", "Somewhat heavy but acceptable", "Too heavy — needs to be reduced"], "g2", v, setV)}</div>
      </>)}

      {section("Section H — Learning Outcomes & Impact", <>
        {ratingRow("H1. Confidence in strategy development after this programme", "h1", v, setV)}
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">H2. Which module was most valuable?</label>
        {radioGroup(["Module 1 — Foundations", "Module 2 — SWOT Analysis", "Module 3 — Strategy Development", "Module 4 — Stakeholder & Coordination", "Module 5 — Developing Strategy", "Module 6 — Implementation", "Module 7 — Case Study", "Module 8 — Capstone"], "h2", v, setV)}</div>
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">H3. Which module needs more depth? Please explain.</label><textarea rows={3} value={v.h3 || ""} onChange={e => setV({ ...v, h3: e.target.value })} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal resize-none" /></div>
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">H4. Most important thing you are taking back to your institution?</label><textarea rows={3} value={v.h4 || ""} onChange={e => setV({ ...v, h4: e.target.value })} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal resize-none" /></div>
        <div className="mt-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">H5. Topics to cover in future editions?</label><textarea rows={3} value={v.h5 || ""} onChange={e => setV({ ...v, h5: e.target.value })} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal resize-none" /></div>
      </>)}

      {section("Section I — Final Comments", <>
        <div className="mb-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">I1. What did you enjoy most?</label><textarea rows={3} value={v.i1 || ""} onChange={e => setV({ ...v, i1: e.target.value })} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal resize-none" /></div>
        <div className="mb-4"><label className="block text-[13px] font-medium text-gray-700 mb-1">I2. Biggest gap or weakness?</label><textarea rows={3} value={v.i2 || ""} onChange={e => setV({ ...v, i2: e.target.value })} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal resize-none" /></div>
        <div><label className="block text-[13px] font-medium text-gray-700 mb-1">I3. Any other comments or suggestions?</label><textarea rows={3} value={v.i3 || ""} onChange={e => setV({ ...v, i3: e.target.value })} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal resize-none" /></div>
      </>)}

      <button onClick={handleSubmit} disabled={submitting} className="w-full bg-brand-navy text-white rounded-lg py-3.5 text-[15px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors mb-8">
        {submitting ? "Submitting..." : "Submit Evaluation"}
      </button>
    </div>
  );
}