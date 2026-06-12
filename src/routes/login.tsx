import { useState, useEffect } from "react";
  import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
  import { AtSign, ArrowRight } from "lucide-react";
  import { AuroraShell } from "@/components/rald/AuroraShell";
  import { RaldLogo } from "@/components/rald/RaldLogo";
  import { ConsentSheet } from "@/components/rald/ConsentSheet";
  import { loadIdentity } from "@/lib/identity";
  import { getStoredToken, getAuthUrl } from "@/lib/auth";
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

  function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    // Skip login if already authenticated
    useEffect(() => {
      const token    = getStoredToken();
      const identity = loadIdentity();
      if (token && identity) {
        navigate({ to: "/welcome" });
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function submit(e: React.FormEvent) {
      e.preventDefault();
      // Hand off to profiles.rald.cloud/login with the typed username as a hint.
      // After auth, profiles redirects back to app.rald.cloud with ?rald_token=
      window.location.href = getAuthUrl("/login", username.trim() || undefined);
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
                Your username or phone
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
                  onChange={(e) => setUsername(e.target.value)}
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
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-green text-base font-bold text-white shadow-[0_4px_16px_oklch(0.52_0.15_150_/_0.3)] transition-all active:scale-[0.98]"
              >
                Continue to RALD Identity <ArrowRight size={18} />
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                You'll sign in securely on RALD Identity.
              </p>
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
  