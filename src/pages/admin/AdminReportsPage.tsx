export default function AdminReportsPage() {
  const reports = [
    { title: "Enrollment Summary", description: "Total enrollments by course, date range, and student demographics.", icon: "EN" },
    { title: "Course Completion", description: "Completion rates, average scores, and time-to-complete by course.", icon: "CC" },
    { title: "Student Progress", description: "Individual student progress across all enrolled courses.", icon: "SP" },
    { title: "CPD Points Summary", description: "CPD points earned and outstanding by student and period.", icon: "CP" },
    { title: "Assessment Results", description: "Quiz and assignment scores, pass/fail rates, and grade distribution.", icon: "AR" },
    { title: "Financial Summary", description: "Revenue by course, payment method breakdown, and outstanding payments.", icon: "FN" },
    { title: "Attendance Report", description: "Live session attendance rates by course and student.", icon: "AT" },
    { title: "Certificate Issuance", description: "Certificates issued by course, date, and student.", icon: "CI" },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Reports</h1>
        <p className="text-[14px] text-gray-500">Generate and export platform reports.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {reports.map(report => (
          <div key={report.title} className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center text-[13px] font-bold text-gray-500 shrink-0">
              {report.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-[14.5px] font-semibold text-gray-800 mb-1">{report.title}</h3>
              <p className="text-[12.5px] text-gray-500 leading-relaxed mb-3">{report.description}</p>
              <div className="flex gap-2">
                <button className="border border-gray-200 rounded-md px-3 py-1.5 text-[12.5px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Generate</button>
                <button className="border border-gray-200 rounded-md px-3 py-1.5 text-[12.5px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">Export CSV</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}