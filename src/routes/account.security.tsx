import { createFileRoute } from "@tanstack/react-router";
import {
  KeyRound,
  ShieldCheck,
  Smartphone,
  Mail,
  MonitorSmartphone,
  History,
  ShieldAlert,
} from "lucide-react";
import { SectionCard, SettingRow } from "@/components/rald/AccountUI";
import { saveIdentity, useIdentity } from "@/lib/identity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/security")({
  component: Security,
});

function Security() {
  const [identity] = useIdentity();
  if (!identity) return null;

  const fmtDate = new Date(identity.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="screen-enter flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Security</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Settings and recommendations to help you keep your RALD identity safe.
        </p>
      </div>

      {/* status banner */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl p-4",
          identity.twoFactor
            ? "border border-green/30 bg-green-soft/50"
            : "border border-[oklch(0.78_0.14_80_/_0.4)] bg-gold-soft/50",
        )}
      >
        <div
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-full text-white",
            identity.twoFactor ? "bg-green" : "bg-gold",
          )}
        >
          {identity.twoFactor ? <ShieldCheck size={22} /> : <ShieldAlert size={22} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold">
            {identity.twoFactor
              ? "Your account is protected"
              : "Add an extra layer of protection"}
          </p>
          <p className="text-xs text-muted-foreground">
            {identity.twoFactor
              ? "2-step verification is on"
              : "Turn on 2-step verification to secure your identity"}
          </p>
        </div>
      </div>

      <SectionCard title="How you sign in to RALD">
        <SettingRow
          icon={KeyRound}
          label="Password"
          value="Last changed when you created your identity"
          onClick={() => {}}
        />
        <TwoFactorRow />
        <SettingRow
          icon={Mail}
          label="Recovery email"
          value={identity.recoveryEmail || "Add a recovery email"}
          onClick={() => {}}
        />
        <SettingRow
          icon={Smartphone}
          label="Recovery phone"
          value={identity.phone || "Add a recovery phone"}
          onClick={() => {}}
        />
      </SectionCard>

      <SectionCard
        title="Your devices"
        description="Where you're signed in with your RALD identity"
      >
        <SettingRow
          icon={MonitorSmartphone}
          label="This device"
          value="Active now · Primary session"
          onClick={() => {}}
        />
      </SectionCard>

      <SectionCard title="Recent activity">
        <SettingRow
          icon={History}
          label="Identity created"
          value={fmtDate}
        />
        <SettingRow
          icon={ShieldCheck}
          label="No suspicious activity"
          value="We're monitoring your account 24/7"
        />
      </SectionCard>
    </div>
  );
}

function TwoFactorRow() {
  const [identity] = useIdentity();
  if (!identity) return null;
  return (
    <SettingRow
      icon={ShieldCheck}
      label="2-Step Verification"
      value={identity.twoFactor ? "On" : "Off — recommended"}
      action={
        <button
          onClick={() => saveIdentity({ ...identity, twoFactor: !identity.twoFactor })}
          role="switch"
          aria-checked={identity.twoFactor}
          aria-label="Toggle 2-step verification"
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full transition-colors",
            identity.twoFactor ? "bg-green" : "bg-border",
          )}
        >
          <span
            className={cn(
              "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all",
              identity.twoFactor ? "left-6" : "left-1",
            )}
          />
        </button>
      }
    />
  );
}
