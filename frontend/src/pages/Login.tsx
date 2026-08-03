import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, HeartHandshake, Building2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types";
import { cn } from "@/lib/utils";

export default function Login() {
  const [role, setRole] = useState<Role>("DONOR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await login(email || "donor@example.com", password, role);
    setLoading(false);
    navigate(role === "ORGANIZATION" ? "/org-dashboard" : "/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
          <HeartHandshake className="h-6 w-6" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-ink/50 dark:text-paper/50">Log in to continue giving what's needed.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2 rounded-full bg-ink/5 p-1 dark:bg-white/5">
        {(["DONOR", "ORGANIZATION"] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold transition",
              role === r ? "bg-white shadow-soft text-primary dark:bg-ink" : "text-ink/50 dark:text-paper/50"
            )}
          >
            {r === "DONOR" ? <HeartHandshake className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
            {r === "DONOR" ? "Donor" : "Organization"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field pl-10"
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-xs font-medium text-ink/60 dark:text-paper/60">Password</label>
            <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
            <input
              type={showPw ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60"
              aria-label="Toggle password visibility"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? "Signing in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/50 dark:text-paper/50">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
