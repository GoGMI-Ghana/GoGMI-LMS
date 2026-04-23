import { useState } from "react";

type TabType = "upcoming" | "submitted" | "graded";

interface Assessment {
  id: string;
  title: string;
  course: string;
  type: "assignment" | "quiz" | "exam";
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  score?: string;
  maxScore?: string;
  submittedDate?: string;
  urgent?: boolean;
}

const assessments: Assessment[] = [
  { id: "a1", title: "SWOT Analysis Activity", course: "Maritime Governance", type: "assignment", dueDate: "May 7, 2026", status: "pending", urgent: true },
  { id: "a2", title: "Vision Statement Development", course: "Maritime Governance", type: "assignment", dueDate: "May 14, 2026", status: "pending" },
  { id: "a3", title: "Stakeholder Analysis Exercise", course: "Maritime Governance", type: "assignment", dueDate: "May 21, 2026", status: "pending" },
  { id: "a4", title: "Case Study Group Report", course: "Maritime Governance", type: "exam", dueDate: "May 28, 2026", status: "pending" },
  { id: "a5", title: "Module 1 Assessment — Legal Framework", course: "Marine Casualty Investigation", type: "quiz", dueDate: "May 15, 2026", status: "pending" },
  { id: "a6", title: "Evidence Handling Practical", course: "Marine Casualty Investigation", type: "assignment", dueDate: "May 22, 2026", status: "pending" },
  { id: "a7", title: "Module 1 Quiz — Strategy Theory", course: "Maritime Governance", type: "quiz", dueDate: "Apr 10, 2026", status: "graded", score: "88", maxScore: "100", submittedDate: "Apr 9, 2026" },
  { id: "a8", title: "Module 2 Quiz — Challenges & Opportunities", course: "Maritime Governance", type: "quiz", dueDate: "Apr 17, 2026", status: "graded", score: "92", maxScore: "100", submittedDate: "Apr 16, 2026" },
  { id: "a9", title: "Preliminary Assessment Report", course: "Maritime Governance", type: "assignment", dueDate: "Apr 20, 2026", status: "submitted", submittedDate: "Apr 19, 2026" },
];

const typeLabels: Record<string, { label: string; className: string }> = {
  assignment: { label: "Assignment", className: "bg-brand-amber-light text-brand-amber" },
  quiz: { label: "Quiz", className: "bg-blue-50 text-brand-navy-muted" },
  exam: { label: "Exam", className: "bg-red-50 text-red-600" },
};

export default function AssessmentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  const filtered = assessments.filter(a => {
    if (activeTab === "upcoming") return a.status === "pending";
    if (activeTab === "submitted") return a.status === "submitted";
    return a.status === "graded";
  });

  const counts = {
    upcoming: assessments.filter(a => a.status === "pending").length,
    submitted: assessments.filter(a => a.status === "submitted").length,
    graded: assessments.filter(a => a.status === "graded").length,
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Assessments</h1>
        <p className="text-[14px] text-gray-500">Manage your quizzes, assignments, and exams.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {(["upcoming", "submitted", "graded"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-[13.5px] font-medium capitalize transition-colors cursor-pointer ${activeTab === tab ? "text-brand-navy border-b-2 border-brand-navy" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-2">
          {filtered.map(a => {
            const typeStyle = typeLabels[a.type];
            return (
              <div key={a.id} className="bg-white border border-gray-200 rounded-lg px-5 py-4 flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap ${typeStyle.className}`}>{typeStyle.label}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-medium text-gray-800">{a.title}</h3>
                  <p className="text-[12.5px] text-gray-500 mt-0.5">{a.course}</p>
                </div>
                {a.status === "graded" && a.score && (
                  <div className="text-right shrink-0">
                    <div className="text-[16px] font-semibold text-gray-800">{a.score}<span className="text-[12px] text-gray-400 font-normal">/{a.maxScore}</span></div>
                    <div className="text-[11px] text-gray-400">Submitted {a.submittedDate}</div>
                  </div>
                )}
                {a.status === "submitted" && (
                  <div className="text-right shrink-0">
                    <span className="text-[12px] text-brand-amber font-medium">Awaiting grade</span>
                    <div className="text-[11px] text-gray-400 mt-0.5">Submitted {a.submittedDate}</div>
                  </div>
                )}
                {a.status === "pending" && (
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[12px] ${a.urgent ? "text-red-600 font-semibold" : "text-gray-500"}`}>Due {a.dueDate}</span>
                    <button className="bg-brand-navy text-white rounded-md px-3.5 py-1.5 text-[12.5px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors">Start</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-12 flex flex-col items-center">
          <p className="text-[14px] text-gray-500">No {activeTab} assessments.</p>
        </div>
      )}
    </div>
  );
}