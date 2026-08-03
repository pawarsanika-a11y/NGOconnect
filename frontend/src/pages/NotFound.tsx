import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary dark:bg-primary-900/40">
        <Compass className="h-8 w-8" />
      </span>
      <h1 className="mt-6 font-display text-4xl font-semibold">404</h1>
      <p className="mt-2 text-sm text-ink/50 dark:text-paper/50">
        This page doesn't exist — but there are organizations nearby that could use your help.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/" className="btn-secondary">Go Home</Link>
        <Link to="/search" className="btn-primary">Find Organizations</Link>
      </div>
    </div>
  );
}
