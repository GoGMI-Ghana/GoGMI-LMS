interface CPDWidgetProps {
  current: number;
  target: number;
  period?: string;
}

export default function CPDWidget({ current, target, period = "Q1 2026" }: CPDWidgetProps) {
  const pct = Math.round((current / target) * 100);
  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h2 className="text-[15px] font-semibold text-gray-800 mb-4">CPD Progress</h2>
      <div className="flex items-center gap-5">
        <svg height={radius * 2} width={radius * 2} className="-rotate-90 shrink-0">
          <circle
            className="stroke-gray-200"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            className="stroke-brand-teal transition-all duration-500 ease-out"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div>
          <div className="text-2xl font-semibold text-gray-800">
            {current}
            <span className="text-sm font-normal text-gray-500 ml-1">/ {target} points</span>
          </div>
          <div className="text-[13px] text-gray-500 mt-1">{period} Target</div>
          <div className="text-[12.5px] font-medium text-brand-teal mt-2">
            {target - current} points remaining
          </div>
        </div>
      </div>
    </div>
  );
}