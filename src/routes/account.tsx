import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, Home, UserRound, ShieldCheck, Lock } from "lucide-react";
import { RaldWordmark } from "@/components/rald/RaldLogo";
import { AccountSwitcher } from "@/components/rald/AccountSwitcher";
import { useIdentity } from "@/lib/identity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — RALD" },
      {
        name: "description",
        content:
          "Manage your RALD identity, personal info, security and privacy in one place.",
      },
    ],
  }),
  component: AccountLayout,
});

const TABS = [
  { to: "/account", label: "Home", icon: Home, exact: true },
  { to: "/account/personal", label: "Personal info", icon: UserRound, exact: false },
  { to: "/account/security", label: "Security", icon: ShieldCheck, exact: false },
  { to: "/account/privacy", label: "Data & privacy", icon: Lock, exact: false },
] as const;

function AccountLayout() {
  const navigate = useNavigate();
  const [identity, ready] = useIdentity();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (ready && !identity) navigate({ to: "/" });
  }, [ready, identity, navigate]);

  if (!identity) return null;

  const isActive = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname.startsWith(to);

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* top app bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[760px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              to="/welcome"
              aria-label="Back to ecosystem"
              className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft size={18} />
            </Link>
            <RaldWordmark />
            <span className="text-sm font-bold text-muted-foreground">Account</span>
          </div>
          <AccountSwitcher />
        </div>

        {/* tab nav */}
        <nav className="mx-auto max-w-[760px] overflow-x-auto px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-1 pb-2 pt-1">
            {TABS.map((t) => {
              const active = isActive(t.to, t.exact);
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                    active
                      ? "bg-green-soft text-green"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <t.icon size={16} />
                  {t.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-[760px] px-4 py-6 pb-16">
        <Outlet />
      </main>
    </div>
  );
}
