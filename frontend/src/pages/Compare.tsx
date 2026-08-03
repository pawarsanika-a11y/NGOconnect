import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { BadgeCheck, X } from "lucide-react";
import { organizations, getRequirementsForOrg } from "@/data/organizations";
import { categoryLabels, cn } from "@/lib/utils";

const rows: { label: string; key: string }[] = [
  { label: "Students", key: "students" },
  { label: "Teachers", key: "teachers" },
  { label: "Staff", key: "staff" },
  { label: "Pending Requirements", key: "pending" },
  { label: "Current Requirements", key: "current" },
  { label: "Donations Received", key: "donations" },
  { label: "Distance", key: "distance" },
  { label: "Verification", key: "verified" },
  { label: "Urgency Level", key: "urgency" },
];

export default function Compare() {
  const [selectedIds, setSelectedIds] = useState<string[]>([organizations[0].id, organizations[1].id]);

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  }

  const selected = organizations.filter((o) => selectedIds.includes(o.id));

  const chartData = selected.map((o) => ({
    name: o.name.split(" ").slice(0, 2).join(" "),
    Students: o.stats.students,
    Donations: o.impact.totalDonations,
    "Needs Fulfilled %": o.impact.needsFulfilledPct,
  }));

  function cellValue(org: (typeof organizations)[number], key: string) {
    const reqs = getRequirementsForOrg(org.id);
    switch (key) {
      case "students": return org.stats.students;
      case "teachers": return org.stats.teachers;
      case "staff": return org.stats.staff;
      case "pending": return reqs.filter((r) => r.status !== "FULFILLED").length;
      case "current": return reqs.length;
      case "donations": return org.impact.totalDonations;
      case "distance": return `${org.distanceKm} km`;
      case "verified": return org.verified ? "Verified" : "Unverified";
      case "urgency": return org.urgent ? "High" : "Normal";
      default: return "-";
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold">Compare Organizations</h1>
      <p className="mt-1 text-sm text-ink/50 dark:text-paper/50">Select up to 4 organizations to compare side by side.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {organizations.map((o) => (
          <button
            key={o.id}
            onClick={() => toggle(o.id)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
              selectedIds.includes(o.id)
                ? "border-primary bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200"
                : "border-ink/10 hover:border-primary/40 dark:border-paper/10"
            )}
          >
            {o.name}
            {selectedIds.includes(o.id) && <X className="h-3.5 w-3.5" />}
          </button>
        ))}
      </div>

      {selected.length === 0 ? (
        <div className="manifest-card mt-8 p-10 text-center text-sm text-ink/50 dark:text-paper/50">
          Select at least one organization above to see the comparison.
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="manifest-card mt-8 overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-ink/10 dark:border-paper/10">
                  <th className="p-4 text-left font-semibold text-ink/50 dark:text-paper/50">Metric</th>
                  {selected.map((o) => (
                    <th key={o.id} className="p-4 text-left">
                      <div className="flex items-center gap-2">
                        <img src={o.logoUrl} alt="" className="h-8 w-8 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold">{o.name}</p>
                          <p className="text-xs font-normal text-ink/40 dark:text-paper/40">{categoryLabels[o.category]}</p>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.key} className="border-b border-ink/5 last:border-0 dark:border-paper/5">
                    <td className="p-4 font-medium text-ink/60 dark:text-paper/60">{row.label}</td>
                    {selected.map((o) => (
                      <td key={o.id} className="p-4">
                        {row.key === "verified" && o.verified ? (
                          <span className="badge-verified"><BadgeCheck className="h-3 w-3" /> Verified</span>
                        ) : row.key === "urgency" && o.urgent ? (
                          <span className="badge-urgent">High</span>
                        ) : (
                          <span className="font-mono">{cellValue(o, row.key)}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="manifest-card p-6">
              <h3 className="mb-4 text-sm font-semibold">Students vs Donations Received</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,27,30,0.08)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Students" fill="#1F7A5C" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Donations" fill="#E8A33D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="manifest-card p-6">
              <h3 className="mb-4 text-sm font-semibold">Needs Fulfilled %</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,27,30,0.08)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="Needs Fulfilled %" fill="#3B7EA1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
