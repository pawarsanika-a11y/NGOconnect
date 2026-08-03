import { useState } from "react";
import { LayoutDashboard, MapPin, Sparkles, History, GitCommitVertical, Award, Package, HeartHandshake, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { organizations } from "@/data/organizations";
import { donations, donorProfile, monthlyDonationTrend } from "@/data/donations";
import OrgCard from "@/components/cards/OrgCard";
import StatCard from "@/components/ui/StatCard";
import DonationTimelineItem from "@/components/cards/DonationTimelineItem";
import BadgeChip from "@/components/cards/BadgeChip";
import ProgressBar from "@/components/ui/ProgressBar";
import { cn, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const tabs = [
  { key: "overview", label: "Dashboard", icon: LayoutDashboard },
  { key: "nearby", label: "Nearby Organizations", icon: MapPin },
  { key: "suggested", label: "Suggested", icon: Sparkles },
  { key: "recent", label: "Recent Donations", icon: History },
  { key: "timeline", label: "Timeline", icon: GitCommitVertical },
  { key: "rewards", label: "Rewards", icon: Award },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const levelProgress: Record<string, number> = { Bronze: 20, Silver: 40, Gold: 65, Platinum: 85, Diamond: 100 };

export default function DonorDashboard() {
  const [tab, setTab] = useState<TabKey>("overview");
  const { user } = useAuth();
  const nearby = [...organizations].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 6);
  const suggested = organizations.filter((o) => o.urgent).slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-ink/50 dark:text-paper/50">Here's your giving activity and impact.</p>
      </div>

      <div className="mt-6 flex gap-1 overflow-x-auto rounded-full bg-ink/5 p-1 dark:bg-white/5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition",
              tab === t.key ? "bg-white text-primary shadow-soft dark:bg-ink" : "text-ink/50 dark:text-paper/50"
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "overview" && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Package} label="Total Donations" value={donations.length} accent="primary" />
              <StatCard icon={HeartHandshake} label="Organizations Helped" value={new Set(donations.map((d) => d.orgId)).size} accent="sky" />
              <StatCard icon={Sparkles} label="Impact Score" value={donorProfile.impactScore} accent="accent" />
              <StatCard icon={Award} label="Level" value={donorProfile.level} accent="rose" />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              <div className="manifest-card p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Donations over time</h3>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={monthlyDonationTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,27,30,0.08)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="donations" stroke="#1F7A5C" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="manifest-card p-6">
                <h3 className="text-sm font-semibold">Contribution Level</h3>
                <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">{donorProfile.level} · {donorProfile.impactScore} pts</p>
                <ProgressBar value={levelProgress[donorProfile.level]} className="mt-4" colorClass="bg-accent-500" />
                <div className="mt-4 flex justify-between text-[10px] text-ink/40 dark:text-paper/40">
                  {Object.keys(levelProgress).map((l) => <span key={l}>{l}</span>)}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="font-mono text-xl font-semibold">{donorProfile.badges.length}</p>
                    <p className="text-xs text-ink/50 dark:text-paper/50">Badges Earned</p>
                  </div>
                  <div>
                    <p className="font-mono text-xl font-semibold">{donorProfile.volunteerHours}h</p>
                    <p className="text-xs text-ink/50 dark:text-paper/50">Volunteer Hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "nearby" && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {nearby.map((o) => <OrgCard key={o.id} org={o} />)}
          </div>
        )}

        {tab === "suggested" && (
          <div>
            <p className="mb-4 text-sm text-ink/50 dark:text-paper/50">Based on urgent requirements matching your past donations.</p>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {suggested.map((o) => <OrgCard key={o.id} org={o} />)}
            </div>
          </div>
        )}

        {tab === "recent" && (
          <div className="manifest-card overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-ink/50 dark:border-paper/10 dark:text-paper/50">
                  <th className="p-4 font-medium">Organization</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b border-ink/5 last:border-0 dark:border-paper/5">
                    <td className="p-4 font-medium">{d.orgName}</td>
                    <td className="p-4 text-ink/60 dark:text-paper/60">{formatDate(d.date)}</td>
                    <td className="p-4 text-ink/60 dark:text-paper/60">{d.items.map((i) => `${i.qty} ${i.unit} ${i.name}`).join(", ")}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-semibold dark:bg-white/10">{d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "timeline" && (
          <div className="max-w-2xl">
            {donations.map((d, i) => (
              <DonationTimelineItem key={d.id} donation={d} isLast={i === donations.length - 1} />
            ))}
          </div>
        )}

        {tab === "rewards" && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {donorProfile.badges.map((b) => <BadgeChip key={b.id} badge={b} />)}
            </div>
            <div className="manifest-card p-6">
              <h3 className="text-sm font-semibold">Levels</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {Object.keys(levelProgress).map((l) => (
                  <span
                    key={l}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-semibold",
                      l === donorProfile.level ? "bg-accent text-white" : "bg-ink/5 text-ink/50 dark:bg-white/10 dark:text-paper/50"
                    )}
                  >
                    {l}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-ink/40 dark:text-paper/40">Volunteer hours tracking is coming soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
