import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
          <KeyRound className="h-6 w-6" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold">Reset your password</h1>
        <p className="mt-1 text-sm text-ink/50 dark:text-paper/50">
          Enter your email and we'll send a link to reset it.
        </p>
      </div>

      {sent ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-primary-50 p-6 text-center dark:bg-primary-900/30">
          <CheckCircle2 className="h-8 w-8 text-primary" />
          <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
            If an account exists for {email}, a reset link has been sent.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
          <button type="submit" className="btn-primary w-full justify-center">
            Send reset link
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink/50 dark:text-paper/50">
        Remembered it?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
