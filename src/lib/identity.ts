import { useEffect, useState } from "react";

export type RaldIdentity = {
  username: string;
  displayName: string;
  email?: string;
  phone?: string;
  recoveryEmail?: string;
  avatar?: string; // data URL
  emailVerified?: boolean;
  createdAt: string;
  twoFactor: boolean;
};

const KEY = "rald.identity";
const ACCOUNTS_KEY = "rald.accounts";
export const IDENTITY_EVENT = "rald-identity-change";

function emit() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(IDENTITY_EVENT));
}

/* ---------------- accounts store ---------------- */

export function listAccounts(): RaldIdentity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as RaldIdentity[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: RaldIdentity[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function upsertAccount(identity: RaldIdentity) {
  const accounts = listAccounts();
  const idx = accounts.findIndex((a) => a.username === identity.username);
  if (idx >= 0) accounts[idx] = identity;
  else accounts.push(identity);
  writeAccounts(accounts);
}

/* ---------------- active identity ---------------- */

export function loadIdentity(): RaldIdentity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RaldIdentity) : null;
  } catch {
    return null;
  }
}

export function saveIdentity(identity: RaldIdentity) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(identity));
  upsertAccount(identity);
  emit();
}

export function clearIdentity() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  emit();
}

/** Remove an account entirely (and sign out if it was active). */
export function removeAccount(username: string) {
  if (typeof window === "undefined") return;
  writeAccounts(listAccounts().filter((a) => a.username !== username));
  const active = loadIdentity();
  if (active?.username === username) window.localStorage.removeItem(KEY);
  emit();
}

/** Switch the active session to an already-saved account. */
export function switchAccount(username: string): RaldIdentity | null {
  const account = listAccounts().find((a) => a.username === username);
  if (!account) return null;
  window.localStorage.setItem(KEY, JSON.stringify(account));
  emit();
  return account;
}

export function createIdentity(username: string): RaldIdentity {
  const clean = username.replace(/^@/, "");
  const existing = listAccounts().find((a) => a.username === clean);
  if (existing) {
    saveIdentity(existing);
    return existing;
  }
  const identity: RaldIdentity = {
    username: clean,
    displayName: clean
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    createdAt: new Date().toISOString(),
    twoFactor: false,
    emailVerified: false,
  };
  saveIdentity(identity);
  return identity;
}

/* ---------------- hooks ---------------- */

/** Reactive hook for the current identity. */
export function useIdentity(): [RaldIdentity | null, boolean] {
  const [identity, setIdentity] = useState<RaldIdentity | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIdentity(loadIdentity());
    setReady(true);
    const handler = () => setIdentity(loadIdentity());
    window.addEventListener(IDENTITY_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(IDENTITY_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return [identity, ready];
}

/** Reactive hook for all stored accounts. */
export function useAccounts(): RaldIdentity[] {
  const [accounts, setAccounts] = useState<RaldIdentity[]>([]);
  useEffect(() => {
    setAccounts(listAccounts());
    const handler = () => setAccounts(listAccounts());
    window.addEventListener(IDENTITY_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(IDENTITY_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return accounts;
}

export function initials(identity: RaldIdentity): string {
  const parts = identity.displayName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ── Session sync (from auth.rald.cloud /profiles/me) ────────── */

/**
 * Shape returned by GET /profiles/me on auth.rald.cloud.
 *
 * FIX: Previously expected { username, rald_internal_id, phone, display_name }
 *   from the /session endpoint, but /session only returns { id, email, role }.
 *   validateSession() now calls /profiles/me after the token check to get the
 *   full profile — this type reflects that richer shape.
 */
export type SessionUser = {
  /** RALD user UUID */
  id:              string;
  /** @username from auth_users.username */
  username?:       string;
  email?:          string;
  /** Full name from auth_users.name */
  name?:           string;
  /** Friendly display name from auth_user_profiles.display_name */
  display_name?:   string;
  phone_number?:   string;
  avatar_url?:     string;
  created_at?:     string;
  two_factor?:     boolean;
  rald_internal_id?: string;
};

/**
 * Populate (or refresh) the localStorage identity from a validated
 * auth.rald.cloud /profiles/me response.
 *
 * Called after the ?rald_token= SSO handoff from profiles.rald.cloud and
 * on silent revalidation in the welcome / account layouts.
 *
 * FIX: Previously called user.username.toLowerCase() which threw a TypeError
 *   when username was undefined (the old /session endpoint never included it).
 *   Now uses a safe fallback chain: username → email prefix → "rald_user".
 */
export function syncFromSession(user: SessionUser): RaldIdentity {
  const rawUsername =
    user.username ??
    user.email?.split("@")[0] ??
    "rald_user";
  const clean = rawUsername.toLowerCase().replace(/^@/, "");

  const displayName =
    user.display_name ||
    user.name ||
    clean.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const identity: RaldIdentity = {
    username:      clean,
    displayName,
    phone:         user.phone_number,
    email:         user.email,
    emailVerified: !!user.email,
    createdAt:     user.created_at ?? new Date().toISOString(),
    twoFactor:     user.two_factor ?? false,
    avatar:        user.avatar_url ?? undefined,
  };
  saveIdentity(identity);
  return identity;
}
