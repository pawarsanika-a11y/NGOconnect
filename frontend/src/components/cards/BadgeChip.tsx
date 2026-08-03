import * as Icons from "lucide-react";
import { Badge } from "@/types";
import { formatDate } from "@/lib/utils";

export default function BadgeChip({ badge }: { badge: Badge }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[badge.icon] ?? Icons.Award;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-3 dark:bg-white/5 dark:border-paper/10">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-100 to-accent-400 text-accent-700">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{badge.name}</p>
        <p className="truncate text-xs text-ink/50 dark:text-paper/50">{badge.description}</p>
        <p className="text-[10px] text-ink/35 dark:text-paper/35">Earned {formatDate(badge.earnedOn)}</p>
      </div>
    </div>
  );
}
