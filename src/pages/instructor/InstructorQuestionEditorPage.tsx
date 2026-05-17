import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { api } from "../../services/api";
import { LoadingSpinner } from "../../components/common";

interface Option { id?: string; optionText: string; isCorrect: boolean; }
interface Question { id: string; questionText: string; points: number; options: Option[]; }
interface Assessment { id: string; title: string; type: string; maxScore: number; course: { id: string; title: string }; questions: Question[]; totalPoints: number; questionCount: number; }

export default function InstructorQuestionEditorPage() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { data: assessment, isLoading, refetch } = useApi<Assessment>("/assessments/" + assessmentId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [points, setPoints] = useState(1);
  const [options, setOptions] = useState<Option[]>([
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
    { optionText: "", isCorrect: false },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (isLoading) return <LoadingSpinner />;
  if (!assessment) return <div className="bg-white border border-gray-200 rounded-lg py-16 text-center"><p className="text-gray-500">Assessment not found</p></div>;

  const resetForm = () => {
    setQuestionText(""); setPoints(1); setEditingQuestion(null); setError("");
    setOptions([{ optionText: "", isCorrect: false }, { optionText: "", isCorrect: false }, { optionText: "", isCorrect: false }, { optionText: "", isCorrect: false }]);
  };

  const openEdit = (q: Question) => {
    setEditingQuestion(q);
    setQuestionText(q.questionText);
    setPoints(q.points);
    setOptions(q.options.map(o => ({ ...o })));
    while (options.length < 2) options.push({ optionText: "", isCorrect: false });
    setShowAddModal(true);
  };

  const handleSave = async () => {
    setError("");
    if (!questionText.trim()) { setError("Enter the question text."); return; }
    const validOptions = options.filter(o => o.optionText.trim());
    if (validOptions.length < 2) { setError("At least 2 options are required."); return; }
    if (!validOptions.some(o => o.isCorrect)) { setError("Mark at least one option as correct."); return; }

    setSaving(true);
    try {
      if (editingQuestion) {
        await api.patch("/assessments/questions/" + editingQuestion.id, { questionText, points, questionType: "MCQ", options: validOptions.map(o => ({ optionText: o.optionText, isCorrect: o.isCorrect })) });
        setSuccessMsg("Question updated");
      } else {
        await api.post("/assessments/" + assessmentId + "/questions", { questions: [{ questionText, points, questionType: "MCQ", options: validOptions.map(o => ({ optionText: o.optionText, isCorrect: o.isCorrect })) }] });
        setSuccessMsg("Question added");
      }
      setShowAddModal(false); resetForm(); refetch();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      await api.delete("/assessments/questions/" + questionId);
      refetch();
    } catch {}
  };

  const setCorrectOption = (index: number) => {
    setOptions(options.map((o, i) => ({ ...o, isCorrect: i === index })));
  };

  const addOption = () => {
    if (options.length < 6) setOptions([...options, { optionText: "", isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 cursor-pointer mb-5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>Back
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-800 mb-1">{assessment.title}</h1>
          <p className="text-[14px] text-gray-500">{assessment.course.title} · {assessment.questionCount} questions · {assessment.totalPoints} total points</p>
        </div>
        <button onClick={() => { resetForm(); setShowAddModal(true); }} className="bg-[#1a2332] text-white rounded-md px-4 py-2.5 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">Add Question</button>
      </div>

      {successMsg && <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-green-700">{successMsg}</p></div>}

      {/* Questions list */}
      {assessment.questions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {assessment.questions.map((q, i) => (
            <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-semibold text-gray-600 shrink-0 mt-0.5">{i + 1}</span>
                  <div>
                    <div className="text-[14px] font-medium text-gray-800 mb-1">{q.questionText}</div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">{q.points} point{q.points !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                  <button onClick={() => openEdit(q)} className="border border-gray-200 rounded-md px-3 py-1.5 text-[12px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(q.id)} className="border border-red-200 rounded-md px-3 py-1.5 text-[12px] font-medium text-red-600 cursor-pointer hover:bg-red-50 transition-colors">Delete</button>
                </div>
              </div>
              <div className="ml-10 flex flex-col gap-1.5">
                {q.options.map((opt, j) => (
                  <div key={j} className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] ${opt.isCorrect ? "bg-green-50 border border-green-200 text-green-800" : "bg-gray-50 text-gray-600"}`}>
                    <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${opt.isCorrect ? 'border-green-500' : 'border-gray-300'}">
                      {opt.isCorrect && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                    </span>
                    <span>{String.fromCharCode(65 + j)}. {opt.optionText}</span>
                    {opt.isCorrect && <span className="ml-auto text-[10px] font-semibold text-green-600">CORRECT</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No questions yet</h3>
          <p className="text-[13px] text-gray-500 mb-4">Add your first question to this assessment.</p>
          <button onClick={() => { resetForm(); setShowAddModal(true); }} className="bg-[#1a2332] text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer">Add Question</button>
        </div>
      )}

      {/* Add/Edit Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => { setShowAddModal(false); resetForm(); }}>
          <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-semibold text-gray-800 mb-5">{editingQuestion ? "Edit Question" : "Add Question"}</h2>
            {error && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{error}</p></div>}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Question</label>
                <textarea value={questionText} onChange={e => setQuestionText(e.target.value)} rows={3} placeholder="Enter your question..." className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1">Points</label>
                <input type="number" value={points} onChange={e => setPoints(Math.max(1, parseInt(e.target.value) || 1))} min={1} max={100} className="w-24 bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[13px] font-medium text-gray-700">Options <span className="text-[11px] text-gray-400 font-normal">(click radio to mark correct)</span></label>
                  {options.length < 6 && <button onClick={addOption} className="text-[12px] text-brand-teal font-medium hover:underline cursor-pointer">+ Add option</button>}
                </div>
                <div className="flex flex-col gap-2">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button onClick={() => setCorrectOption(i)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${opt.isCorrect ? "border-green-500 bg-green-500" : "border-gray-300 hover:border-green-400"}`}>
                        {opt.isCorrect && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                      </button>
                      <span className="text-[13px] text-gray-400 w-5 shrink-0">{String.fromCharCode(65 + i)}.</span>
                      <input type="text" value={opt.optionText} onChange={e => { const newOpts = [...options]; newOpts[i].optionText = e.target.value; setOptions(newOpts); }} placeholder={"Option " + String.fromCharCode(65 + i)} className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-brand-teal transition-colors" />
                      {options.length > 2 && <button onClick={() => removeOption(i)} className="text-gray-400 hover:text-red-500 cursor-pointer shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowAddModal(false); resetForm(); }} className="flex-1 border border-gray-200 rounded-md py-2.5 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#1a2332] text-white rounded-md py-2.5 text-[13px] font-medium cursor-pointer hover:bg-[#243044] transition-colors">{saving ? "Saving..." : editingQuestion ? "Update Question" : "Add Question"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}