import { Link } from "react-router-dom";
import { BadgeCheck, MapPin, Navigation2, ShieldAlert } from "lucide-react";
import { Organization } from "@/types";
import { categoryLabels } from "@/lib/utils";
import { getRequirementsForOrg } from "@/data/organizations";

export default function OrgCard({ org }: { org: Organization }) {
  const topNeed = getRequirementsForOrg(org.id).sort((a, b) =>
    a.priority === b.priority ? 0 : a.priority === "CRITICAL" ? -1 : 1
  )[0];

  return (
    <div className="manifest-card manifest-stub group flex flex-col overflow-hidden pl-1 transition hover:shadow-lift">
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={org.coverUrl}
          alt=""
          className="h-full w-full max-h-full max-w-full object-cover object-center transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink shadow-soft">
          {categoryLabels[org.category]}
        </span>
        {org.urgent && (
          <span className="badge-urgent absolute right-3 top-3 shadow-soft">
            <ShieldAlert className="h-3 w-3" /> Urgent
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug">{org.name}</h3>
          {org.verified && (
            <span className="badge-verified shrink-0">
              <BadgeCheck className="h-3 w-3" /> Verified
            </span>
          )}
        </div>

        <p className="mt-1 flex items-center gap-1 text-xs text-ink/50 dark:text-paper/50">
          <MapPin className="h-3 w-3" /> {org.city} · {org.distanceKm} km away
        </p>

        {topNeed && (
          <div className="mt-3 rounded-lg bg-ink/[0.03] px-3 py-2 text-xs dark:bg-white/5">
            <span className="font-medium text-ink/70 dark:text-paper/70">Priority need: </span>
            <span className="font-semibold">{topNeed.itemName}</span>
            <span className="text-ink/50 dark:text-paper/50"> · needs {topNeed.requiredQty - topNeed.availableQty} {topNeed.unit}</span>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Link to={`/organizations/${org.id}`} className="btn-secondary flex-1 !py-2 text-xs">
            View Details
          </Link>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${org.lat},${org.lng}`}
            target="_blank"
            rel="noreferrer"
            className="btn-primary !py-2 text-xs"
            aria-label={`Navigate to ${org.name}`}
          >
            <Navigation2 className="h-3.5 w-3.5" /> Navigate
          </a>
        </div>
      </div>
    </div>
  );
}
