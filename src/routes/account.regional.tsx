import { createFileRoute } from "@tanstack/react-router";
import {
  Globe2, CheckCircle2, Clock, AlertCircle, ChevronRight, MapPin, Zap,
} from "lucide-react";
import { SectionCard } from "@/components/rald/AccountUI";
import { useIdentity } from "@/lib/identity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/regional")({
  component: RegionalAccess,
});

type ActivationStatus = "ACTIVE" | "BETA" | "WAITLIST" | "COMING_SOON";

type Product = {
  name: string;
  description: string;
  status: "available" | "coming_soon" | "waitlisted";
};

type CountryEntry = {
  code: string;
  name: string;
  flag: string;
  status: ActivationStatus;
  products: Product[];
};

const COUNTRY_DATA: CountryEntry[] = [
  {
    code: "NG", name: "Nigeria", flag: "🇳🇬", status: "ACTIVE",
    products: [
      { name: "Loop",      description: "Live audio rooms", status: "available" },
      { name: "Messenger", description: "Private messaging", status: "available" },
      { name: "RALD Mail", description: "username@rald.me", status: "coming_soon" },
      { name: "PayRald",   description: "Payments & transfers", status: "coming_soon" },
    ],
  },
  {
    code: "KE", name: "Kenya", flag: "🇰🇪", status: "WAITLIST",
    products: [
      { name: "Loop",      description: "Live audio rooms", status: "waitlisted" },
      { name: "Messenger", description: "Private messaging", status: "waitlisted" },
    ],
  },
  {
    code: "GH", name: "Ghana", flag: "🇬🇭", status: "WAITLIST",
    products: [
      { name: "Loop",      description: "Live audio rooms", status: "waitlisted" },
    ],
  },
  {
    code: "TZ", name: "Tanzania", flag: "🇹🇿", status: "COMING_SOON",
    products: [],
  },
  {
    code: "ZA", name: "South Africa", flag: "🇿🇦", status: "COMING_SOON",
    products: [],
  },
];

function StatusBadge({ status }: { status: ActivationStatus }) {
  const map = {
    ACTIVE:       { label: "Active",       cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",   icon: CheckCircle2 },
    BETA:         { label: "Beta",         cls: "bg-sky-500/10 text-sky-600 border-sky-500/30",               icon: Zap },
    WAITLIST:     { label: "Waitlist",     cls: "bg-amber-500/10 text-amber-600 border-amber-500/30",         icon: Clock },
    COMING_SOON:  { label: "Coming soon",  cls: "bg-secondary text-muted-foreground border-border",           icon: AlertCircle },
  } as const;
  const { label, cls, icon: Icon } = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider", cls)}>
      <Icon size={10} /> {label}
    </span>
  );
}

function ProductRow({ product }: { product: Product }) {
  const statusMap = {
    available:   { icon: CheckCircle2, color: "text-emerald-500" },
    coming_soon: { icon: Clock,        color: "text-muted-foreground" },
    waitlisted:  { icon: Clock,        color: "text-amber-500" },
  } as const;
  const { icon: Icon, color } = statusMap[product.status];
  return (
    <div className="flex items-center justify-between py-2 px-4 border-t border-border first:border-0">
      <div>
        <p className="text-sm font-semibold">{product.name}</p>
        <p className="text-xs text-muted-foreground">{product.description}</p>
      </div>
      <Icon size={16} className={color} />
    </div>
  );
}

function RegionalAccess() {
  const [identity] = useIdentity();
  if (!identity) return null;

  return (
    <div className="screen-enter flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Regional Access</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          RALD is an African-first platform. Access expands country by country.
        </p>
      </div>

      {/* How it works */}
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-green-soft flex items-center justify-center shrink-0">
            <Globe2 size={18} className="text-green" />
          </div>
          <div>
            <p className="text-sm font-bold">Country Activation Framework</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Each country goes through activation review covering legal, compliance,
              infrastructure, and moderation requirements before RALD products launch.
            </p>
          </div>
        </div>
      </div>

      {/* Country list */}
      {COUNTRY_DATA.map(country => (
        <SectionCard
          key={country.code}
          title={`${country.flag} ${country.name}`}
          action={<StatusBadge status={country.status} />}
        >
          {country.products.length > 0 ? (
            country.products.map(p => <ProductRow key={p.name} product={p} />)
          ) : (
            <div className="px-4 py-3 text-xs text-muted-foreground">
              Activation review in progress — join the waitlist at{" "}
              <a href="https://auth.rald.cloud" className="text-green underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                auth.rald.cloud
              </a>
            </div>
          )}
        </SectionCard>
      ))}

      {/* Your region */}
      <div className="rounded-2xl border border-border bg-surface p-4 flex items-center gap-3">
        <MapPin size={18} className="text-green shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Your region</p>
          <p className="text-xs text-muted-foreground">
            Set in your Loop profile — used to show nearby rooms and regional content.
          </p>
        </div>
        <a href="https://loop.rald.cloud/me" target="_blank" rel="noopener noreferrer">
          <ChevronRight size={18} className="text-muted-foreground" />
        </a>
      </div>
    </div>
  );
}
