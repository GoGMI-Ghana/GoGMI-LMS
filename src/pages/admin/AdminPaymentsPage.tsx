export default function AdminPaymentsPage() {
  return (
    <div>
      <div className="mb-7"><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Payments</h1><p className="text-[14px] text-gray-500">Payment integration coming soon.</p></div>
      <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 mb-3"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No payment records yet</h3>
        <p className="text-[13px] text-gray-500">Paystack integration will be added soon.</p>
      </div>
    </div>
  );
}