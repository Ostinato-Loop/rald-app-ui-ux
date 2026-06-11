import { createFileRoute } from "@tanstack/react-router";
import {
  Mic, Users, Radio, BadgeCheck, Shield,
  ChevronRight, Star, BarChart3, UserPlus,
  Globe2, Lock,
} from "lucide-react";
import { SectionCard, SettingRow } from "@/components/rald/AccountUI";
import { useIdentity } from "@/lib/identity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/loop")({
  component: LoopPage,
});

const CREATOR_CATEGORIES = [
  { key: "radio",      label: "Radio",     emoji: "📻" },
  { key: "dj-session", label: "DJ",        emoji: "🎧" },
  { key: "commentary", label: "Commentary",emoji: "🎙️" },
  { key: "education",  label: "Education", emoji: "📚" },
  { key: "business",   label: "Business",  emoji: "💼" },
  { key: "community",  label: "Community", emoji: "🏘️" },
];

function EngineCard({
  type, label, description, color, icon: Icon, badge,
}: {
  type: "SOCIAL" | "CREATOR" | "CIVIC";
  label: string;
  description: string;
  color: string;
  icon: typeof Mic;
  badge?: string;
}) {
  const borders: Record<string, string> = {
    SOCIAL:  "border-sky-500/30 bg-sky-500/5",
    CREATOR: "border-amber-500/30 bg-amber-500/5",
    CIVIC:   "border-emerald-500/30 bg-emerald-500/5",
  };
  const icons: Record<string, string> = {
    SOCIAL:  "text-sky-500",
    CREATOR: "text-amber-500",
    CIVIC:   "text-emerald-500",
  };
  return (
    <div className={cn("rounded-2xl border p-4 flex gap-3", borders[type])}>
      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-current/10", icons[type])}>
        <Icon size={20} className={icons[type]} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold">{label}</p>
          {badge && (
            <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", color)}>
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function LoopPage() {
  const [identity] = useIdentity();
  if (!identity) return null;

  return (
    <div className="screen-enter flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Loop</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your creator identity, civic profile, and room settings on Loop.
        </p>
      </div>

      {/* Room Engines */}
      <SectionCard
        title="Room Engines"
        description="Loop separates three types of rooms to keep truth and engagement independent"
      >
        <div className="flex flex-col gap-3 p-1">
          <EngineCard
            type="SOCIAL"
            icon={Users}
            label="Social Rooms"
            description="General conversation, friends, hangouts. No ranking algorithm."
            color="bg-sky-500/10 text-sky-600"
          />
          <EngineCard
            type="CREATOR"
            icon={Radio}
            label="Creator Rooms"
            description="Entertainment and audience building. Ranked by local velocity, not global totals."
            color="bg-amber-500/10 text-amber-600"
            badge="Creator Engine"
          />
          <EngineCard
            type="CIVIC"
            icon={Shield}
            label="Civic Rooms"
            description="Public-interest information — floods, elections, alerts. Ranked by witness confirmations."
            color="bg-emerald-500/10 text-emerald-600"
            badge="Civic Engine"
          />
        </div>
      </SectionCard>

      {/* Creator Identity */}
      <SectionCard
        title="Creator Identity"
        description="Your public creator profile on Loop"
      >
        <SettingRow
          icon={Star}
          label="Creator Status"
          value="Not yet verified"
          action={
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
              Available soon
            </span>
          }
        />
        <SettingRow
          icon={BarChart3}
          label="Creator Rankings"
          value="Regional #1 rankings by city, state and country"
          action={<ChevronRight size={18} className="text-muted-foreground" />}
        />
        <div className="px-4 pb-3">
          <p className="text-[11px] text-muted-foreground mb-2 font-semibold uppercase tracking-wider">
            Creator categories
          </p>
          <div className="flex flex-wrap gap-1.5">
            {CREATOR_CATEGORIES.map(cat => (
              <span
                key={cat.key}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground"
              >
                {cat.emoji} {cat.label}
              </span>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Civic Identity */}
      <SectionCard
        title="Civic Identity"
        description="Your trust score and verification for civic participation"
      >
        <SettingRow
          icon={Shield}
          label="Civic Trust Score"
          value="— / 100"
          action={
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Builds with activity
            </span>
          }
        />
        <SettingRow
          icon={BadgeCheck}
          label="Civic Verification"
          value="Not yet verified — participate in civic rooms to build trust"
          action={<ChevronRight size={18} className="text-muted-foreground" />}
        />
        <div className="px-4 pb-4">
          <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 space-y-2">
            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
              Verification levels
            </p>
            {[
              { level: "UNVERIFIED",          count: "0–4 confirmations",  color: "text-muted-foreground" },
              { level: "WITNESSED",            count: "5–14 confirmations", color: "text-sky-600" },
              { level: "LOCALLY_VERIFIED",     count: "15–49 confirmations",color: "text-amber-600" },
              { level: "OFFICIALLY_CONFIRMED", count: "50+ confirmations",  color: "text-emerald-600" },
            ].map(v => (
              <div key={v.level} className="flex items-center justify-between">
                <span className={cn("text-xs font-semibold", v.color)}>{v.level}</span>
                <span className="text-[10px] text-muted-foreground">{v.count}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Social graph */}
      <SectionCard title="Social & Community">
        <SettingRow
          icon={UserPlus}
          label="Followers"
          value="People who follow you on Loop"
          action={<ChevronRight size={18} className="text-muted-foreground" />}
        />
        <SettingRow
          icon={Users}
          label="Communities"
          value="Communities you've joined or created"
          action={<ChevronRight size={18} className="text-muted-foreground" />}
        />
        <SettingRow
          icon={Globe2}
          label="Room Visibility"
          value="Public — anyone can join your rooms"
          action={<ChevronRight size={18} className="text-muted-foreground" />}
        />
        <SettingRow
          icon={Lock}
          label="Blocked on Loop"
          value="Manage who can't join your rooms"
          action={<ChevronRight size={18} className="text-muted-foreground" />}
        />
      </SectionCard>

      <a
        href="https://loop.rald.cloud"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3.5 text-sm font-bold text-green-600 transition-colors hover:bg-green-soft"
      >
        Open Loop <ChevronRight size={16} />
      </a>
    </div>
  );
}
