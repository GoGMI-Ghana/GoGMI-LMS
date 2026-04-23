import { currentUser } from "../../data/mock";

interface Certificate {
  id: string;
  courseTitle: string;
  issueDate: string;
  cpdPoints: number;
  certificateNo: string;
}

const certificates: Certificate[] = [
  { id: "cert_001", courseTitle: "Introduction to the Maritime Industry", issueDate: "Jan 15, 2026", cpdPoints: 5, certificateNo: "GOGMI-2026-0042" },
];

const cpdHistory = [
  { id: "cpd_001", activity: "Introduction to the Maritime Industry — Completion", points: 5, date: "Jan 15, 2026", type: "Course" },
  { id: "cpd_002", activity: "IMSWG Q4 2025 Meeting — Attendance", points: 3, date: "Dec 10, 2025", type: "Event" },
  { id: "cpd_003", activity: "Maritime Security Fundamentals — Module 1-4", points: 8, date: "Nov 20, 2025", type: "Course" },
  { id: "cpd_004", activity: "Blue Economy Webinar Series", points: 4, date: "Oct 5, 2025", type: "Event" },
  { id: "cpd_005", activity: "GoGMI Annual Conference 2025", points: 4, date: "Sep 15, 2025", type: "Event" },
];

export default function CertificatesPage() {
  const pct = Math.round((currentUser.cpdPoints / currentUser.cpdTarget) * 100);
  const radius = 52;
  const stroke = 7;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Certificates & CPD</h1>
        <p className="text-[14px] text-gray-500">View your certificates and track continuing professional development points.</p>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6">
        {/* Left */}
        <div className="flex flex-col gap-6">
          {/* Certificates */}
          <div>
            <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Certificates ({certificates.length})</h2>
            <div className="flex flex-col gap-3">
              {certificates.map(cert => (
                <div key={cert.id} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-amber-light flex items-center justify-center shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4920B" strokeWidth="1.8" strokeLinecap="round"><path d="M12 15l-2 5 2-1.5L14 20l-2-5z" /><circle cx="12" cy="9" r="6" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-gray-800">{cert.courseTitle}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[12.5px] text-gray-500">
                      <span>Issued {cert.issueDate}</span>
                      <span className="text-gray-300">·</span>
                      <span>No. {cert.certificateNo}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-brand-teal font-medium">{cert.cpdPoints} CPD points</span>
                    </div>
                  </div>
                  <button className="border border-gray-200 rounded-md px-3.5 py-1.5 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors shrink-0">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CPD History */}
          <div>
            <h2 className="text-[15px] font-semibold text-gray-800 mb-4">CPD History</h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-right px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {cpdHistory.map(item => (
                    <tr key={item.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-5 py-3.5 text-[13px] text-gray-800">{item.activity}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${item.type === "Course" ? "bg-blue-50 text-brand-navy-muted" : "bg-brand-teal-light text-brand-teal"}`}>{item.type}</span>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-gray-500">{item.date}</td>
                      <td className="px-5 py-3.5 text-[13px] font-semibold text-gray-800 text-right">+{item.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right - CPD Summary */}
        <div className="flex flex-col gap-5">
          <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-20">
            <h3 className="text-[15px] font-semibold text-gray-800 mb-5">CPD Summary</h3>
            <div className="flex flex-col items-center mb-5">
              <svg height={radius * 2} width={radius * 2} className="-rotate-90">
                <circle className="stroke-gray-200" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
                <circle className="stroke-brand-teal transition-all duration-500 ease-out" fill="transparent" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={dashOffset} r={normalizedRadius} cx={radius} cy={radius} />
              </svg>
              <div className="mt-4 text-center">
                <div className="text-[28px] font-semibold text-gray-800">{currentUser.cpdPoints}</div>
                <div className="text-[13px] text-gray-500">of {currentUser.cpdTarget} points target</div>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Current period</span>
                <span className="font-medium text-gray-800">Q2 2026</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Points earned</span>
                <span className="font-medium text-gray-800">{currentUser.cpdPoints}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Remaining</span>
                <span className="font-medium text-brand-teal">{currentUser.cpdTarget - currentUser.cpdPoints}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Certificates earned</span>
                <span className="font-medium text-gray-800">{certificates.length}</span>
              </div>
            </div>
            <button className="w-full mt-5 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
              Export CPD Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}