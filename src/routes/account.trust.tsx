import { createFileRoute } from "@tanstack/react-router";
import {
  Shield, Star, BadgeCheck, Activity, AlertTriangle,
  ChevronRight, TrendingUp, Clock, CheckCircle2,
} from "lucide-react";
import { SectionCard, SettingRow } from "@/components/rald/AccountUI";
import { useIdentity } from "@/lib/identity";
import { checkupScore } from "@/lib/checkup";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/trust")({
  component: TrustPage,
});

function TrustMeter({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-500" :
    score >= 50 ? "bg-amber-500" :
    "bg-red-500";
  const label =
    score >= 80 ? "Strong" :
    score >= 50 ? "Building" :
    "Getting started";

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-green" />
          <span className="text-sm font-bold">RALD Trust Score</span>
        </div>
        <span className="text-2xl font-extrabold">{score}<span className="text-sm text-muted-foreground font-medium"> / 100</span></span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${score}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{label} — complete your profile to increase your score</p>
    </div>
  );
}

function TrustPage() {
  const [identity] = useIdentity();
  if (!identity) return null;

  const securityScore = checkupScore(identity);

  return (
    <div className="screen-enter flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Trust & Verification</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your identity, civic standing, and creator reputation across RALD.
        </p>
      </div>

      <TrustMeter score={securityScore} />

      {/* Trust factors */}
      <SectionCard
        title="Trust Factors"
        description="What builds your RALD trust score"
      >
        {[
          {
            icon: BadgeCheck,
            label: "Identity verification",
            value: identity.emailVerified ? "Email verified ✓" : "Email not verified",
            done: !!identity.emailVerified,
          },
          {
            icon: Shield,
            label: "Two-factor authentication",
            value: identity.twoFactor ? "Enabled ✓" : "Not enabled",
            done: identity.twoFactor,
          },
          {
            icon: Clock,
            label: "Account age",
            value: `Since ${new Date(identity.createdAt).toLocaleDateString("en-NG", { month: "long", year: "numeric" })}`,
            done: true,
          },
          {
            icon: Activity,
            label: "Regional participation",
            value: "Builds from Loop activity",
            done: false,
          },
          {
            icon: AlertTriangle,
            label: "Abuse reports",
            value: "0 reports — clean history",
            done: true,
          },
        ].map(item => (
          <SettingRow
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
            action={
              item.done ? (
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              ) : (
                <ChevronRight size={18} className="text-muted-foreground" />
              )
            }
          />
        ))}
      </SectionCard>

      {/* Civic verification */}
      <SectionCard
        title="Civic Verification"
        description="Your standing in the Civic Engine — separate from creator engagement"
      >
        <SettingRow
          icon={Shield}
          label="Civic Trust Score"
          value="Builds when you confirm real events on Loop"
          action={
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              UNVERIFIED
            </span>
          }
        />
        <SettingRow
          icon={Activity}
          label="Confirmations given"
          value="0 civic events confirmed"
          action={<ChevronRight size={18} className="text-muted-foreground" />}
        />
        <div className="px-4 pb-4">
          <p className="text-xs text-muted-foreground">
            To build civic trust: join a CIVIC room on Loop and confirm real events you witness.
            Engagement metrics (likes, followers) never affect civic verification.
          </p>
        </div>
      </SectionCard>

      {/* Creator verification */}
      <SectionCard
        title="Creator Verification"
        description="Your standing in the Creator Engine"
      >
        <SettingRow
          icon={Star}
          label="Creator Status"
          value="Not yet a verified creator"
          action={
            <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Coming soon
            </span>
          }
        />
        <SettingRow
          icon={TrendingUp}
          label="Local velocity"
          value="Regional ranking by audience acceleration, not global totals"
          action={<ChevronRight size={18} className="text-muted-foreground" />}
        />
      </SectionCard>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-3">
        <Shield size={18} className="text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Two independent systems</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Loop separates the Creator Engine and Civic Engine by design.
            Engagement never determines truth. Truth never depends on popularity.
          </p>
        </div>
      </div>
    </div>
  );
}
