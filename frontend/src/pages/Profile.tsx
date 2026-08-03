import { useState } from "react";
import { Camera, Mail, Phone, Award, Sparkles } from "lucide-react";
import { donorProfile } from "@/data/donations";
import BadgeChip from "@/components/cards/BadgeChip";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? donorProfile.name);
  const [email, setEmail] = useState(user?.email ?? donorProfile.email);
  const [phone, setPhone] = useState(donorProfile.phone);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold">Profile</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="manifest-card flex flex-col items-center p-6 text-center">
          <div className="relative">
            <img src={donorProfile.avatarUrl} alt="" className="h-24 w-24 rounded-full object-cover" />
            <button aria-label="Change photo" className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-soft">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <h3 className="mt-3 font-display text-lg font-semibold">{name}</h3>
          <span className="mt-1 flex items-center gap-1 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-600">
            <Award className="h-3 w-3" /> {donorProfile.level} Donor
          </span>
          <div className="mt-4 flex items-center gap-1 text-sm text-ink/60 dark:text-paper/60">
            <Sparkles className="h-4 w-4 text-primary" /> {donorProfile.impactScore} Impact Score
          </div>
        </div>

        <div className="space-y-8">
          <div className="manifest-card space-y-4 p-6">
            <h3 className="text-sm font-semibold">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Full Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Phone</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field pl-10" />
                </div>
              </div>
            </div>
            <button className="btn-primary">Save Changes</button>
          </div>

          <div className="manifest-card space-y-4 p-6">
            <h3 className="text-sm font-semibold">Change Password</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="password" placeholder="Current password" className="input-field" />
              <input type="password" placeholder="New password" className="input-field" />
            </div>
            <button className="btn-secondary">Update Password</button>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Your Badges</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {donorProfile.badges.map((b) => <BadgeChip key={b.id} badge={b} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
