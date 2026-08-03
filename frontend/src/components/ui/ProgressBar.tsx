import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  colorClass?: string;
  label?: string;
  className?: string;
}

export default function ProgressBar({ value, colorClass = "bg-primary", label, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-ink/60 dark:text-paper/60">
          <span>{label}</span>
          <span className="font-mono">{clamped}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-ink/[0.07] dark:bg-white/10">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colorClass)}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
