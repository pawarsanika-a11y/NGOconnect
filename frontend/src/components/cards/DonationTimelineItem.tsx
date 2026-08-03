import { CheckCircle2, Clock3, XCircle, FileBadge2, Award } from "lucide-react";
import { Donation } from "@/types";
import { formatDate } from "@/lib/utils";

const statusMeta: Record<Donation["status"], { icon: typeof CheckCircle2; color: string; label: string }> = {
  COMPLETED: { icon: CheckCircle2, color: "text-primary bg-primary-50", label: "Completed" },
  APPROVED: { icon: CheckCircle2, color: "text-sky-600 bg-sky-50", label: "Approved" },
  PENDING: { icon: Clock3, color: "text-accent-600 bg-accent-50", label: "Pending" },
  REJECTED: { icon: XCircle, color: "text-rose-600 bg-rose-50", label: "Rejected" },
};

export default function DonationTimelineItem({ donation, isLast }: { donation: Donation; isLast?: boolean }) {
  const meta = statusMeta[donation.status];
  const Icon = meta.icon;

  return (
    <div className="relative flex gap-4 pb-8">
      {!isLast && <span className="absolute left-[19px] top-10 h-full w-px bg-ink/10 dark:bg-paper/10" />}
      <span className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.color}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="manifest-card flex-1 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-display text-sm font-semibold">{donation.orgName}</h4>
          <span className="text-xs text-ink/40 dark:text-paper/40">{formatDate(donation.date)}</span>
        </div>
        <p className="mt-1 text-xs text-ink/60 dark:text-paper/60">
          {donation.items.map((i) => `${i.qty} ${i.unit} ${i.name}`).join(", ")}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-full px-2.5 py-1 font-semibold ${meta.color}`}>{meta.label}</span>
          {donation.approvedBy && (
            <span className="text-ink/40 dark:text-paper/40">Approved by {donation.approvedBy}</span>
          )}
          {donation.certificateAvailable && (
            <span className="flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
              <FileBadge2 className="h-3 w-3" /> Certificate ready
            </span>
          )}
          {donation.badgeEarned && (
            <span className="flex items-center gap-1 rounded-full bg-accent-50 px-2.5 py-1 font-semibold text-accent-600">
              <Award className="h-3 w-3" /> {donation.badgeEarned}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
