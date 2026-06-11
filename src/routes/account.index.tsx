import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  UserRound,
  Lock,
  KeyRound,
  Smartphone,
  CircleCheck,
  ChevronRight,
  FileDown,
  Radio,
  Shield,
  Globe2,
  MessageSquare,
  Mail,
  CreditCard,
} from "lucide-react";
import { SectionCard, SettingRow } from "@/components/rald/AccountUI";
import { RaldAvatar } from "@/components/rald/RaldAvatar";
import { useIdentity } from "@/lib/identity";
import { checkupItems, checkupScore, checkupStatus } from "@/lib/checkup";
import { downloadAccountReport } from "@/lib/report";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/")({
  component: AccountHome,
});

function AccountHome() {
  const [identity] = useIdentity();
  if (!identity) return null;

  const score = checkupScore(identity);
  const status = checkupStatus(score);
  const items = checkupItems(identity);
  const pending = items.filter((i) => !i.done);

  const toneClasses =
    status.tone === "green"
      ? "border-green/30 bg-green-soft/50 text-green"
      : status.tone === "gold"
        ? "border-[oklch(0.78_0.14_80_/_0.4)] bg-gold-soft/50 text-gold"
        : "border-red/30 bg-red-soft/60 text-red";

  return (
    <div className="screen-enter flex flex-col gap-5">
      {/* identity hero */}
      <div className="flex flex-col items-center rounded-2xl border border-border bg-surface px-6 py-7 text-center shadow-[var(--shadow-rald)]">
        <RaldAvatar
          identity={identity}
          size={80}
          className="shadow-[0_4px_16px_oklch(0.52_0.15_150_/_0.3)]"
        />
        <h1 className="mt-4 text-xl font-extrabold">{identity.displayName}</h1>
        <p className="text-sm text-muted-foreground">@{identity.username}</p>
        <Link
          to="/account/personal"
          className="mt-4 rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold text-green transition-colors hover:bg-green-soft"
        >
          Manage your RALD identity
        </Link>
      </div>

      {/* automated security checkup */}
      <Link
        to="/account/security"
        className={cn(
          "flex items-center gap-3 rounded-2xl border p-4 transition-colors",
          toneClasses,
        )}
      >
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-current/10">
          <ShieldCheck size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-foreground">
            Security Checkup · {score}%
          </p>
          <p className="text-xs text-muted-foreground">
            {pending.length === 0
              ? "Your account is fully protected"
              : `${pending.length} recommended step${pending.length > 1 ? "s" : ""} left`}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-current transition-all"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
        <ChevronRight size={18} className="shrink-0" />
      </Link>

      {pending.length > 0 && (
        <SectionCard
          title="Suggested for you"
          description="Automated recommendations to protect your identity"
        >
          {pending.slice(0, 3).map((item) => (
            <SettingRow
              key={item.id}
              icon={Lock}
              label={item.label}
              value={item.description}
              action={
                <Link to={item.to} className="contents">
                  <ChevronRight size={18} className="text-muted-foreground" />
                </Link>
              }
            />
          ))}
        </SectionCard>
      )}

      <SectionCard title="Quick access">
        <SettingRow
          icon={UserRound}
          label="Personal info"
          value="Name, username, photo, contact details"
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
          action={
            <Link to="/account/privacy" className="contents">
              <ChevronRight size={18} className="text-muted-foreground" />
            </Link>
          }
        />
        <SettingRow
          icon={Smartphone}
          label="Devices"
          value="1 device using your RALD identity"
          action={
            <Link to="/account/security" className="contents">
              <ChevronRight size={18} className="text-muted-foreground" />
            </Link>
          }
        />
      </SectionCard>

      {/* RALD Connected Products */}
      <SectionCard
        title="RALD Products"
        description="Services connected to your RALD identity"
      >
        {[
          {
            icon: Radio,
            label: "Loop",
            value: "Live audio rooms · loop.rald.cloud",
            href: "https://loop.rald.cloud",
            statusColor: "text-emerald-500",
            status: "Active",
            to: "/account/loop",
          },
          {
            icon: MessageSquare,
            label: "Messenger",
            value: "Private messaging across RALD",
            href: "https://messenger.rald.cloud",
            statusColor: "text-emerald-500",
            status: "Active",
            to: null,
          },
          {
            icon: Mail,
            label: "RALD Mail",
            value: "username@rald.me — your African address",
            href: null,
            statusColor: "text-amber-500",
            status: "Coming soon",
            to: null,
          },
          {
            icon: CreditCard,
            label: "PayRald",
            value: "Payments, transfers & financial tools",
            href: null,
            statusColor: "text-amber-500",
            status: "Coming soon",
            to: null,
          },
        ].map((product) => (
          <SettingRow
            key={product.label}
            icon={product.icon}
            label={product.label}
            value={product.value}
            action={
              product.to ? (
                <Link to={product.to} className="contents">
                  <span className={`text-[10px] font-bold ${product.statusColor} mr-1`}>{product.status}</span>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </Link>
              ) : product.href ? (
                <a href={product.href} target="_blank" rel="noopener noreferrer" className="contents">
                  <span className={`text-[10px] font-bold ${product.statusColor} mr-1`}>{product.status}</span>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </a>
              ) : (
                <span className={`text-[10px] font-bold ${product.statusColor} bg-amber-500/10 px-2 py-0.5 rounded-full`}>{product.status}</span>
              )
            }
          />
        ))}
      </SectionCard>

      {/* Regional & Trust quick links */}
      <div className="flex gap-2">
        <Link
          to="/account/regional"
          className="flex-1 flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-green-soft hover:text-green transition-colors"
        >
          <Globe2 size={16} className="text-green shrink-0" />
          Regional Access
        </Link>
        <Link
          to="/account/trust"
          className="flex-1 flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-green-soft hover:text-green transition-colors"
        >
          <Shield size={16} className="text-green shrink-0" />
          Trust & Verification
        </Link>
      </div>

      <button
        onClick={() => downloadAccountReport(identity)}
        className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3.5 text-sm font-bold text-green transition-colors hover:bg-green-soft"
      >
        <FileDown size={16} /> Export account report (PDF)
      </button>

      <div className="flex items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
        <CircleCheck size={14} className="text-green" />
        Protected by RALD · Built in Africa
      </div>
    </div>
  );
}
