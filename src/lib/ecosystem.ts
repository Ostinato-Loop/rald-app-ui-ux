import type { LucideIcon } from "lucide-react";
import {
  UserRound,
  Repeat,
  MessageCircle,
  Wallet,
  Mail,
  Music2,
  Cloud,
  Compass,
} from "lucide-react";

export type EcosystemApp = {
  id: string;
  name: string;
  tagline: string;
  /** brand color token name used for the icon tile */
  tone: "green" | "gold" | "red" | "navy" | "violet" | "teal";
  icon: LucideIcon;
  /** internal route or null when "coming soon" */
  to: string | null;
  status?: "live" | "soon";
};

export const ECOSYSTEM: EcosystemApp[] = [
  {
    id: "account",
    name: "My Account",
    tagline: "Manage your RALD identity, security & privacy",
    tone: "green",
    icon: UserRound,
    to: "/account",
    status: "live",
  },
  {
    id: "loop",
    name: "Loop",
    tagline: "Your social feed, reimagined",
    tone: "violet",
    icon: Repeat,
    to: null,
    status: "soon",
  },
  {
    id: "messenger",
    name: "Messenger",
    tagline: "Private, fast messaging",
    tone: "teal",
    icon: MessageCircle,
    to: null,
    status: "soon",
  },
  {
    id: "payrald",
    name: "PayRald",
    tagline: "Send, spend & save money",
    tone: "gold",
    icon: Wallet,
    to: null,
    status: "soon",
  },
  {
    id: "mail",
    name: "RALD Mail",
    tagline: "Email built around your identity",
    tone: "red",
    icon: Mail,
    to: null,
    status: "soon",
  },
  {
    id: "fm",
    name: "RALD FM",
    tagline: "Music & audio for the culture",
    tone: "navy",
    icon: Music2,
    to: null,
    status: "soon",
  },
  {
    id: "drive",
    name: "RALD Drive",
    tagline: "Secure cloud storage",
    tone: "teal",
    icon: Cloud,
    to: null,
    status: "soon",
  },
  {
    id: "explore",
    name: "Explore",
    tagline: "Discover everything RALD",
    tone: "green",
    icon: Compass,
    to: null,
    status: "soon",
  },
];

export const TONE_STYLES: Record<
  EcosystemApp["tone"],
  { bg: string; fg: string }
> = {
  green: { bg: "bg-[oklch(0.95_0.04_150)]", fg: "text-[oklch(0.45_0.15_150)]" },
  gold: { bg: "bg-[oklch(0.96_0.05_85)]", fg: "text-[oklch(0.55_0.13_75)]" },
  red: { bg: "bg-[oklch(0.95_0.04_25)]", fg: "text-[oklch(0.55_0.2_25)]" },
  navy: { bg: "bg-[oklch(0.93_0.03_255)]", fg: "text-[oklch(0.42_0.12_255)]" },
  violet: { bg: "bg-[oklch(0.94_0.04_300)]", fg: "text-[oklch(0.48_0.18_300)]" },
  teal: { bg: "bg-[oklch(0.94_0.05_200)]", fg: "text-[oklch(0.5_0.12_200)]" },
};
