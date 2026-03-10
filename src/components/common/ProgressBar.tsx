interface ProgressBarProps {
  value: number;
  height?: string;
  color?: string;
}

export default function ProgressBar({
  value,
  height = "h-1",
  color = "bg-brand-teal",
}: ProgressBarProps) {
  return (
    <div className={`w-full ${height} rounded-full bg-gray-200`}>
      <div
        className={`${height} rounded-full ${color} transition-all duration-400 ease-out`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}