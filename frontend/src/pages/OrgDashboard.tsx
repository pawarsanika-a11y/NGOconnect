import { useState } from "react";
import {
  LayoutDashboard, UserCog, ListChecks, PackageCheck, Award, Settings, Plus, Pencil, Trash2,
  CheckCircle2, XCircle, Clock3, TrendingUp,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { organizations, getRequirementsForOrg } from "@/data/organizations";
import { donations } from "@/data/donations";
import StatCard from "@/components/ui/StatCard";
import ProgressBar from "@/components/ui/ProgressBar";
import { cn, formatDate, priorityStyles } from "@/lib/utils";

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "profile", label: "Profile", icon: UserCog },
  { key: "requirements", label: "Requirements", icon: ListChecks },
  { key: "donations", label: "Donations", icon: PackageCheck },
  { key: "rewards", label: "Rewards Approval", icon: Award },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

type Key = (typeof sidebarItems)[number]["key"];

const requirementChart = [
  { month: "Feb", fulfilled: 6 },
  { month: "Mar", fulfilled: 9 },
  { month: "Apr", fulfilled: 5 },
  { month: "May", fulfilled: 11 },
  { month: "Jun", fulfilled: 14 },
  { month: "Jul", fulfilled: 18 },
];

export default function OrgDashboard() {
  const [active, setActive] = useState<Key>("dashboard");
  const org = organizations[0]; // demo: logged-in org = Asha Vidya
  const reqs = getRequirementsForOrg(org.id);
  const orgDonations = donations.filter((d) => d.orgId === org.id).length ? donations.filter((d) => d.orgId === org.id) : donations.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <img src={org.logoUrl} alt="" className="h-12 w-12 rounded-xl object-cover" />
        <div>
          <h1 className="font-display text-2xl font-semibold">{org.name}</h1>
          <p className="text-sm text-ink/50 dark:text-paper/50">Organization Dashboard</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition lg:w-full",
                active === item.key
                  ? "bg-primary text-white shadow-soft"
                  : "text-ink/60 hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <div>
          {active === "dashboard" && (
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={ListChecks} label="Current Requirements" value={reqs.filter((r) => r.status !== "FULFILLED").length} accent="primary" />
                <StatCard icon={PackageCheck} label="Recent Donations" value={orgDonations.length} accent="sky" />
                <StatCard icon={Clock3} label="Pending Approvals" value={orgDonations.filter((d) => d.status === "PENDING").length} accent="accent" />
                <StatCard icon={TrendingUp} label="Needs Fulfilled" value={`${org.impact.needsFulfilledPct}%`} accent="rose" />
              </div>
              <div className="manifest-card p-6">
                <h3 className="text-sm font-semibold">Requirements fulfilled per month</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={requirementChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,27,30,0.08)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="fulfilled" fill="#1F7A5C" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {active === "profile" && (
            <div className="manifest-card max-w-2xl space-y-4 p-6">
              <h3 className="text-sm font-semibold">Edit Organization Profile</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Organization Name</label>
                  <input defaultValue={org.name} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Coordinator</label>
                  <input defaultValue={org.coordinatorName} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Student Count</label>
                  <input type="number" defaultValue={org.stats.students} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Teacher Count</label>
                  <input type="number" defaultValue={org.stats.teachers} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Staff Count</label>
                  <input type="number" defaultValue={org.stats.staff} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Contact Phone</label>
                  <input defaultValue={org.phone} className="input-field" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">About</label>
                <textarea rows={4} defaultValue={org.about} className="input-field resize-none" />
              </div>
              <button className="btn-primary">Save Changes</button>
            </div>
          )}

          {active === "requirements" && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Live Requirement Management</h3>
                <button className="btn-primary !py-2 text-xs"><Plus className="h-3.5 w-3.5" /> Add Requirement</button>
              </div>
              <div className="manifest-card overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead>
                    <tr className="border-b border-ink/10 text-left text-ink/50 dark:border-paper/10 dark:text-paper/50">
                      <th className="p-4 font-medium">Item</th>
                      <th className="p-4 font-medium">Progress</th>
                      <th className="p-4 font-medium">Priority</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reqs.map((r) => (
                      <tr key={r.id} className="border-b border-ink/5 last:border-0 dark:border-paper/5">
                        <td className="p-4 font-medium">{r.itemName}</td>
                        <td className="w-48 p-4">
                          <ProgressBar value={Math.round((r.availableQty / r.requiredQty) * 100)} colorClass="bg-primary" />
                        </td>
                        <td className="p-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[r.priority]}`}>{r.priority}</span>
                        </td>
                        <td className="p-4 text-ink/60 dark:text-paper/60">{r.status}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button aria-label="Edit" className="rounded-lg p-2 hover:bg-ink/5 dark:hover:bg-white/10"><Pencil className="h-4 w-4" /></button>
                            <button aria-label="Delete" className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(active === "donations" || active === "rewards") && (
            <div>
              <h3 className="mb-4 text-sm font-semibold">{active === "donations" ? "Incoming Donations" : "Approve Donations & Unlock Rewards"}</h3>
              <div className="space-y-3">
                {orgDonations.map((d) => (
                  <div key={d.id} className="manifest-card flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <p className="text-sm font-semibold">{d.donorName}</p>
                      <p className="text-xs text-ink/50 dark:text-paper/50">
                        {d.items.map((i) => `${i.qty} ${i.unit} ${i.name}`).join(", ")} · {formatDate(d.date)}
                      </p>
                    </div>
                    {d.status === "PENDING" ? (
                      <div className="flex gap-2">
                        <button className="btn-primary !py-1.5 text-xs"><CheckCircle2 className="h-3.5 w-3.5" /> Approve</button>
                        <button className="btn-secondary !py-1.5 text-xs text-rose-600"><XCircle className="h-3.5 w-3.5" /> Reject</button>
                      </div>
                    ) : (
                      <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold dark:bg-white/10">{d.status}</span>
                    )}
                  </div>
                ))}
              </div>
              {active === "rewards" && (
                <p className="mt-4 text-xs text-ink/40 dark:text-paper/40">
                  Approving a donation automatically updates the donor's timeline, unlocks eligible badges, generates
                  a certificate, and recalculates their impact score.
                </p>
              )}
            </div>
          )}

          {active === "settings" && (
            <div className="manifest-card max-w-lg space-y-4 p-6">
              <h3 className="text-sm font-semibold">Account Settings</h3>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Notification Email</label>
                <input defaultValue={org.email} className="input-field" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Change Password</label>
                <input type="password" placeholder="New password" className="input-field" />
              </div>
              <button className="btn-primary">Update Settings</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
