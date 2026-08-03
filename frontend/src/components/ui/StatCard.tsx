import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  accent?: "primary" | "accent" | "sky" | "rose";
  className?: string;
}

const accentMap = {
  primary: "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200",
  accent: "bg-accent-50 text-accent-600",
  sky: "bg-sky-50 text-sky-600",
  rose: "bg-rose-50 text-rose-600",
};

export default function StatCard({ icon: Icon, label, value, hint, accent = "primary", className }: StatCardProps) {
  return (
    <div className={cn("manifest-card p-5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink/50 dark:text-paper/50">{label}</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-ink dark:text-paper">{value}</p>
          {hint && <p className="mt-1 text-xs text-ink/40 dark:text-paper/40">{hint}</p>}
        </div>
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
