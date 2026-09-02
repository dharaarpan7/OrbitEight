import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

/**
 * Section header — eyebrow label, short serif headline, optional lede.
 * Editorial and restrained: left-aligned, generous negative space.
 */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 font-heading text-h2 font-light text-white">
        {title}
      </h2>
      {lede && (
        <p className="mt-4 max-w-prose text-base leading-relaxed text-secondary">
          {lede}
        </p>
      )}
    </Reveal>
  );
}
