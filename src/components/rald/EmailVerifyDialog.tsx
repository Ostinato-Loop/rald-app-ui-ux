import { useEffect, useMemo, useRef, useState } from "react";
import { MailCheck, ShieldCheck, X } from "lucide-react";
import { saveIdentity, useIdentity } from "@/lib/identity";
import { cn } from "@/lib/utils";

/**
 * Custom RALD email verification flow (no third-party auth).
 * Generates a 6-digit code, "sends" it, and verifies it locally.
 */
export function EmailVerifyDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [identity] = useIdentity();
  const [code, setCode] = useState("");
  const [entry, setEntry] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // freshly generate a code each time the dialog opens
  useEffect(() => {
    if (open) {
      const next = String(Math.floor(100000 + Math.random() * 900000));
      setCode(next);
      setEntry("");
      setDone(false);
      setError("");
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  const masked = useMemo(() => {
    const e = identity?.email ?? "";
    const [name, domain] = e.split("@");
    if (!domain) return e;
    return `${name.slice(0, 2)}•••@${domain}`;
  }, [identity?.email]);

  if (!open || !identity) return null;

  function verify() {
    if (entry === code) {
      saveIdentity({ ...identity!, emailVerified: true });
      setDone(true);
      setTimeout(onClose, 1400);
    } else {
      setError("That code doesn't match. Check the demo code above.");
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />
      <div className="animate-sheet-up relative z-10 w-full max-w-[420px] rounded-t-3xl border border-border bg-surface p-6 shadow-[var(--shadow-rald)] sm:rounded-3xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
        >
          <X size={18} />
        </button>

        {done ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-green text-white">
              <ShieldCheck size={30} />
            </div>
            <h2 className="mt-4 text-xl font-extrabold">Email verified</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your RALD identity is more secure now.
            </p>
          </div>
        ) : (
          <>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-green-soft text-green">
              <MailCheck size={26} />
            </div>
            <h2 className="mt-4 text-xl font-extrabold">Verify your email</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-foreground">{masked}</span>.
            </p>

            {/* demo helper — there is no real mail server in this prototype */}
            <div className="mt-4 rounded-xl border border-dashed border-green/40 bg-green-soft/40 px-4 py-3 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
                Demo code
              </p>
              <p className="mt-0.5 text-2xl font-extrabold tracking-[0.3em] text-green">
                {code}
              </p>
            </div>

            <input
              ref={inputRef}
              value={entry}
              onChange={(e) => {
                setEntry(e.target.value.replace(/\D/g, "").slice(0, 6));
                setError("");
              }}
              inputMode="numeric"
              placeholder="Enter code"
              className={cn(
                "mt-4 h-14 w-full rounded-2xl border-[1.5px] bg-surface px-4 text-center text-lg font-bold tracking-[0.3em] outline-none transition-colors",
                error ? "border-red" : "border-border focus:border-green",
              )}
            />
            {error && <p className="mt-2 text-xs text-red">{error}</p>}

            <button
              onClick={verify}
              disabled={entry.length !== 6}
              className={cn(
                "mt-5 flex h-14 w-full items-center justify-center rounded-2xl text-base font-bold transition-all active:scale-[0.98]",
                entry.length === 6
                  ? "bg-green text-white shadow-[0_4px_16px_oklch(0.52_0.15_150_/_0.3)]"
                  : "cursor-not-allowed bg-muted text-muted-foreground",
              )}
            >
              Verify email
            </button>
          </>
        )}
      </div>
    </div>
  );
}
