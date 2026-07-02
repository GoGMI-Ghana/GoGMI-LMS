import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { ProgressBar, LoadingSpinner } from "../../components/common";

interface Lesson { id: string; title: string; facilitator: string; duration: string; contentType: string | null; contentUrl: string | null; }
interface Module { id: string; title: string; order: number; lessons: Lesson[]; }
interface Facilitator { name: string; title: string; bio: string | null; email: string | null; phone: string | null; linkedIn: string | null; photo: string | null; }
interface Course {
  id: string; title: string; subtitle: string; description: string; category: string;
  level: string; duration: string; thumbnailCode: string; thumbnailColor: string;
  thumbnailImage: string | null; price: number; currency: string; featured: boolean;
  format: string; targetGroup: string; students: number; tags: string[];
  facilitators: Facilitator[];
  outcomes: string[];
  modules: Module[];
}
interface AccessCheck { hasAccess: boolean; enrollment: { progress: number; status: string; courseAccessId: string | null } | null; }

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: course, isLoading } = useApi<Course>("/courses/" + courseId);
  const { data: access, refetch: refetchAccess } = useApi<AccessCheck>("/courses/" + courseId + "/access");
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"overview" | "syllabus" | "facilitators">("overview");
  const [selectedFacilitator, setSelectedFacilitator] = useState<Facilitator | null>(null);

  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollStep, setEnrollStep] = useState<"certificate" | "otp" | "success">("certificate");
  const [certificateId, setCertificateId] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationKey, setVerificationKey] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [registrantName, setRegistrantName] = useState("");
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollError, setEnrollError] = useState("");

  if (isLoading) return <LoadingSpinner />;
  if (!course) return <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center"><h2 className="text-[16px] font-semibold text-gray-800 mb-1">Course not found</h2><button onClick={() => navigate("/catalog")} className="text-[13px] text-brand-teal font-medium hover:underline cursor-pointer mt-2">Back to catalog</button></div>;

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const isAdmin = user?.role === "ADMIN";
  const thumbnailSrc = course.thumbnailImage || null;

  // Extract Zoom link from format field
  const zoomMatch = course.format?.match(/https:\/\/us\d+web\.zoom\.us\/j\/\d+[^\s|]*/);
  const zoomLink = zoomMatch ? zoomMatch[0] : null;
  const meetingIdMatch = course.format?.match(/Meeting ID:\s*([\d\s]+)/);
  const passcodeMatch = course.format?.match(/Passcode:\s*(\w+)/);

  const handleVerifyCertificate = async () => {
    setEnrollError("");
    if (!certificateId.trim()) { setEnrollError("Please enter your course certificate ID."); return; }
    setEnrollLoading(true);
    try {
      const result = await api.post<{ verificationKey: string; registrantName: string; maskedEmail: string }>("/courses/" + courseId + "/verify", { certificateId: certificateId.trim() });
      setVerificationKey(result.verificationKey); setMaskedEmail(result.maskedEmail); setRegistrantName(result.registrantName); setEnrollStep("otp");
    } catch (err) { setEnrollError(err instanceof Error ? err.message : "Verification failed."); }
    finally { setEnrollLoading(false); }
  };

  const handleVerifyOtp = async () => {
    setEnrollError("");
    if (otp.length !== 6) { setEnrollError("Please enter the 6-digit code."); return; }
    setEnrollLoading(true);
    try {
      await api.post("/courses/" + courseId + "/enroll", { verificationKey, otp });
      setEnrollStep("success"); setTimeout(() => { setShowEnrollModal(false); resetModal(); refetchAccess(); }, 2500);
    } catch (err) { setEnrollError(err instanceof Error ? err.message : "Verification failed."); }
    finally { setEnrollLoading(false); }
  };

  const handleAdminEnroll = async () => {
    setEnrollLoading(true); setEnrollError("");
    try {
      await api.post("/courses/" + courseId + "/admin-enroll");
      setEnrollStep("success"); setTimeout(() => { setShowEnrollModal(false); resetModal(); refetchAccess(); }, 2000);
    } catch (err) { setEnrollError(err instanceof Error ? err.message : "Enrollment failed."); }
    finally { setEnrollLoading(false); }
  };

  const resetModal = () => { setEnrollStep("certificate"); setCertificateId(""); setOtp(""); setVerificationKey(""); setMaskedEmail(""); setRegistrantName(""); setEnrollError(""); };

  return (
    <div>
      <button onClick={() => navigate("/catalog")} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 cursor-pointer mb-5 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>Back to catalog
      </button>

      <div className="grid grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-5">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {thumbnailSrc ? <div className="h-56 overflow-hidden"><img src={thumbnailSrc} alt={course.title} className="w-full h-full object-cover" /></div>
            : <div className={`h-44 ${course.thumbnailColor || "bg-brand-navy"} flex items-center justify-center`}><span className="text-white/15 text-[80px] font-bold tracking-wider">{course.thumbnailCode}</span></div>}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-medium text-brand-teal uppercase tracking-wider">{course.category}</span>
                <span className="text-gray-300">·</span><span className="text-[11px] text-gray-500">{course.level}</span>
                {course.featured && <span className="ml-2 bg-brand-amber-light text-brand-amber text-[10px] font-semibold px-2 py-0.5 rounded">Featured</span>}
              </div>
              <h1 className="text-[22px] font-semibold text-gray-800 mb-1 leading-tight">{course.title}</h1>
              <p className="text-[13px] text-gray-400 italic mb-4">{course.subtitle}</p>
              <div className="flex items-center gap-4 text-[13px] text-gray-500 flex-wrap">
                <span>{course.duration}</span><span className="text-gray-300">·</span><span>{course.modules.length} modules</span><span className="text-gray-300">·</span><span>{totalLessons} sessions</span><span className="text-gray-300">·</span><span>{course.students} enrolled</span>
              </div>
            </div>
          </div>

          {/* Zoom banner for enrolled students */}
          {access?.hasAccess && zoomLink && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14" /><rect x="1" y="6" width="14" height="12" rx="2" ry="2" /></svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-gray-800 mb-1">Join Live Session</h3>
                  <p className="text-[13px] text-gray-600 mb-3">Sessions run every weekday. Click below to join the Zoom meeting.</p>
                  <div className="flex items-center gap-3 mb-3">
                    {meetingIdMatch && <span className="text-[12px] text-gray-500">Meeting ID: <span className="font-mono font-medium text-gray-700">{meetingIdMatch[1].trim()}</span></span>}
                    {passcodeMatch && <span className="text-[12px] text-gray-500">Passcode: <span className="font-mono font-medium text-gray-700">{passcodeMatch[1]}</span></span>}
                  </div>
                  <a href={zoomLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-md px-5 py-2.5 text-[13px] font-medium hover:bg-blue-700 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14" /><rect x="1" y="6" width="14" height="12" rx="2" ry="2" /></svg>
                    Join Zoom Meeting
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex border-b border-gray-200">
              {(["overview", "syllabus", "facilitators"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-3 text-[13.5px] font-medium capitalize transition-colors cursor-pointer ${activeTab === tab ? "text-brand-navy border-b-2 border-brand-navy" : "text-gray-500 hover:text-gray-700"}`}>{tab}</button>
              ))}
            </div>
            <div className="p-6">
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-800 mb-3">About this course</h2>
                  <p className="text-[14px] text-gray-600 leading-relaxed mb-5">{course.description}</p>
                  {course.targetGroup && <div className="mb-5"><h3 className="text-[13px] font-semibold text-gray-800 mb-2">Who is this for</h3><p className="text-[13px] text-gray-500 leading-relaxed">{course.targetGroup}</p></div>}
                  {course.outcomes.length > 0 && (
                    <div><h3 className="text-[13px] font-semibold text-gray-800 mb-2">Objectives</h3><div className="flex flex-col gap-2">{course.outcomes.map((o, i) => (
                      <div key={i} className="flex items-start gap-2.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-brand-teal shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg><span className="text-[13px] text-gray-600">{o}</span></div>
                    ))}</div></div>
                  )}
                </div>
              )}
              {activeTab === "syllabus" && (
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Course Syllabus</h2>
                  <div className="flex flex-col gap-1">{course.modules.map((module, i) => (
                    <div key={module.id} className="border border-gray-100 rounded-md overflow-hidden">
                      <button onClick={() => setExpandedModule(expandedModule === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 text-left"><span className="text-[12px] font-medium text-gray-400 w-12 shrink-0">M{i + 1}</span><span className="text-[14px] font-medium text-gray-800">{module.title}</span></div>
                        <div className="flex items-center gap-3 shrink-0"><span className="text-[12px] text-gray-500">{module.lessons.length} session{module.lessons.length !== 1 ? "s" : ""}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-400 transition-transform ${expandedModule === i ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9" /></svg></div>
                      </button>
                      {expandedModule === i && (
                        <div className="px-4 pb-3 pt-1 border-t border-gray-100">{module.lessons.map((lesson, j) => (
                          <div key={lesson.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-3"><span className="text-[11px] text-gray-400 w-5 text-center">{j + 1}</span><div><div className="text-[13px] text-gray-700">{lesson.title}</div><div className="text-[11px] text-gray-400">{lesson.facilitator}</div></div></div>
                            <span className="text-[11.5px] text-gray-400 shrink-0 ml-4">{lesson.duration}</span>
                          </div>
                        ))}</div>
                      )}
                    </div>
                  ))}</div>
                </div>
              )}
              {activeTab === "facilitators" && (
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Course Facilitators</h2>
                  <div className="flex flex-col gap-1">{course.facilitators.map((f, i) => (
                    <button key={i} onClick={() => setSelectedFacilitator(f)} className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-left w-full">
                      {f.photo ? (
                        <img src={f.photo} alt={f.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-semibold text-gray-600 shrink-0">{f.name.split(" ").filter(n => n.length > 1 && !n.includes("(")).map(n => n[0]).join("").slice(0, 2)}</div>
                      )}
                      <div className="flex-1 min-w-0"><div className="text-[14px] font-medium text-gray-800">{f.name}</div>{f.title && <div className="text-[12px] text-gray-500">{f.title}</div>}</div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-300 shrink-0"><polyline points="9 18 15 12 9 6" /></svg>
                    </button>
                  ))}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-20">
            {access?.hasAccess ? (
              <div>
                {zoomLink ? (
                  <a href={zoomLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white rounded-md py-3 text-[14px] font-medium hover:bg-blue-700 transition-colors mb-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14" /><rect x="1" y="6" width="14" height="12" rx="2" ry="2" /></svg>
                    Join Live Session
                  </a>
                ) : (
                  <button onClick={() => setActiveTab("syllabus")} className="w-full bg-brand-teal text-white rounded-md py-3 text-[14px] font-medium cursor-pointer hover:bg-brand-teal/90 transition-colors mb-3">Continue Learning</button>
                )}
                {access.enrollment && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[12.5px] mb-1.5"><span className="text-gray-500">Your progress</span><span className="font-semibold text-gray-700">{access.enrollment.progress}%</span></div>
                    <ProgressBar value={access.enrollment.progress} height="h-[5px]" />
                  </div>
                )}
                {zoomLink && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-[12px] text-gray-500 mb-1">Meeting ID</div>
                    <div className="text-[14px] font-mono text-gray-800 mb-2">{meetingIdMatch ? meetingIdMatch[1].trim() : "—"}</div>
                    <div className="text-[12px] text-gray-500 mb-1">Passcode</div>
                    <div className="text-[14px] font-mono text-gray-800">{passcodeMatch ? passcodeMatch[1] : "—"}</div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="text-center mb-1"><span className="text-[28px] font-semibold text-gray-800">{course.currency} {course.price.toLocaleString()}</span></div>
                <p className="text-[11.5px] text-gray-400 text-center mb-4">USD 350 (Members) · USD 450 (Non-members)</p>
                <button onClick={() => { resetModal(); setShowEnrollModal(true); }} className="w-full bg-brand-navy text-white rounded-md py-2.5 text-[14px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors mb-2">Enroll in Course</button>
                <p className="text-[12px] text-gray-400 text-center leading-relaxed">{isAdmin ? "As admin, you can enroll directly." : "Enter your course certificate ID to verify enrollment eligibility."}</p>
              </div>
            )}

            <div className="mt-5 pt-5 border-t border-gray-100">
              <h3 className="text-[13px] font-semibold text-gray-800 mb-3">This course includes</h3>
              <div className="flex flex-col gap-2.5">
                {[course.modules.length + " modules, " + totalLessons + " sessions", course.duration + " duration", "Certificate of completion", "CPD points upon completion", "Recorded sessions for review"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-brand-teal shrink-0"><polyline points="20 6 9 17 4 12" /></svg><span className="text-[13px] text-gray-600">{item}</span></div>
                ))}
              </div>
            </div>
          </div>

          {course.tags.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-5"><h3 className="text-[13px] font-semibold text-gray-800 mb-3">Topics</h3><div className="flex flex-wrap gap-2">{course.tags.map(tag => <span key={tag} className="bg-gray-100 text-gray-600 text-[12px] px-2.5 py-1 rounded-md">{tag}</span>)}</div></div>
          )}
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => { setShowEnrollModal(false); resetModal(); }}>
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            {isAdmin && enrollStep === "certificate" && (
              <div>
                <h2 className="text-[18px] font-semibold text-gray-800 mb-1">Enroll in {course.title}</h2>
                <p className="text-[13px] text-gray-500 mb-5">As admin, you can enroll directly.</p>
                {enrollError && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{enrollError}</p></div>}
                <button onClick={handleAdminEnroll} disabled={enrollLoading} className={`w-full rounded-md py-2.5 text-[14px] font-medium text-white cursor-pointer transition-colors ${enrollLoading ? "bg-brand-navy-muted" : "bg-brand-navy hover:bg-brand-navy-light"}`}>{enrollLoading ? "Enrolling..." : "Enroll Now"}</button>
                <div className="text-center mt-3"><button onClick={() => { setShowEnrollModal(false); resetModal(); }} className="text-[13px] text-gray-500 hover:text-gray-700 cursor-pointer">Cancel</button></div>
              </div>
            )}
            {!isAdmin && enrollStep === "certificate" && (
              <div>
                <h2 className="text-[18px] font-semibold text-gray-800 mb-1">Enroll in {course.title}</h2>
                <p className="text-[13px] text-gray-500 mb-5">Enter your course certificate ID to verify your eligibility.</p>
                {enrollError && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{enrollError}</p></div>}
                <div><label className="block text-[13px] font-medium text-gray-700 mb-1.5">Course Certificate ID</label><input type="text" value={certificateId} onChange={e => setCertificateId(e.target.value.toUpperCase())} placeholder="e.g. GoGMI-CTMG2026-0001" onKeyDown={e => { if (e.key === "Enter") handleVerifyCertificate(); }} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors font-mono tracking-wide" /></div>
                <div className="flex gap-3 mt-5"><button onClick={() => { setShowEnrollModal(false); resetModal(); }} className="flex-1 border border-gray-200 rounded-md py-2.5 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button><button onClick={handleVerifyCertificate} disabled={enrollLoading} className={`flex-1 rounded-md py-2.5 text-[13px] font-medium text-white cursor-pointer transition-colors ${enrollLoading ? "bg-brand-navy-muted" : "bg-brand-navy hover:bg-brand-navy-light"}`}>{enrollLoading ? "Verifying..." : "Verify"}</button></div>
                <p className="text-[11.5px] text-gray-400 text-center mt-4">Don't have a certificate ID? Contact GoGMI at info@gogmi.org.gh</p>
              </div>
            )}
            {enrollStep === "otp" && (
              <div>
                <button onClick={() => { setEnrollStep("certificate"); setEnrollError(""); setOtp(""); }} className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-gray-700 cursor-pointer mb-4"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>Back</button>
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B1F3F" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,7 12,13 2,7" /></svg></div>
                <h2 className="text-[18px] font-semibold text-gray-800 mb-1">Verify Your Identity</h2>
                <p className="text-[13px] text-gray-500 mb-1">Certificate verified for <span className="font-medium text-gray-700">{registrantName}</span>.</p>
                <p className="text-[13px] text-gray-500 mb-5">A 6-digit code has been sent to <span className="font-medium text-gray-700">{maskedEmail}</span>.</p>
                {enrollError && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{enrollError}</p></div>}
                <div><label className="block text-[13px] font-medium text-gray-700 mb-1.5">Verification Code</label><input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" maxLength={6} onKeyDown={e => { if (e.key === "Enter") handleVerifyOtp(); }} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-3 text-[20px] text-center text-gray-800 outline-none placeholder:text-gray-300 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors font-mono tracking-[12px]" /></div>
                <button onClick={handleVerifyOtp} disabled={enrollLoading} className={`w-full rounded-md py-2.5 text-[14px] font-medium text-white cursor-pointer transition-colors mt-5 ${enrollLoading ? "bg-brand-navy-muted" : "bg-brand-navy hover:bg-brand-navy-light"}`}>{enrollLoading ? "Verifying..." : "Complete Enrollment"}</button>
                <p className="text-[11.5px] text-gray-400 text-center mt-4">Code expires in 10 minutes.</p>
              </div>
            )}
            {enrollStep === "success" && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg></div>
                <h2 className="text-[20px] font-semibold text-gray-800 mb-2">Enrollment Complete!</h2>
                <p className="text-[14px] text-gray-500">You now have access to {course.title}.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Facilitator Detail Modal */}
      {selectedFacilitator && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setSelectedFacilitator(null)}>
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-4">
              {selectedFacilitator.photo ? (
                <img src={selectedFacilitator.photo} alt={selectedFacilitator.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-[15px] font-semibold text-gray-600 shrink-0">{selectedFacilitator.name.split(" ").filter(n => n.length > 1 && !n.includes("(")).map(n => n[0]).join("").slice(0, 2)}</div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-[17px] font-semibold text-gray-800 leading-tight">{selectedFacilitator.name}</h2>
                {selectedFacilitator.title && <p className="text-[13px] text-gray-500 mt-0.5">{selectedFacilitator.title}</p>}
              </div>
              <button onClick={() => setSelectedFacilitator(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="mb-4">
              <h3 className="text-[12px] font-semibold text-gray-800 uppercase tracking-wide mb-1.5">Bio</h3>
              <p className="text-[13.5px] text-gray-600 leading-relaxed">{selectedFacilitator.bio || "No biography has been added for this facilitator yet."}</p>
            </div>

            {(selectedFacilitator.email || selectedFacilitator.phone || selectedFacilitator.linkedIn) && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-[12px] font-semibold text-gray-800 uppercase tracking-wide mb-2">Contact</h3>
                <div className="flex flex-col gap-2">
                  {selectedFacilitator.email && (
                    <a href={`mailto:${selectedFacilitator.email}`} className="flex items-center gap-2.5 text-[13.5px] text-gray-600 hover:text-brand-teal transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400 shrink-0"><path d="M4 4h16v16H4z" /><path d="m22 6-10 7L2 6" /></svg>
                      {selectedFacilitator.email}
                    </a>
                  )}
                  {selectedFacilitator.phone && (
                    <a href={`tel:${selectedFacilitator.phone}`} className="flex items-center gap-2.5 text-[13.5px] text-gray-600 hover:text-brand-teal transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400 shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                      {selectedFacilitator.phone}
                    </a>
                  )}
                  {selectedFacilitator.linkedIn && (
                    <a href={selectedFacilitator.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[13.5px] text-gray-600 hover:text-brand-teal transition-colors">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400 shrink-0"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}