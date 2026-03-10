interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

export default function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-5 py-5">
      <div className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="text-[28px] font-semibold text-gray-800 leading-none">
        {value}
      </div>
      {sub && <div className="text-[12.5px] text-gray-500 mt-1.5">{sub}</div>}
    </div>
  );
}