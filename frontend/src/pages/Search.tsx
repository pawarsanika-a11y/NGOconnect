import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal, MapPin, ShieldCheck, ShieldAlert, X } from "lucide-react";
import { organizations } from "@/data/organizations";
import OrgCard from "@/components/cards/OrgCard";
import { OrgCategory } from "@/types";
import { categoryLabels, cn } from "@/lib/utils";

type SortKey = "nearest" | "mostNeeded" | "mostStudents" | "mostRecent";

const categoryOptions: { key: OrgCategory | "ALL"; label: string }[] = [
  { key: "ALL", label: "All Categories" },
  { key: "NGO", label: "NGO" },
  { key: "GOVERNMENT", label: "Government Institution" },
  { key: "OLD_AGE_HOME", label: "Old Age Home" },
  { key: "ANIMAL_SHELTER", label: "Animal Shelter" },
];

export default function SearchPage() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<OrgCategory | "ALL">((params.get("category") as OrgCategory) ?? "ALL");
  const [maxDistance, setMaxDistance] = useState(25);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("nearest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = organizations.filter((o) => {
      const matchesQuery =
        !query ||
        o.name.toLowerCase().includes(query.toLowerCase()) ||
        o.city.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "ALL" || o.category === category;
      const matchesDistance = o.distanceKm <= maxDistance;
      const matchesVerified = !verifiedOnly || o.verified;
      const matchesUrgent = !urgentOnly || o.urgent;
      return matchesQuery && matchesCategory && matchesDistance && matchesVerified && matchesUrgent;
    });

    switch (sort) {
      case "nearest":
        list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
        break;
      case "mostNeeded":
        list = [...list].sort((a, b) => a.impact.needsFulfilledPct - b.impact.needsFulfilledPct);
        break;
      case "mostStudents":
        list = [...list].sort((a, b) => b.stats.students - a.stats.students);
        break;
      case "mostRecent":
        list = [...list].sort((a, b) => b.id.localeCompare(a.id));
        break;
    }
    return list;
  }, [query, category, maxDistance, verifiedOnly, urgentOnly, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Find Organizations</h1>
          <p className="mt-1 text-sm text-ink/50 dark:text-paper/50">{filtered.length} organizations match your filters</p>
        </div>
        <button onClick={() => setFiltersOpen((o) => !o)} className="btn-secondary lg:hidden">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 shadow-soft dark:bg-white/5 dark:border-paper/10">
        <SearchIcon className="h-4 w-4 text-ink/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, location, or item..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear search">
            <X className="h-4 w-4 text-ink/40" />
          </button>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters sidebar */}
        <aside className={cn("space-y-6", !filtersOpen && "hidden lg:block")}>
          <div className="manifest-card p-5">
            <h3 className="text-sm font-semibold">Category</h3>
            <div className="mt-3 flex flex-col gap-1">
              {categoryOptions.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-left text-sm transition",
                    category === c.key ? "bg-primary-50 font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-200" : "hover:bg-ink/5 dark:hover:bg-white/5"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="manifest-card p-5">
            <h3 className="text-sm font-semibold">Distance</h3>
            <div className="mt-3">
              <input
                type="range"
                min={1}
                max={30}
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <p className="mt-1 flex items-center gap-1 text-xs text-ink/50 dark:text-paper/50">
                <MapPin className="h-3 w-3" /> Within {maxDistance} km
              </p>
            </div>
          </div>

          <div className="manifest-card space-y-3 p-5">
            <h3 className="text-sm font-semibold">Filters</h3>
            <label className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Verified only</span>
              <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="h-4 w-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-rose-500" /> Urgent requirements</span>
              <input type="checkbox" checked={urgentOnly} onChange={(e) => setUrgentOnly(e.target.checked)} className="h-4 w-4 accent-primary" />
            </label>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-4 flex items-center justify-end gap-2">
            <label className="text-xs font-medium text-ink/50 dark:text-paper/50">Sort by</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-sm dark:bg-white/5 dark:border-paper/10"
            >
              <option value="nearest">Nearest</option>
              <option value="mostNeeded">Most Needed</option>
              <option value="mostStudents">Most Students</option>
              <option value="mostRecent">Most Recent</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="manifest-card p-10 text-center text-sm text-ink/50 dark:text-paper/50">
              No organizations match these filters yet — try widening your distance or clearing a filter.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((org) => (
                <OrgCard key={org.id} org={org} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
