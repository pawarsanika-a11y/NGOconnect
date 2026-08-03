import { Link } from "react-router-dom";
import { HeartHandshake, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-surface dark:bg-ink/60 dark:border-paper/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <HeartHandshake className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold">NGOConnect</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink/60 dark:text-paper/60">
            Matching real, itemized needs with donors who can meet them — no cash, just what's actually required.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/60 dark:text-paper/60">
            <li><Link to="/search" className="hover:text-primary">Find Organizations</Link></li>
            <li><Link to="/compare" className="hover:text-primary">Compare NGOs</Link></li>
            <li><Link to="/register" className="hover:text-primary">Register as Donor</Link></li>
            <li><Link to="/register" className="hover:text-primary">Register your Organization</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Categories</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/60 dark:text-paper/60">
            <li>NGOs for Impaired Students</li>
            <li>Government Institutions</li>
            <li>Old Age Homes</li>
            <li>Animal Shelters / Gaushalas</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-ink/60 dark:text-paper/60">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@ngoconnect.org</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 88888 00000</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Pune, Maharashtra, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10 py-5 text-center text-xs text-ink/40 dark:border-paper/10 dark:text-paper/40">
        © {new Date().getFullYear()} NGOConnect. Built for need-based giving, not fundraising.
      </div>
    </footer>
  );
}
