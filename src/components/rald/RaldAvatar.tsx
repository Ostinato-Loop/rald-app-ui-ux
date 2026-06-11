import { cn } from "@/lib/utils";
import { initials, type RaldIdentity } from "@/lib/identity";

/**
 * Reads a File and returns a square, downscaled data URL so avatars stay
 * small enough for localStorage.
 */
export function fileToAvatar(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas context"));
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function RaldAvatar({
  identity,
  size = 40,
  className,
}: {
  identity: RaldIdentity;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full bg-green font-extrabold text-white",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {identity.avatar ? (
        <img
          src={identity.avatar}
          alt={identity.displayName}
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        initials(identity)
      )}
    </div>
  );
}
