import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  KeyRound,
  ShieldCheck,
  Smartphone,
  Mail,
  MonitorSmartphone,
  History,
  ShieldAlert,
  FileDown,
  CircleCheck,
  Circle,
} from "lucide-react";
import { SectionCard, SettingRow } from "@/components/rald/AccountUI";
import { saveIdentity, useIdentity } from "@/lib/identity";
import { checkupItems, checkupScore, checkupStatus } from "@/lib/checkup";
import { downloadAccountReport } from "@/lib/report";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/security")({
  component: Security,
});

function Security() {
  const [identity] = useIdentity();
  if (!identity) return null;

  const score = checkupScore(identity);
  const status = checkupStatus(score);
  const items = checkupItems(identity);

  const fmtDate = new Date(identity.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const toneText =
    status.tone === "green"
      ? "text-green"
      : status.tone === "gold"
        ? "text-gold"
        : "text-red";
  const toneBg =
    status.tone === "green"
      ? "bg-green"
      : status.tone === "gold"
        ? "bg-gold"
        : "bg-red";

  return (
    <div className="screen-enter flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Security</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Settings and recommendations to help you keep your RALD identity safe.
        </p>
      </div>

      {/* automated security checkup */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-rald)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-extrabold">Security Checkup</p>
            <p className={cn("text-xs font-bold", toneText)}>{status.label}</p>
          </div>
          <div className="text-right">
            <p className={cn("text-2xl font-extrabold", toneText)}>{score}%</p>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", toneBg)}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2.5">
              {item.done ? (
                <CircleCheck size={18} className="shrink-0 text-green" />
              ) : (
                <Circle size={18} className="shrink-0 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-sm font-semibold",
                  item.done ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
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
        <RecoveryEmailRow />
        <SettingRow
          icon={Smartphone}
          label="Recovery phone"
          value={identity.phone || "Add a recovery phone in Personal info"}
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
        <SettingRow icon={History} label="Identity created" value={fmtDate} />
        <SettingRow
          icon={ShieldCheck}
          label="No suspicious activity"
          value="We're monitoring your account 24/7"
        />
      </SectionCard>

      <button
        onClick={() => downloadAccountReport(identity)}
        className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3.5 text-sm font-bold text-green transition-colors hover:bg-green-soft"
      >
        <FileDown size={16} /> Export security report (PDF)
      </button>
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

function RecoveryEmailRow() {
  const [identity] = useIdentity();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  if (!identity) return null;

  if (editing) {
    return (
      <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-soft text-green">
          <Mail size={18} />
        </div>
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="recovery@example.com"
          className="h-10 min-w-0 flex-1 rounded-lg border-[1.5px] border-green bg-surface px-3 text-sm font-medium outline-none"
        />
        <button
          onClick={() => {
            saveIdentity({ ...identity, recoveryEmail: draft.trim() });
            setEditing(false);
          }}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green text-white"
          aria-label="Save recovery email"
        >
          <CircleCheck size={16} />
        </button>
      </div>
    );
  }

  return (
    <SettingRow
      icon={Mail}
      label="Recovery email"
      value={identity.recoveryEmail || "Add a recovery email"}
      onClick={() => {
        setDraft(identity.recoveryEmail ?? "");
        setEditing(true);
      }}
    />
  );
}
