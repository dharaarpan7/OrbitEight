import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

/**
 * Final CTA — websitePrompt.md "Final CTA": strong, cinematic, generous
 * negative space. No oversized colorful banner; the quiet carries it.
 */
export function CTASection({
  title = "Keep looking up.",
  lede = "Join a community built around curiosity, discovery, and the universe beyond.",
  primary = { text: "Join Orbit Eight", href: "/contact" },
  secondary = { text: "Explore Orbit Eight", href: "/explore" },
}: {
  title?: string;
  lede?: string;
  primary?: { text: string; href: string };
  secondary?: { text: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden">
      {/* A breath of warm light near the horizon, per the art direction. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 110%, rgba(245, 166, 35, 0.08), transparent 70%)",
        }}
      />
      <div className="mx-auto w-full max-w-content px-6 py-28 text-center sm:px-10 md:py-36 lg:px-20">
        <Reveal className="mx-auto max-w-2xl">
          <h2 className="font-heading text-h1 font-light text-white">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-secondary">
            {lede}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href={primary.href} className="btn-primary">
              {primary.text}
            </Link>
            <Link href={secondary.href} className="btn-secondary">
              {secondary.text}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
