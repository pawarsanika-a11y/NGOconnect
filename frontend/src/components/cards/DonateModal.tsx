import { useState } from "react";
import { X, PackageCheck } from "lucide-react";
import { Requirement } from "@/types";

export default function DonateModal({ req, onClose }: { req: Requirement; onClose: () => void }) {
  const [qty, setQty] = useState(Math.min(5, req.requiredQty - req.availableQty));
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lift dark:bg-ink">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-lg font-semibold">Donate: {req.itemName}</h3>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 text-ink/40" /></button>
        </div>

        {submitted ? (
          <div className="mt-6 flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary dark:bg-primary-900/40">
              <PackageCheck className="h-7 w-7" />
            </span>
            <p className="text-sm font-medium">
              Pledge for {qty} {req.unit} of {req.itemName} submitted — the organization will approve it and you'll
              see it in your donation timeline.
            </p>
            <button onClick={onClose} className="btn-primary mt-2">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">
                Quantity ({req.unit})
              </label>
              <input
                type="number"
                min={1}
                max={req.requiredQty - req.availableQty}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="input-field"
                required
              />
              <p className="mt-1 text-xs text-ink/40 dark:text-paper/40">
                Up to {req.requiredQty - req.availableQty} {req.unit} still needed.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/60 dark:text-paper/60">Drop-off or pickup note (optional)</label>
              <textarea rows={3} className="input-field resize-none" placeholder="e.g. Available for pickup after 5 PM" />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">Confirm Pledge</button>
          </form>
        )}
      </div>
    </div>
  );
}
