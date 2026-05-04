const payments = [
  { id: "p1", student: "Emmanuel Tetteh", course: "Marine Casualty Investigation", amount: 500, currency: "GHS", method: "Mobile Money", reference: "GOGMI-2026-0098", status: "completed" as const, date: "Apr 22, 2026" },
  { id: "p2", student: "Kofi Asante Boateng", course: "Marine Casualty Investigation", amount: 500, currency: "GHS", method: "Bank Transfer", reference: "GOGMI-2026-0095", status: "completed" as const, date: "Apr 15, 2026" },
  { id: "p3", student: "Nana Agyeman", course: "Maritime Governance", amount: 0, currency: "GHS", method: "Free", reference: "GOGMI-2026-0092", status: "completed" as const, date: "Apr 10, 2026" },
  { id: "p4", student: "Dr. Aisha Bello", course: "Marine Casualty Investigation", amount: 500, currency: "GHS", method: "Card", reference: "GOGMI-2026-0101", status: "pending" as const, date: "Apr 25, 2026" },
  { id: "p5", student: "Fatima Ibrahim", course: "Maritime Governance", amount: 0, currency: "GHS", method: "Free", reference: "GOGMI-2026-0088", status: "completed" as const, date: "Apr 1, 2026" },
];

const statusStyles: Record<string, string> = {
  completed: "bg-green-50 text-green-700",
  pending: "bg-brand-amber-light text-brand-amber",
  failed: "bg-red-50 text-red-600",
  refunded: "bg-gray-100 text-gray-600",
};

export default function AdminPaymentsPage() {
  const totalRevenue = payments.filter(p => p.status === "completed" && p.amount > 0).reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Payments</h1>
        <p className="text-[14px] text-gray-500">Track course payments and revenue.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-7">
        <div className="bg-white border border-gray-200 rounded-lg px-5 py-5">
          <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-2">Total Revenue</div>
          <div className="text-[28px] font-semibold text-gray-800 leading-none">GHS {totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-5 py-5">
          <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-2">Pending</div>
          <div className="text-[28px] font-semibold text-brand-amber leading-none">GHS {pendingAmount.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-5 py-5">
          <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-2">Transactions</div>
          <div className="text-[28px] font-semibold text-gray-800 leading-none">{payments.length}</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Reference</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="text-left px-5 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 text-[13px] font-mono text-gray-600">{p.reference}</td>
                <td className="px-5 py-3.5 text-[13px] text-gray-800">{p.student}</td>
                <td className="px-5 py-3.5 text-[13px] text-gray-600">{p.course}</td>
                <td className="px-5 py-3.5 text-[13px] text-gray-600">{p.method}</td>
                <td className="px-5 py-3.5"><span className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${statusStyles[p.status]}`}>{p.status}</span></td>
                <td className="px-5 py-3.5 text-[13px] font-semibold text-gray-800 text-right">{p.amount === 0 ? "Free" : `GHS ${p.amount}`}</td>
                <td className="px-5 py-3.5 text-[13px] text-gray-500">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}