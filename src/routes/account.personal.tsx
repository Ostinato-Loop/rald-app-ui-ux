import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserRound, AtSign, Mail, Phone, Cake, MapPin, Check, X } from "lucide-react";
import { SectionCard, SettingRow } from "@/components/rald/AccountUI";
import { saveIdentity, useIdentity } from "@/lib/identity";

export const Route = createFileRoute("/account/personal")({
  component: PersonalInfo,
});

function PersonalInfo() {
  const [identity] = useIdentity();
  const [editing, setEditing] = useState<null | "displayName" | "email" | "phone">(null);
  const [draft, setDraft] = useState("");

  if (!identity) return null;

  function startEdit(field: "displayName" | "email" | "phone", current?: string) {
    setEditing(field);
    setDraft(current ?? "");
  }
  function commit() {
    if (!identity || !editing) return;
    saveIdentity({ ...identity, [editing]: draft.trim() });
    setEditing(null);
  }

  return (
    <div className="screen-enter flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">Personal info</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Info about you and your preferences across RALD products.
        </p>
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
  return <SettingRow icon={Icon} label={label} value={value} onClick={onEdit} />;
}
