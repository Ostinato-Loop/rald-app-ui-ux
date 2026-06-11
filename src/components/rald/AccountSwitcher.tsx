import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronDown, LogOut, Plus, Trash2 } from "lucide-react";
import { RaldAvatar } from "./RaldAvatar";
import {
  clearIdentity,
  removeAccount,
  switchAccount,
  useAccounts,
  useIdentity,
} from "@/lib/identity";
import { getStoredToken, revokeSession, clearStoredToken, getAuthUrl } from "@/lib/auth";
import { cn } from "@/lib/utils";

/** Compact account switcher used in the welcome + account headers. */
export function AccountSwitcher() {
  const navigate = useNavigate();
  const [identity] = useIdentity();
  const accounts = useAccounts();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!identity) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-2.5 transition-colors hover:border-green/40"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <RaldAvatar identity={identity} size={30} />
        <span className="max-w-[96px] truncate text-xs font-bold">
          @{identity.username}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-sheet-up absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-[var(--shadow-rald)]"
        >
          <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
            RALD accounts
          </p>
          {accounts.map((acc) => {
            const active = acc.username === identity.username;
            return (
              <div
                key={acc.username}
                className="group flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted"
              >
                <button
                  onClick={() => {
                    if (!active) switchAccount(acc.username);
                    setOpen(false);
                  }}
                  className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                >
                  <RaldAvatar identity={acc} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {acc.displayName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      @{acc.username}
                    </p>
                  </div>
                  {active && <Check size={16} className="shrink-0 text-green" />}
                </button>
                {!active && (
                  <button
                    onClick={() => removeAccount(acc.username)}
                    aria-label={`Remove @${acc.username}`}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-red-soft hover:text-red group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })}

          <div className="my-1 h-px bg-border" />

          <button
            onClick={() => {
              setOpen(false);
              void (async () => {
              const tok = getStoredToken();
              if (tok) await revokeSession(tok);
              clearStoredToken();
              clearIdentity();
              window.location.href = getAuthUrl("/login");
            })();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-muted"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-green-soft text-green">
              <Plus size={16} />
            </span>
            Add another account
          </button>
          <button
            onClick={() => {
              setOpen(false);
              clearIdentity();
              navigate({ to: "/" });
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-muted">
              <LogOut size={16} />
            </span>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
