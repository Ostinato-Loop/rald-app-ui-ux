import { useEffect, useState } from "react";

export type RaldIdentity = {
  username: string;
  displayName: string;
  email?: string;
  phone?: string;
  recoveryEmail?: string;
  createdAt: string;
  twoFactor: boolean;
};

const KEY = "rald.identity";

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
  window.dispatchEvent(new Event("rald-identity-change"));
}

export function clearIdentity() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("rald-identity-change"));
}

export function createIdentity(username: string): RaldIdentity {
  const clean = username.replace(/^@/, "");
  const identity: RaldIdentity = {
    username: clean,
    displayName: clean
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    createdAt: new Date().toISOString(),
    twoFactor: false,
  };
  saveIdentity(identity);
  return identity;
}

/** Reactive hook for the current identity. */
export function useIdentity(): [RaldIdentity | null, boolean] {
  const [identity, setIdentity] = useState<RaldIdentity | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIdentity(loadIdentity());
    setReady(true);
    const handler = () => setIdentity(loadIdentity());
    window.addEventListener("rald-identity-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("rald-identity-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return [identity, ready];
}

export function initials(identity: RaldIdentity): string {
  const parts = identity.displayName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
