import { Requirement } from "@/types";
import ProgressBar from "@/components/ui/ProgressBar";
import { priorityStyles, formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";

const priorityBar: Record<string, string> = {
  CRITICAL: "bg-rose-500",
  HIGH: "bg-accent-500",
  MEDIUM: "bg-sky-500",
  LOW: "bg-primary-500",
};

export default function RequirementCard({ req, onDonate }: { req: Requirement; onDonate?: () => void }) {
  const pct = Math.round((req.availableQty / req.requiredQty) * 100);
  const needed = req.requiredQty - req.availableQty;

  return (
    <div className="manifest-card manifest-stub flex flex-col gap-3 pl-4 pr-4 py-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-ink/40 dark:text-paper/40">{req.category}</p>
          <h4 className="font-display text-base font-semibold">{req.itemName}</h4>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[req.priority]}`}>
          {req.priority}
        </span>
      </div>

      <ProgressBar value={pct} colorClass={priorityBar[req.priority]} />

      <div className="flex items-center justify-between text-xs text-ink/60 dark:text-paper/60">
        <span>
          <span className="font-mono font-semibold text-ink dark:text-paper">{req.availableQty}</span> / {req.requiredQty} {req.unit} fulfilled
        </span>
        <span className={`rounded-full px-2 py-0.5 font-medium ${req.status === "FULFILLED" ? "bg-primary-50 text-primary-700" : "bg-ink/5 text-ink/60 dark:bg-white/10 dark:text-paper/60"}`}>
          {req.status === "FULFILLED" ? "Fulfilled" : `Needs ${needed} more`}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-[11px] text-ink/40 dark:text-paper/40">
          <Clock className="h-3 w-3" /> Updated {formatDate(req.lastUpdated)}
        </span>
        {onDonate && req.status !== "FULFILLED" && (
          <button onClick={onDonate} className="btn-primary !px-3 !py-1.5 text-xs">
            Donate This
          </button>
        )}
      </div>
    </div>
  );
}
