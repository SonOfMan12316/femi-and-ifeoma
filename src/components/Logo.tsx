import Image from "next/image";

type LogoProps = {
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

export function Logo({ size = 48, width, height, className = "", priority = false }: LogoProps) {
  const w = width ?? size;
  const h = height ?? size;

  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: w, height: h }}
    >
      <Image
        src="/uploads/femi-and-ifeoma-wordmark.png"
        alt="Fémi & Ifeoma Cat Café"
        fill
        priority={priority}
        className="object-contain"
        sizes={`${w}px`}
      />
    </span>
  );
}
