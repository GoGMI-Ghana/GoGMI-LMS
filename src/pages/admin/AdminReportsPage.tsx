import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { LoadingSpinner } from "../../components/common";

interface Eval { id: string; student: string; email: string; course: string; responses: Record<string,string>; submittedAt: string; }

export default function AdminReportsPage() {
  const { data: evals, isLoading } = useApi<Eval[]>("/admin/evaluations");
  const [viewing, setViewing] = useState<Eval | null>(null);

  if (isLoading) return <LoadingSpinner />;

  const ratingLabels: Record<string,string> = {
    b1:"Overall programme",b2:"Content relevance",b3:"Structure & flow",
    mod1:"Module 1 — Foundations",mod2:"Module 2 — SWOT",mod3:"Module 3 — Strategy Dev",mod4:"Module 4 — Stakeholder",mod5:"Module 5 — Developing Strategy",mod6:"Module 6 — Implementation",mod7:"Module 7 — Case Study",mod8:"Module 8 — Capstone",
    e1:"Case study effectiveness",e2:"Scenario realism",h1:"Confidence in strategy dev",
    f_zoom:"Zoom quality",f_lms:"LMS platform",f_coord:"Coordination",f_collab:"Collab tools",f_time:"Communications timeliness",
    g_clarity:"Assignment clarity",g_rel:"Assignment relevance",g_feed:"Feedback usefulness",g_coa:"COA template",g_fair:"Assessment fairness",
  };

  const facLabels: Record<string,string> = {
    f1:"Dr. Alberta Ama Sagoe",f2:"Cdr. Kofi Duodu",f3:"Dr. Ian Ralby",f4:"AVM Frank Hanson",f5:"Phillip Heyl",f6:"Capt. Yirenkyi",f7:"Dr. Osei Bonsu",f8:"Col. William Ohemeng",f9:"Stephanie Schandorf",f10:"Cdre. James Kontoh",
  };

  return (
    <div>
      <div className="mb-7"><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Course Evaluations</h1><p className="text-[14px] text-gray-500">{(evals||[]).length} evaluation{(evals||[]).length!==1?"s":""} submitted.</p></div>

      {(evals||[]).length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase">Student</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase">Email</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase">Submitted</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase">Overall Rating</th>
              <th className="text-right px-5 py-3 text-[12px] font-medium text-gray-500 uppercase">Action</th>
            </tr></thead>
            <tbody>{(evals||[]).map(e => (
              <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3.5 text-[13px] font-medium text-gray-800">{e.student}</td>
                <td className="px-5 py-3.5 text-[13px] text-gray-500">{e.email}</td>
                <td className="px-5 py-3.5 text-[13px] text-gray-500">{new Date(e.submittedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</td>
                <td className="px-5 py-3.5"><span className={"text-[14px] font-semibold "+(parseInt(e.responses?.b1||"0")>=4?"text-green-600":parseInt(e.responses?.b1||"0")>=3?"text-amber-600":"text-red-600")}>{e.responses?.b1||"—"}/5</span></td>
                <td className="px-5 py-3.5 text-right"><button onClick={()=>setViewing(e)} className="text-[12px] text-teal-600 font-medium hover:underline cursor-pointer">View Details</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
          <p className="text-[14px] text-gray-500">No evaluations submitted yet.</p>
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] overflow-y-auto py-8" onClick={()=>setViewing(null)}>
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div><h2 className="text-[18px] font-semibold text-gray-800">{viewing.student}</h2><p className="text-[13px] text-gray-500">{viewing.email} · {new Date(viewing.submittedAt).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}</p></div>
              <button onClick={()=>setViewing(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer text-[20px]">×</button>
            </div>

            <div className="mb-4"><h3 className="text-[14px] font-semibold text-gray-800 mb-2">Participant Info</h3>
              <p className="text-[13px] text-gray-600">Country/Org: {viewing.responses.a1 || "—"}</p>
              <p className="text-[13px] text-gray-600">Background: {viewing.responses.a2 || "—"}</p>
            </div>

            <div className="mb-4"><h3 className="text-[14px] font-semibold text-gray-800 mb-2">Ratings</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">{Object.entries(ratingLabels).map(([k,label])=>(
                <div key={k} className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-[12px] text-gray-600">{label}</span>
                  <span className={"text-[12px] font-semibold "+(parseInt(viewing.responses[k]||"0")>=4?"text-green-600":parseInt(viewing.responses[k]||"0")>=3?"text-amber-600":"text-red-600")}>{viewing.responses[k]||"—"}/5</span>
                </div>
              ))}</div>
            </div>

            <div className="mb-4"><h3 className="text-[14px] font-semibold text-gray-800 mb-2">Facilitator Ratings</h3>
              {Object.entries(facLabels).map(([k,name])=>(
                <div key={k} className="mb-2"><span className="text-[12px] font-medium text-gray-700">{name}</span>
                  <div className="flex gap-4 text-[11px] text-gray-500">
                    <span>Knowledge: <b className="text-gray-700">{viewing.responses[k+"_k"]||"—"}</b></span>
                    <span>Clarity: <b className="text-gray-700">{viewing.responses[k+"_c"]||"—"}</b></span>
                    <span>Engagement: <b className="text-gray-700">{viewing.responses[k+"_e"]||"—"}</b></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4"><h3 className="text-[14px] font-semibold text-gray-800 mb-2">Radio Responses</h3>
              {[["b4","Recommend programme"],["e3","Case study progression"],["f2","Schedule communication"],["g2","Workload"],["h2","Most valuable module"]].map(([k,label])=>(
                <p key={k} className="text-[12px] text-gray-600 mb-1"><span className="font-medium">{label}:</span> {viewing.responses[k]||"—"}</p>
              ))}
            </div>

            <div><h3 className="text-[14px] font-semibold text-gray-800 mb-2">Written Feedback</h3>
              {[["e4","Case study improvements"],["f3","Virtual delivery issues"],["h3","Module needing depth"],["h4","Key takeaway"],["h5","Future topics"],["i1","Enjoyed most"],["i2","Biggest gap"],["i3","Other comments"]].map(([k,label])=>(
                viewing.responses[k] ? <div key={k} className="mb-3"><div className="text-[11px] font-medium text-gray-500 uppercase">{label}</div><p className="text-[13px] text-gray-700 mt-0.5">{viewing.responses[k]}</p></div> : null
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
