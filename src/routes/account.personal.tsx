import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  UserRound,
  AtSign,
  Mail,
  Phone,
  Cake,
  MapPin,
  Check,
  X,
  Camera,
  BadgeCheck,
  ShieldQuestion,
} from "lucide-react";
import { SectionCard, SettingRow } from "@/components/rald/AccountUI";
import { RaldAvatar, fileToAvatar } from "@/components/rald/RaldAvatar";
import { EmailVerifyDialog } from "@/components/rald/EmailVerifyDialog";
import { saveIdentity, useIdentity } from "@/lib/identity";

export const Route = createFileRoute("/account/personal")({
  component: PersonalInfo,
});

function PersonalInfo() {
  const [identity] = useIdentity();
  const [editing, setEditing] = useState<null | "displayName" | "email" | "phone">(null);
  const [draft, setDraft] = useState("");
  const [verifyOpen, setVerifyOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!identity) return null;

  function startEdit(field: "displayName" | "email" | "phone", current?: string) {
    setEditing(field);
    setDraft(current ?? "");
  }
  function commit() {
    if (!identity || !editing) return;
    const next = { ...identity, [editing]: draft.trim() };
    // changing the email invalidates a previous verification
    if (editing === "email" && draft.trim() !== identity.email) {
      next.emailVerified = false;
    }
    saveIdentity(next);
    setEditing(null);
  }

  async function onPickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !identity) return;
    const avatar = await fileToAvatar(file);
    saveIdentity({ ...identity, avatar });
    e.target.value = "";
  }

  return (
    <div className="screen-enter flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Personal info</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Info about you and your preferences across RALD products.
        </p>
      </div>

      {/* avatar */}
      <div className="flex flex-col items-center rounded-2xl border border-border bg-surface px-6 py-7 text-center shadow-[var(--shadow-rald)]">
        <button
          onClick={() => fileRef.current?.click()}
          className="group relative"
          aria-label="Change profile photo"
        >
          <RaldAvatar identity={identity} size={88} />
          <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-surface bg-green text-white transition-transform group-hover:scale-105">
            <Camera size={15} />
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPickAvatar}
        />
        <p className="mt-3 text-sm font-bold">{identity.displayName}</p>
        <p className="text-xs text-muted-foreground">
          Tap the photo to upload a new one
        </p>
        {identity.avatar && (
          <button
            onClick={() => saveIdentity({ ...identity, avatar: undefined })}
            className="mt-2 text-xs font-semibold text-red"
          >
            Remove photo
          </button>
        )}
      </div>

      <SectionCard title="Profile">
        <Field
          icon={UserRound}
          label="Display name"
          value={identity.displayName || "Not set"}
          editing={editing === "displayName"}
          draft={draft}
          setDraft={setDraft}
          onEdit={() => startEdit("displayName", identity.displayName)}
          onCancel={() => setEditing(null)}
          onSave={commit}
        />
        <SettingRow icon={AtSign} label="Username" value={`@${identity.username}`} />
      </SectionCard>

      <SectionCard
        title="Contact info"
        description="Used to reach you and recover your account"
      >
        <Field
          icon={Mail}
          label="Email"
          value={identity.email || "Add an email"}
          placeholder="you@example.com"
          editing={editing === "email"}
          draft={draft}
          setDraft={setDraft}
          onEdit={() => startEdit("email", identity.email)}
          onCancel={() => setEditing(null)}
          onSave={commit}
          badge={
            identity.email ? (
              identity.emailVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-soft px-2 py-0.5 text-[10px] font-bold text-green">
                  <BadgeCheck size={11} /> Verified
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setVerifyOpen(true);
                  }}
                  className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-bold text-gold"
                >
                  <ShieldQuestion size={11} /> Verify
                </button>
              )
            ) : undefined
          }
        />
        <Field
          icon={Phone}
          label="Phone"
          value={identity.phone || "Add a phone number"}
          placeholder="+234 ..."
          editing={editing === "phone"}
          draft={draft}
          setDraft={setDraft}
          onEdit={() => startEdit("phone", identity.phone)}
          onCancel={() => setEditing(null)}
          onSave={commit}
        />
      </SectionCard>

      <SectionCard title="About you">
        <SettingRow icon={Cake} label="Birthday" value="Add your birthday" onClick={() => {}} />
        <SettingRow icon={MapPin} label="Location" value="Add your location" onClick={() => {}} />
      </SectionCard>

      <EmailVerifyDialog open={verifyOpen} onClose={() => setVerifyOpen(false)} />
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  placeholder,
  editing,
  draft,
  setDraft,
  onEdit,
  onCancel,
  onSave,
  badge,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
  placeholder?: string;
  editing: boolean;
  draft: string;
  setDraft: (v: string) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  badge?: React.ReactNode;
}) {
  if (editing) {
    return (
      <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-soft text-green">
          <Icon size={18} />
        </div>
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder ?? label}
          className="h-10 min-w-0 flex-1 rounded-lg border-[1.5px] border-green bg-surface px-3 text-sm font-medium outline-none"
        />
        <button
          onClick={onSave}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green text-white"
          aria-label="Save"
        >
          <Check size={16} />
        </button>
        <button
          onClick={onCancel}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
          aria-label="Cancel"
        >
          <X size={16} />
        </button>
      </div>
    );
  }
  return (
    <SettingRow
      icon={Icon}
      label={label}
      value={
        badge ? (
          <span className="flex items-center gap-2">
            <span className="truncate">{value}</span>
            {badge}
          </span>
        ) : (
          value
        )
      }
      onClick={onEdit}
    />
  );
}
