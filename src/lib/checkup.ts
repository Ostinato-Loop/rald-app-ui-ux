import type { RaldIdentity } from "./identity";

export type CheckupItem = {
  id: string;
  label: string;
  description: string;
  done: boolean;
  /** route + optional hint of where to resolve it */
  to: string;
};

/**
 * Automated security checkup — derives the live state of an identity's
 * protection from its stored fields. Adding any of these automatically
 * raises the score, no manual bookkeeping required.
 */
export function checkupItems(identity: RaldIdentity): CheckupItem[] {
  return [
    {
      id: "2fa",
      label: "2-Step Verification",
      description: "Add a second layer to block unauthorized sign-ins",
      done: !!identity.twoFactor,
      to: "/account/security",
    },
    {
      id: "email",
      label: "Verified email",
      description: "Confirm an email so you can recover your account",
      done: !!identity.email && !!identity.emailVerified,
      to: "/account/personal",
    },
    {
      id: "recovery",
      label: "Recovery email",
      description: "A backup address in case you get locked out",
      done: !!identity.recoveryEmail,
      to: "/account/security",
    },
    {
      id: "phone",
      label: "Recovery phone",
      description: "Receive security alerts and reset codes",
      done: !!identity.phone,
      to: "/account/security",
    },
    {
      id: "avatar",
      label: "Profile photo",
      description: "Help others recognize your RALD identity",
      done: !!identity.avatar,
      to: "/account/personal",
    },
  ];
}

export function checkupScore(identity: RaldIdentity): number {
  const items = checkupItems(identity);
  const done = items.filter((i) => i.done).length;
  return Math.round((done / items.length) * 100);
}

export function checkupStatus(score: number): {
  label: string;
  tone: "green" | "gold" | "red";
} {
  if (score >= 100) return { label: "Fully protected", tone: "green" };
  if (score >= 60) return { label: "Almost there", tone: "gold" };
  return { label: "Needs attention", tone: "red" };
}
