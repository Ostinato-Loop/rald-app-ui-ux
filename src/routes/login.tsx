import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AtSign, ArrowRight } from "lucide-react";
import { AuroraShell } from "@/components/rald/AuroraShell";
import { RaldLogo } from "@/components/rald/RaldLogo";
import { ConsentSheet } from "@/components/rald/ConsentSheet";
import { createIdentity, loadIdentity, saveIdentity } from "@/lib/identity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — RALD Identity" },
      {
        name: "description",
        content: "Sign in to your RALD identity and return to the ecosystem.",
      },
    ],
  }),
  component: LoginPage,
});

const USERNAME_RE = /^[a-zA-Z0-9_]{2,20}$/;

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const valid = USERNAME_RE.test(username.replace(/^@/, ""));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const clean = username.replace(/^@/, "");
    const existing = loadIdentity();
    if (existing && existing.username === clean) {
      saveIdentity(existing);
    } else {
      createIdentity(clean);
    }
    navigate({ to: "/welcome" });
  }

  return (
    <>
      <AuroraShell className="justify-center">
        <div className="screen-enter flex flex-col">
          <div className="mb-8 flex justify-center">
            <RaldLogo size={64} float />
          </div>

          <h1 className="text-center text-[clamp(24px,7vw,30px)]">
            Welcome back
          </h1>
          <p className="mx-auto mt-3 max-w-[300px] text-center text-sm leading-relaxed text-muted-foreground">
            Sign in to your <strong className="text-foreground">RALD identity</strong>{" "}
            and return to the ecosystem.
          </p>

          <form onSubmit={submit} className="mt-8 flex flex-col">
            <label htmlFor="login-username" className="mb-2 text-sm font-semibold">
              Your username
            </label>
            <div
              className={cn(
                "flex items-center gap-2.5 rounded-2xl border-[1.5px] border-border bg-surface px-4",
                "h-14 transition-shadow focus-within:border-green focus-within:shadow-[var(--shadow-glow)]",
              )}
            >
              <AtSign size={18} className="shrink-0 text-muted-foreground" />
              <input
                id="login-username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
                }
                autoComplete="username"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="yourname"
                maxLength={20}
                className="h-full w-full bg-transparent text-base font-medium outline-none placeholder:text-muted-foreground/60"
              />
            </div>

            <button
              type="submit"
              disabled={!valid}
              className={cn(
                "mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold transition-all active:scale-[0.98]",
                valid
                  ? "bg-green text-white shadow-[0_4px_16px_oklch(0.52_0.15_150_/_0.3)]"
                  : "cursor-not-allowed bg-muted text-muted-foreground",
              )}
            >
              Sign in <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            New to RALD?{" "}
            <Link to="/" className="font-bold text-green">
              Create an identity
            </Link>
          </p>
        </div>
      </AuroraShell>
      <ConsentSheet />
    </>
  );
}
