import { useApi } from "../../hooks/useApi";
import { LoadingSpinner } from "../../components/common";

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:3001";

interface Cert {
  id: string; courseTitle: string; category: string; duration: string;
  fileUrl: string; availableFrom: string; progress: number;
  enrollmentStatus: string; cpdPoints: number; canDownload: boolean; reason: string | null;
}

export default function CertificatesPage() {
  const { data: certs, isLoading } = useApi<Cert[]>("/courses/my-certificates/list");
  if (isLoading) return <LoadingSpinner />;

  const available = (certs || []).filter(c => c.canDownload);
  const locked = (certs || []).filter(c => !c.canDownload);
  const totalCpd = (certs || []).reduce((s, c) => s + c.cpdPoints, 0);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Certificates & CPD</h1>
        <p className="text-[14px] text-gray-500">Your earned certificates and continuing professional development points.</p>
      </div>

      {totalCpd > 0 && (
        <div className="bg-brand-navy rounded-xl p-6 mb-6 flex items-center justify-between">
          <div>
            <div className="text-white/60 text-[12px] uppercase tracking-wider mb-1">Total CPD Points</div>
            <div className="text-[36px] font-bold text-white">{totalCpd}</div>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          </div>
        </div>
      )}

      {available.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-3">Your Certificates</h2>
          <div className="flex flex-col gap-3">{available.map(c => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-gray-800">{c.courseTitle}</div>
                  <div className="text-[12px] text-gray-500">{c.category} · {c.duration}</div>
                  {c.cpdPoints > 0 && <div className="text-[12px] text-brand-teal font-medium mt-0.5">{c.cpdPoints} CPD points earned</div>}
                </div>
              </div>
              <a href={API_BASE + c.fileUrl} target="_blank" rel="noopener noreferrer" download className="bg-brand-navy text-white rounded-md px-5 py-2.5 text-[13px] font-medium hover:bg-brand-navy-light inline-flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Certificate
              </a>
            </div>
          ))}</div>
        </div>
      )}

      {locked.length > 0 && (
        <div className="mb-6">
          <h2 className="text-[15px] font-semibold text-gray-800 mb-3">Pending</h2>
          <div className="flex flex-col gap-3">{locked.map(c => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div>
                  <div className="text-[15px] font-medium text-gray-800">{c.courseTitle}</div>
                  <div className="text-[12px] text-gray-500">{c.category} · Progress: {c.progress}%</div>
                  <div className="text-[12px] text-amber-600 font-medium mt-0.5">{c.reason}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-gray-200"><div className="h-full rounded-full bg-brand-teal" style={{ width: c.progress + "%" }} /></div>
                <span className="text-[12px] text-gray-600">{c.progress}%</span>
              </div>
            </div>
          ))}</div>
        </div>
      )}

      {(certs || []).length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No certificates yet</h3>
          <p className="text-[13px] text-gray-500">Complete a course to earn your certificate and CPD points.</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-5 mt-6">
        <h3 className="text-[13px] font-semibold text-gray-800 mb-2">About CPD Points</h3>
        <p className="text-[13px] text-gray-500 leading-relaxed">Continuing Professional Development (CPD) points are awarded based on your assessment scores. Complete all course materials and receive your grades to unlock your certificate.</p>
      </div>
    </div>
  );
}