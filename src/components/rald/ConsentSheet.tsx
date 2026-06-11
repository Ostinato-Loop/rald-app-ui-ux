import { useEffect, useState } from "react";
import { Shield, X, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const KEY = "rald.consent";
const ESSENTIALS = [
  "Authentication",
  "Account Security",
  "Fraud Prevention",
  "Device Protection",
];

export function ConsentSheet() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const seen = window.localStorage.getItem(KEY);
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    window.localStorage.setItem(KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Privacy notice"
      className="fixed inset-0 z-50 flex items-end justify-center bg-[oklch(0.2_0.02_150_/_0.35)] px-4 pb-4 backdrop-blur-[2px]"
    >
      <div className="animate-sheet-up relative w-full max-w-[440px] rounded-2xl bg-surface p-6 shadow-[var(--shadow-rald)]">
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-border"
        >
          <X size={18} />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-green-soft">
            <Shield size={22} className="text-green" />
          </div>
          <div className="min-w-0">
            <p className="text-base font-extrabold leading-tight">
              Your Privacy &amp; Trust
            </p>
            <p className="text-xs text-muted-foreground">
              Built in Africa · Works on any network
            </p>
          </div>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          RALD uses essential technologies to keep you signed in, protect your
          account, secure your devices, and improve reliability.{" "}
          <strong className="font-bold text-foreground">
            We never sell your personal information.
          </strong>
        </p>

        <div className="mb-5 grid grid-cols-2 gap-y-2.5 gap-x-3">
          {ESSENTIALS.map((e) => (
            <div key={e} className="flex items-center gap-2 text-sm font-medium">
              <CircleCheck size={14} className="shrink-0 text-green" />
              <span>{e}</span>
            </div>
          ))}
        </div>

        {expanded && (
          <p className="mb-5 rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
            These essentials cannot be turned off — they keep your RALD identity
            safe across Loop, Messenger, PayRald, RALD Mail and every future
            product. Everything else is optional and always in your control from
            <span className="font-semibold text-foreground"> My Account</span>.
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={dismiss}
            className={cn(
              "flex h-14 flex-[2] items-center justify-center rounded-2xl text-base font-bold text-white",
              "bg-green shadow-[0_4px_16px_oklch(0.52_0.15_150_/_0.3)] transition-transform active:scale-[0.98]",
            )}
          >
            Continue
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-border text-base font-bold text-foreground transition-transform active:scale-[0.98]"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
