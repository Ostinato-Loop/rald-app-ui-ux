import "./lib/error-capture";
  import { consumeLastCapturedError } from "./lib/error-capture";
  import { renderErrorPage } from "./lib/error-page";

  type ServerEntry = {
    fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
  };

  // ── Google-grade security headers applied to every response ──────────────────
  const SEC: Record<string, string> = {
    "Strict-Transport-Security":
      "max-age=31536000; includeSubDomains; preload",
    "Content-Security-Policy":
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com data:; " +
      "img-src 'self' data: blob:; " +
      "connect-src 'self' https://auth.rald.cloud; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self' https://profiles.rald.cloud;",
    "X-Frame-Options":           "DENY",
    "X-Content-Type-Options":    "nosniff",
    "Referrer-Policy":           "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()",
    "Cross-Origin-Opener-Policy": "same-origin",
  };

  function withSecurity(response: Response): Response {
    const headers = new Headers(response.headers);
    for (const [k, v] of Object.entries(SEC)) headers.set(k, v);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  let serverEntryPromise: Promise<ServerEntry> | undefined;

  async function getServerEntry(): Promise<ServerEntry> {
    if (!serverEntryPromise) {
      serverEntryPromise = import("@tanstack/react-start/server-entry").then(
        (m) => (m.default ?? m) as ServerEntry,
      );
    }
    return serverEntryPromise;
  }

  async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
    if (response.status < 500) return response;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return response;

    const body = await response.clone().text();
    if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
      return response;
    }

    console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  export default {
    async fetch(request: Request, env: unknown, ctx: unknown) {
      try {
        const handler  = await getServerEntry();
        const response = await handler.fetch(request, env, ctx);
        const safe     = await normalizeCatastrophicSsrResponse(response);
        return withSecurity(safe);
      } catch (error) {
        console.error(error);
        return withSecurity(
          new Response(renderErrorPage(), {
            status: 500,
            headers: { "content-type": "text/html; charset=utf-8" },
          }),
        );
      }
    },
  };
  