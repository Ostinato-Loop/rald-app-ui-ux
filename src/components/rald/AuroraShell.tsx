import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Centered single-column shell with ambient aurora orbs.
 * Used for onboarding / auth screens (mobile-first, matches RALD identity flow).
 */
export function AuroraShell({
  children,
  progress,
  className,
}: {
  children: ReactNode;
  /** 0-5 step pips, omit to hide */
  progress?: { total: number; done: number };
  className?: string;
}) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background">
      {/* ambient aurora */}
      <div
        aria-hidden
        className="aurora-orb animate-float"
        style={{
          width: 360,
          height: 360,
          top: -120,
          right: -100,
          background:
            "radial-gradient(circle, oklch(0.52 0.15 150 / 0.16), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="aurora-orb"
        style={{
          width: 280,
          height: 280,
          bottom: -60,
          left: -80,
          background:
            "radial-gradient(circle, oklch(0.78 0.14 80 / 0.12), transparent 70%)",
          animation: "rald-float 6s ease-in-out -3s infinite",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[440px] flex-1 flex-col px-6 pb-10 pt-6">
        {progress && (
          <div className="mb-8 flex items-center gap-2" aria-hidden>
            {Array.from({ length: progress.total }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i < progress.done ? "bg-green" : "bg-border",
                )}
              />
            ))}
          </div>
        )}
        <main className={cn("flex flex-1 flex-col", className)}>{children}</main>
      </div>
    </div>
  );
}
