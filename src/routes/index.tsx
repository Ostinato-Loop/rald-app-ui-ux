import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AtSign } from "lucide-react";
import { AuroraShell } from "@/components/rald/AuroraShell";
import { RaldLogo } from "@/components/rald/RaldLogo";
import { ConsentSheet } from "@/components/rald/ConsentSheet";
import { createIdentity } from "@/lib/identity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RALD — One Identity. Every RALD Product." },
      {
        name: "description",
        content:
          "Claim your RALD username. One identity for Loop, Messenger, PayRald, RALD Mail and everything we build next.",
      },
    ],
  }),
  component: OnboardingPage,
});

const SUGGESTIONS = ["@boyd", "@lagosmusic", "@abujacreator", "@manillafm"];
const USERNAME_RE = /^[a-zA-Z0-9_]{2,20}$/;

function OnboardingPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const valid = USERNAME_RE.test(username.replace(/^@/, ""));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    createIdentity(username);
    navigate({ to: "/welcome" });
  }

  return (
    <>
      <AuroraShell progress={{ total: 5, done: 1 }}>
        <div className="screen-enter flex flex-1 flex-col">
          <div className="mb-8 flex justify-center">
            <RaldLogo size={72} float />
          </div>

          <h1 className="text-center text-[clamp(22px,6vw,28px)] leading-[1.15]">
            One Identity.
            <br />
            <span className="text-green">Every RALD Product.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[300px] text-center text-sm leading-relaxed text-muted-foreground">
            Your username unlocks Loop, Messenger, PayRald, RALD Mail, and
            everything we build next.
          </p>

          <form onSubmit={submit} className="mt-8 flex flex-col">
            <label htmlFor="username" className="mb-2 text-sm font-semibold">
              Choose your username
            </label>
            <div
              className={cn(
                "flex items-center gap-2.5 rounded-2xl border-[1.5px] border-border bg-surface px-4",
                "h-14 transition-shadow focus-within:border-green focus-within:shadow-[var(--shadow-glow)]",
              )}
            >
              <AtSign size={18} className="shrink-0 text-muted-foreground" />
              <input
                id="username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
                }
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="yourname"
                maxLength={20}
                className="h-full w-full bg-transparent text-base font-medium outline-none placeholder:text-muted-foreground/60"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              2–20 characters. Letters, numbers, underscores.
            </p>

            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Try
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setUsername(s.replace(/^@/, ""))}
                    className="rounded-full border-[1.5px] border-border bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-muted-foreground transition-colors hover:border-green hover:text-green"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={!valid}
                className={cn(
                  "flex h-14 w-full items-center justify-center rounded-2xl text-base font-bold transition-all active:scale-[0.98]",
                  valid
                    ? "bg-green text-white shadow-[0_4px_16px_oklch(0.52_0.15_150_/_0.3)]"
                    : "cursor-not-allowed bg-muted text-muted-foreground",
                )}
              >
                Continue
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Email and phone can be added later.
              </p>
            </div>
          </form>

          <p className="mt-auto pt-8 text-center text-xs text-muted-foreground">
            Already have an identity?{" "}
            <Link to="/login" className="font-bold text-green">
              Sign in
            </Link>
          </p>
        </div>
      </AuroraShell>
      <ConsentSheet />
    </>
  );
}
