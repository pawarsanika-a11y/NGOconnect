import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, School, Landmark, HomeIcon, PawPrint, ArrowRight, Users, Package, MapPinned, Sparkles } from "lucide-react";
import { organizations } from "@/data/organizations";
import OrgCard from "@/components/cards/OrgCard";
import { OrgCategory } from "@/types";

const categories: { key: OrgCategory; label: string; icon: typeof School; blurb: string }[] = [
  { key: "NGO", label: "NGOs for Impaired Students", icon: School, blurb: "Braille, sign-language & inclusive education" },
  { key: "GOVERNMENT", label: "Government Institutions", icon: Landmark, blurb: "State-run schools & rehabilitation centres" },
  { key: "OLD_AGE_HOME", label: "Old Age Homes", icon: HomeIcon, blurb: "Shelter, care & companionship for elders" },
  { key: "ANIMAL_SHELTER", label: "Animal Shelters / Gaushalas", icon: PawPrint, blurb: "Fodder, rescue & veterinary support" },
];

const stats = [
  { icon: Users, label: "Beneficiaries Supported", value: "2,300+" },
  { icon: Package, label: "Requirements Fulfilled", value: "1,240" },
  { icon: MapPinned, label: "Organizations Onboarded", value: "86" },
  { icon: Sparkles, label: "Donor Impact Score Given", value: "58,900" },
];

const testimonials = [
  { name: "Priya Sharma", role: "Donor · Gold Level", quote: "I could see exactly that Asha Vidya needed Braille slates, not just money — I sent 15 and got a certificate the same week." },
  { name: "Mrs. Sunita Deshmukh", role: "Coordinator, Asha Vidya School", quote: "The live requirement list means donors bring precisely what our 180 students need, when they need it." },
  { name: "Arjun Kulkarni", role: "Donor · Platinum Level", quote: "The comparison table helped me choose which shelter needed fodder most urgently before winter." },
];

export default function Landing() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const featured = organizations.slice(0, 3);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-900 text-paper">
        <div className="absolute inset-0 bg-grain" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary-600/40 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <p className="eyebrow text-primary-200">Need-based giving, not fundraising</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Give the <span className="italic text-accent-300">exact</span> thing that's needed today.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-primary-100/90">
            NGOConnect turns donation into a supply manifest — see live, itemized requirements from schools for
            impaired students, government institutions, old age homes and gaushalas, and fulfil them directly.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-lift">
            <SearchIcon className="h-5 w-5 shrink-0 text-ink/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by organization, city, or item needed..."
              className="w-full bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink/40"
            />
            <button type="submit" className="btn-primary shrink-0">
              Search
            </button>
          </form>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-primary-100/80">
            {stats.slice(0, 2).map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <s.icon className="h-4 w-4 text-accent-300" />
                <span className="font-mono font-semibold text-paper">{s.value}</span> {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Who you're supporting</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Organization Categories</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => navigate(`/search?category=${c.key}`)}
              className="manifest-card group flex flex-col items-start gap-3 p-6 text-left transition hover:shadow-lift hover:-translate-y-0.5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition group-hover:bg-primary group-hover:text-white dark:bg-primary-900/40 dark:text-primary-200">
                <c.icon className="h-6 w-6" />
              </span>
              <h3 className="font-display text-base font-semibold">{c.label}</h3>
              <p className="text-sm text-ink/50 dark:text-paper/50">{c.blurb}</p>
              <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-primary-600">
                Browse <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured organizations */}
      <section className="bg-surface py-16 dark:bg-ink/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Right now</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">Organizations with urgent needs</h2>
            </div>
            <button onClick={() => navigate("/search")} className="btn-secondary hidden sm:inline-flex">
              View all <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((org) => (
              <OrgCard key={org.id} org={org} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="manifest-card flex flex-col items-start gap-3 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <s.icon className="h-5 w-5" />
              </span>
              <p className="font-mono text-2xl font-semibold">{s.value}</p>
              <p className="text-sm text-ink/50 dark:text-paper/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary-900 py-16 text-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-primary-200">Voices from the network</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Testimonials</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl bg-white/5 p-6 backdrop-blur">
                <p className="font-display text-lg leading-relaxed text-primary-50">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-primary-200">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
