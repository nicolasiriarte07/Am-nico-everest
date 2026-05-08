interface ProgressBarProps {
  current: number;
  target: number;
  color?: string;
  height?: string;
}

export default function ProgressBar({ current, target, color = "#3b82f6", height = "h-2" }: ProgressBarProps) {
  const pct = target === 0 ? 0 : Math.min(100, Math.round((current / target) * 100));
  const barColor = pct >= 90 ? "#10b981" : pct >= 60 ? "#3b82f6" : pct >= 30 ? "#f59e0b" : "#ef4444";

  return (
    <div className="w-full">
      <div className={`w-full bg-white/10 rounded-full ${height} overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color ?? barColor }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{pct}%</span>
        <span>{current} / {target}</span>
      </div>
    </div>
  );
}
