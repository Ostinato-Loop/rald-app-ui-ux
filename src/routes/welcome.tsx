import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuroraShell } from "@/components/rald/AuroraShell";
import { RaldWordmark } from "@/components/rald/RaldLogo";
import { RaldAvatar } from "@/components/rald/RaldAvatar";
import { AccountSwitcher } from "@/components/rald/AccountSwitcher";
import { ECOSYSTEM, TONE_STYLES } from "@/lib/ecosystem";
import { useIdentity } from "@/lib/identity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Your RALD Ecosystem" },
      {
        name: "description",
        content: "One identity, every RALD product. Jump into any app.",
      },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  const navigate = useNavigate();
  const [identity, ready] = useIdentity();

  useEffect(() => {
    if (ready && !identity) navigate({ to: "/" });
  }, [ready, identity, navigate]);

  if (!identity) return null;

  return (
    <AuroraShell className="pt-0">
      {/* header */}
      <header className="flex items-center justify-between">
        <RaldWordmark />
        <button
          onClick={() => {
            clearIdentity();
            navigate({ to: "/" });
          }}
          className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut size={14} /> Sign out
        </button>
      </header>

      {/* greeting */}
      <div className="screen-enter mt-8">
        <div className="flex items-center gap-3.5">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-green text-lg font-extrabold text-white shadow-[0_4px_16px_oklch(0.52_0.15_150_/_0.3)]">
            {initials(identity)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              Welcome to RALD
            </p>
            <h1 className="truncate text-[clamp(20px,6vw,26px)]">
              Hi, @{identity.username}
            </h1>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Your identity is live. Everything below is unlocked with this one
          account — start with{" "}
          <span className="font-semibold text-foreground">My Account</span>.
        </p>
      </div>

      {/* grid */}
      <div className="mt-7 grid grid-cols-2 gap-3 pb-4">
        {ECOSYSTEM.map((app, i) => {
          const tone = TONE_STYLES[app.tone];
          const featured = app.id === "account";
          const inner = (
            <div
              className={cn(
                "screen-enter group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-4 text-left transition-all",
                app.to
                  ? "hover:-translate-y-0.5 hover:border-green/40 hover:shadow-[var(--shadow-rald)]"
                  : "opacity-80",
                featured && "border-green/30 bg-green-soft/40",
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-xl",
                  tone.bg,
                )}
              >
                <app.icon size={22} className={tone.fg} />
              </div>
              <p className="mt-3 text-[15px] font-bold leading-tight">
                {app.name}
              </p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">
                {app.tagline}
              </p>
              {app.status === "soon" && (
                <span className="mt-2 inline-flex w-fit rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Soon
                </span>
              )}
              {featured && (
                <span className="mt-2 inline-flex w-fit rounded-full bg-green px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Open
                </span>
              )}
            </div>
          );

          return app.to ? (
            <Link key={app.id} to={app.to} className="contents">
              {inner}
            </Link>
          ) : (
            <div key={app.id} className="cursor-default">
              {inner}
            </div>
          );
        })}
      </div>
    </AuroraShell>
  );
}
