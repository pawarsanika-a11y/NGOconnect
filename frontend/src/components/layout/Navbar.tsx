import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HeartHandshake, Menu, X, Moon, Sun, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const links = [
  { to: "/search", label: "Find Organizations" },
  { to: "/compare", label: "Compare" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <HeartHandshake className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">NGOConnect</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-ink/70 transition hover:bg-ink/5 dark:text-paper/70 dark:hover:bg-white/5",
                  isActive && "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            aria-label="Toggle dark mode"
            onClick={toggle}
            className="rounded-full p-2 text-ink/60 transition hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-white/10"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(user.role === "ORGANIZATION" ? "/org-dashboard" : "/dashboard")}
                className="btn-ghost"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </button>
              <button onClick={() => { logout(); navigate("/"); }} className="btn-ghost">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-paper px-4 py-4 dark:bg-ink md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink/5 dark:hover:bg-white/5"
              >
                {l.label}
              </NavLink>
            ))}
            <button onClick={toggle} className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-ink/5 dark:hover:bg-white/5">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Toggle theme
            </button>
            <hr className="my-2 border-ink/10" />
            {user ? (
              <>
                <Link to={user.role === "ORGANIZATION" ? "/org-dashboard" : "/dashboard"} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink/5 dark:hover:bg-white/5">Dashboard</Link>
                <button onClick={() => { logout(); setOpen(false); navigate("/"); }} className="rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-ink/5 dark:hover:bg-white/5">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-ink/5 dark:hover:bg-white/5">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary mt-1 justify-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
