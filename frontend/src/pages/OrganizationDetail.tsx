import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BadgeCheck, Phone, Mail, Globe, MapPin, Users, GraduationCap, Briefcase, BedDouble,
  HeartPulse, Sparkles, Scale3D, Clock3, CheckCircle2, XCircle,
} from "lucide-react";
import { getOrgById, getRequirementsForOrg } from "@/data/organizations";
import { categoryLabels } from "@/lib/utils";
import RequirementCard from "@/components/cards/RequirementCard";
import DonateModal from "@/components/cards/DonateModal";
import MapView from "@/components/ui/MapView";
import ProgressBar from "@/components/ui/ProgressBar";
import StatCard from "@/components/ui/StatCard";
import { Requirement } from "@/types";
import NotFound from "./NotFound";

const donationBuckets = [
  { key: "PENDING", label: "Pending", count: 4, icon: Clock3, color: "text-accent-600 bg-accent-50" },
  { key: "APPROVED", label: "Approved", count: 7, icon: CheckCircle2, color: "text-sky-600 bg-sky-50" },
  { key: "COMPLETED", label: "Completed", count: 28, icon: BadgeCheck, color: "text-primary bg-primary-50" },
  { key: "REJECTED", label: "Rejected", count: 2, icon: XCircle, color: "text-rose-600 bg-rose-50" },
];

export default function OrganizationDetail() {
  const { id } = useParams();
  const org = getOrgById(id ?? "");
  const [activeReq, setActiveReq] = useState<Requirement | null>(null);

  if (!org) return <NotFound />;

  const reqs = getRequirementsForOrg(org.id);

  return (
    <div>
      {/* Cover */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80">
        <img src={org.coverUrl} alt="" className="h-full w-full max-h-full max-w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Basic info */}
        <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <img src={org.logoUrl} alt="" className="h-28 w-28 max-h-full max-w-full rounded-2xl border-4 border-paper object-cover object-center shadow-lift dark:border-ink" />
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-semibold sm:text-3xl">{org.name}</h1>
                {org.verified && (
                  <span className="badge-verified"><BadgeCheck className="h-3 w-3" /> Verified</span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1 text-sm text-ink/50 dark:text-paper/50">
                <MapPin className="h-4 w-4" /> {org.address}, {org.city} · {categoryLabels[org.category]}
              </p>
            </div>
          </div>
          <div className="flex gap-2 pb-1">
            <Link to="/compare" className="btn-secondary"><Scale3D className="h-4 w-4" /> Compare</Link>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${org.lat},${org.lng}`} target="_blank" rel="noreferrer" className="btn-primary">
              Navigate
            </a>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink/70 dark:text-paper/70">{org.about}</p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink/60 dark:text-paper/60">
          <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {org.coordinatorName} (Coordinator)</span>
          <a href={`tel:${org.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="h-4 w-4" /> {org.phone}</a>
          <a href={`mailto:${org.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="h-4 w-4" /> {org.email}</a>
          <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> {org.website}</span>
        </div>

        {/* Statistics */}
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">Statistics</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={GraduationCap} label="Students" value={org.stats.students} accent="primary" />
            <StatCard icon={Users} label="Teachers" value={org.stats.teachers} accent="sky" />
            <StatCard icon={Briefcase} label="Staff" value={org.stats.staff} accent="accent" />
            <StatCard icon={BedDouble} label="Hostel Available" value={org.stats.hostelAvailable ? "Yes" : "No"} accent="rose" />
            <StatCard icon={HeartPulse} label="Current Beneficiaries" value={org.stats.currentBeneficiaries} accent="primary" className="sm:col-span-2" />
            <div className="manifest-card p-5 sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-ink/50 dark:text-paper/50">Services Offered</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {org.stats.servicesOffered.map((s) => (
                  <span key={s} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Live requirements */}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Live Requirements</h2>
            <span className="text-xs text-ink/40 dark:text-paper/40">{reqs.length} active items</span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reqs.map((r) => (
              <RequirementCard key={r.id} req={r} onDonate={() => setActiveReq(r)} />
            ))}
          </div>
        </section>

        {/* Donation status */}
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">Donation Status</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {donationBuckets.map((b) => (
              <div key={b.key} className="manifest-card flex items-center gap-4 p-5">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${b.color}`}>
                  <b.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-mono text-xl font-semibold">{b.count}</p>
                  <p className="text-xs text-ink/50 dark:text-paper/50">{b.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Impact */}
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">Impact</h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="manifest-card p-6">
              <ProgressBar value={org.impact.needsFulfilledPct} label="Current needs fulfilled" colorClass="bg-primary" />
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-mono text-2xl font-semibold">{org.impact.mealsSupported.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-ink/50 dark:text-paper/50">Meals Supported</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-semibold">{org.impact.studentsBenefited}</p>
                  <p className="text-xs text-ink/50 dark:text-paper/50">Students Benefited</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-semibold">{org.impact.totalDonations}</p>
                  <p className="text-xs text-ink/50 dark:text-paper/50">Total Donations</p>
                </div>
              </div>
            </div>
            <MapView lat={org.lat} lng={org.lng} name={org.name} address={`${org.address}, ${org.city}`} />
          </div>
        </section>

        {/* Gallery */}
        <section className="my-12">
          <h2 className="font-display text-xl font-semibold">Gallery</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {org.gallery.map((g, i) => (
              <img key={i} src={g} alt="" className="h-40 w-full max-h-full max-w-full rounded-xl object-cover object-center" />
            ))}
          </div>
        </section>
      </div>

      {activeReq && <DonateModal req={activeReq} onClose={() => setActiveReq(null)} />}
    </div>
  );
}
