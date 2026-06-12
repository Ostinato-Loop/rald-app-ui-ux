// RALD App — src/lib/auth.ts
// Session management against auth.rald.cloud.
// RALD is native-auth only — no Google, Apple, or third-party identity providers.
//
// FIX (session-response): SessionResult used ok:boolean but auth.rald.cloud/session
//   returns valid:boolean. Every SSO callback was clearing the token and bouncing
//   the user back to the landing page — no one could log in.
//
// FIX (profile-hydration): validateSession now calls GET /profiles/me after the
//   /session check to get the full profile (username, display_name, phone, avatar).
//   The /session endpoint only returns {id, email, role} — not enough to build an
//   identity. syncFromSession was calling user.username.toLowerCase() on undefined.
//
// LILCKY STUDIO LIMITED

const AUTH_BASE = "https://auth.rald.cloud";
export const TOKEN_KEY = "rald.auth.token";

/* ── Token storage ────────────────────────────────────────────── */

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function storeToken(token: string): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(TOKEN_KEY, token); } catch { /* noop */ }
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(TOKEN_KEY); } catch { /* noop */ }
}

/* ── Types ────────────────────────────────────────────────────── */

/**
 * Shape returned by GET /profiles/me on auth.rald.cloud.
 * The /session endpoint only returns {id, email, role} — not enough to
 * build an identity. We always fetch /profiles/me after session validation
 * to get username, display_name, phone, avatar, etc.
 */
export type SessionUser = {
  /** RALD user UUID */
  id:              string;
  /** @username (from auth_users.username) */
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
  rald_id?:        string;
};

export type SessionResult = {
  /** true when the token is valid and not revoked */
  valid: boolean;
  user?: SessionUser;
};

/* ── API ──────────────────────────────────────────────────────── */

/**
 * Validate a RALD bearer token and hydrate the full profile.
 *
 * Two-step:
 *   1. GET /session       → fast token check (KV — no DB round-trip)
 *   2. GET /profiles/me   → full profile: username, display_name, phone, avatar
 *
 * Returns null on network error (fail-open so offline users aren't locked out).
 *
 * FIX: Previously called GET /session and read `result.ok` (undefined) — the
 * endpoint returns `valid`. Also previously used only /session which returns
 * {id,email,role} — no username — causing a TypeError in syncFromSession.
 */
export async function validateSession(token: string): Promise<SessionResult | null> {
  try {
    // Step 1 — fast token validation (KV-backed, no DB)
    const sessionRes = await fetch(`${AUTH_BASE}/session`, {
      headers:     { Authorization: `Bearer ${token}` },
      credentials: "omit",
    });
    if (!sessionRes.ok) return { valid: false };

    const sessionData = await sessionRes.json() as { valid?: boolean };
    if (!sessionData.valid) return { valid: false };

    // Step 2 — fetch full profile for identity hydration
    // /profiles/me returns username, display_name, phone_number, avatar_url, etc.
    const profileRes = await fetch(`${AUTH_BASE}/profiles/me`, {
      headers:     { Authorization: `Bearer ${token}` },
      credentials: "omit",
    });
    if (!profileRes.ok) {
      // Token is valid but profile unavailable (e.g. first-time provisioning in progress)
      // Return valid:true with no user — callers will show a spinner / retry.
      return { valid: true };
    }

    const profile = await profileRes.json() as SessionUser;
    return { valid: true, user: profile };
  } catch {
    return null;
  }
}

/**
 * Revoke a RALD bearer token (best-effort — never throws).
 * Called on sign-out and account deletion.
 */
export async function revokeSession(token: string): Promise<void> {
  try {
    await fetch(`${AUTH_BASE}/logout`, {
      method:      "POST",
      headers:     { Authorization: `Bearer ${token}` },
      credentials: "omit",
    });
  } catch { /* best-effort */ }
}

/* ── Auth URL builder ─────────────────────────────────────────── */

const APP_ORIGIN = "https://app.rald.cloud";

/**
 * Build the profiles.rald.cloud URL to start a RALD auth flow.
 * After success, profiles.rald.cloud redirects back to app.rald.cloud with ?rald_token=
 *
 * @param path            - "/" for new identity, "/login" for returning user
 * @param prefillUsername - optional username to pre-fill in the login form
 */
export function getAuthUrl(
  path: "/" | "/login" = "/",
  prefillUsername?: string,
): string {
  const params = new URLSearchParams({ redirect_to: APP_ORIGIN, app_id: "rald-app" });
  if (prefillUsername) params.set("username", prefillUsername);
  return `https://profiles.rald.cloud${path}?${params.toString()}`;
}
