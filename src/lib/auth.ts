// RALD App — src/lib/auth.ts
  // Session management against auth.rald.cloud.
  // RALD is native-auth only — no Google, Apple, or third-party identity providers.

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

  export type SessionUser = {
    username:         string;
    rald_internal_id: string;
    phone?:           string;
    email?:           string;
    display_name?:    string;
    avatar_url?:      string;
    created_at?:      string;
    two_factor?:      boolean;
  };

  export type SessionResult = {
    ok:    boolean;
    user?: SessionUser;
  };

  /* ── API ──────────────────────────────────────────────────────── */

  /**
   * Validate a RALD bearer token against auth.rald.cloud.
   * Returns null on network error (fail-open so offline users aren't locked out).
   */
  export async function validateSession(token: string): Promise<SessionResult | null> {
    try {
      const res = await fetch(`${AUTH_BASE}/session`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "omit",
      });
      if (!res.ok) return null;
      return (await res.json()) as SessionResult;
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
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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
   * @param prefillUsername - optional username to pre-fill (passed as ?username=)
   */
  export function getAuthUrl(
    path: "/" | "/login" = "/",
    prefillUsername?: string,
  ): string {
    const params = new URLSearchParams({ redirect_to: APP_ORIGIN, app_id: "rald-app" });
    if (prefillUsername) params.set("username", prefillUsername);
    return `https://profiles.rald.cloud${path}?${params.toString()}`;
  }
  