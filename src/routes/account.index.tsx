import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  UserRound,
  Lock,
  KeyRound,
  Smartphone,
  CircleCheck,
  ChevronRight,
} from "lucide-react";
import { SectionCard, SettingRow } from "@/components/rald/AccountUI";
import { initials, useIdentity } from "@/lib/identity";

export const Route = createFileRoute("/account/")({
  component: AccountHome,
});

function AccountHome() {
  const [identity] = useIdentity();
  if (!identity) return null;

  const checkup = identity.twoFactor ? 100 : 70;

  return (
    <div className="screen-enter flex flex-col gap-5">
      {/* identity hero */}
      <div className="flex flex-col items-center rounded-2xl border border-border bg-surface px-6 py-7 text-center shadow-[var(--shadow-rald)]">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-green text-2xl font-extrabold text-white shadow-[0_4px_16px_oklch(0.52_0.15_150_/_0.3)]">
          {initials(identity)}
        </div>
        <h1 className="mt-4 text-xl font-extrabold">{identity.displayName}</h1>
        <p className="text-sm text-muted-foreground">@{identity.username}</p>
        <Link
          to="/account/personal"
          className="mt-4 rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold text-green transition-colors hover:bg-green-soft"
        >
          Manage your RALD identity
        </Link>
      </div>

      {/* security checkup banner */}
      <Link
        to="/account/security"
        className="flex items-center gap-3 rounded-2xl border border-green/30 bg-green-soft/50 p-4 transition-colors hover:bg-green-soft"
      >
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-green text-white">
          <ShieldCheck size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold">Security Checkup</p>
          <p className="text-xs text-muted-foreground">
            {checkup === 100
              ? "Your account is fully protected"
              : "A few steps to fully protect your account"}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-green transition-all"
              style={{ width: `${checkup}%` }}
            />
          </div>
        </div>
        <ChevronRight size={18} className="shrink-0 text-green" />
      </Link>

      <SectionCard
        title="Privacy suggestions available"
        description="Review a few settings to make RALD work better for you"
      >
        <SettingRow
          icon={Lock}
          label="Take the Privacy Checkup"
          value="Choose the data saved in your account"
          onClick={() => {}}
        />
        <SettingRow
          icon={Smartphone}
          label="Check devices signed in"
          value="1 device using your RALD identity"
          onClick={() => {}}
        />
      </SectionCard>

      <SectionCard title="Quick access">
        <SettingRow
          icon={UserRound}
          label="Personal info"
          value="Name, username, contact details"
          onClick={() => {}}
          action={
            <Link to="/account/personal" className="contents">
              <ChevronRight size={18} className="text-muted-foreground" />
            </Link>
          }
        />
        <SettingRow
          icon={KeyRound}
          label="Security"
          value="Password, 2-step verification, devices"
          onClick={() => {}}
          action={
            <Link to="/account/security" className="contents">
              <ChevronRight size={18} className="text-muted-foreground" />
            </Link>
          }
        />
        <SettingRow
          icon={Lock}
          label="Data & privacy"
          value="What RALD knows & your controls"
          onClick={() => {}}
          action={
            <Link to="/account/privacy" className="contents">
              <ChevronRight size={18} className="text-muted-foreground" />
            </Link>
          }
        />
      </SectionCard>

      <div className="flex items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
        <CircleCheck size={14} className="text-green" />
        Protected by RALD · Built in Africa
      </div>
    </div>
  );
}
