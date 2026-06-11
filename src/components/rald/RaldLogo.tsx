import raldLogo from "@/assets/rald-logo.png";
import { cn } from "@/lib/utils";

export function RaldLogo({
  size = 72,
  float = false,
  className,
}: {
  size?: number;
  float?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(float && "animate-float", className)}>
      <img
        src={raldLogo}
        width={size}
        height={(size * 291) / 620}
        alt="RALD"
        draggable={false}
        className="block select-none object-contain"
      />
    </div>
  );
}

/** Compact wordmark used in headers. */
export function RaldWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src={raldLogo}
        alt="RALD"
        width={40}
        height={19}
        draggable={false}
        className="block h-5 w-auto select-none object-contain"
      />
    </div>
  );
}
