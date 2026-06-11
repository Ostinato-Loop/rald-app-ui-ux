import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Lock,
  Download,
  Trash2,
  History,
  Eye,
  Megaphone,
  FileText,
  LogOut,
} from "lucide-react";
import { SectionCard, SettingRow } from "@/components/rald/AccountUI";
import { clearIdentity, useIdentity } from "@/lib/identity";
import { downloadAccountReport } from "@/lib/report";

export const Route = createFileRoute("/account/privacy")({
  component: Privacy,
});

function Privacy() {
  const [identity] = useIdentity();
  const navigate = useNavigate();
  if (!identity) return null;

  return (
    <div className="screen-enter flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Data &amp; privacy</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Key controls and settings for your RALD data. We never sell your
          personal information.
        </p>
      </div>

      <SectionCard title="Your data, your control">
        <SettingRow
          icon={History}
          label="Activity controls"
          value="Decide what RALD saves across products"
          onClick={() => {}}
        />
        <SettingRow
          icon={Eye}
          label="Personalization"
          value="Tune recommendations across the ecosystem"
          onClick={() => {}}
        />
        <SettingRow
          icon={Megaphone}
          label="Ad & content settings"
          value="Control how RALD personalizes content"
          onClick={() => {}}
        />
      </SectionCard>

      <SectionCard
        title="Download or delete your data"
        description="Take your data with you, anytime"
      >
        <SettingRow
          icon={Download}
          label="Download your data"
          value="Export your identity & security report as PDF"
          onClick={() => downloadAccountReport(identity)}
        />
        <SettingRow
          icon={Trash2}
          label="Delete account"
          value="Permanently remove your RALD identity"
          danger
          onClick={() => {
            clearIdentity();
            navigate({ to: "/" });
          }}
        />
      </SectionCard>

      <SectionCard title="Policies">
        <SettingRow icon={FileText} label="Privacy Policy" onClick={() => {}} />
        <SettingRow icon={Lock} label="Terms of Service" onClick={() => {}} />
      </SectionCard>

      <button
        onClick={() => {
          clearIdentity();
          navigate({ to: "/" });
        }}
        className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3.5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        <LogOut size={16} /> Sign out of RALD
      </button>
    </div>
  );
}
