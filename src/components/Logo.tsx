import Image from "next/image";

type LogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function Logo({ size = 48, className = "", priority = false }: LogoProps) {
  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/uploads/femi-and-ifeoma-logo.jpg"
        alt="Fémi & Ifeoma Cat Café"
        fill
        priority={priority}
        className="object-contain"
        sizes={`${size}px`}
      />
    </span>
  );
}
