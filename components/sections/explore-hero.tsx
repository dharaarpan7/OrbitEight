import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

/**
 * Explore page hero — the redesigned cinematic opening. The star funnel
 * photo (stars spiraling down — "begin the descent") backs the type,
 * dimmed under the same layered CSS glows and vignette. The CSS-only
 * starfield scatter retired when the photo arrived; the site still keeps
 * exactly one WebGL canvas — the About page's black hole.
 */
export function ExploreHero() {
  return (
    <section className="relative overflow-hidden bg-void">
      {/* Photographic backdrop — the star funnel, dimmed so the type carries. */}
      <img
        src="/images/heroes/explore-hero-1920.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />
      {/* A breath of warm light low and right, a cold breath low and left. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 32% at 72% 88%, rgba(245, 166, 35, 0.10), transparent 70%), radial-gradient(ellipse 40% 30% at 18% 92%, rgba(168, 98, 20, 0.06), transparent 70%)",
        }}
      />
      {/* Corner darkening so the type carries. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 40%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[78svh] w-full max-w-content flex-col justify-center px-6 pb-24 pt-36 sm:px-10 md:min-h-[720px] lg:px-20">
        <Reveal>
          <p className="eyebrow">The archive</p>
          <h1 className="mt-6 max-w-3xl font-heading text-h1 font-light leading-[1.05] text-white">
            Explore the cosmos.
          </h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-secondary">
            From the smallest worlds to the largest structures in the
            universe, there is always more to understand.
          </p>
        </Reveal>

        <Reveal delay={200} className="mt-16 md:mt-24">
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-tertiary">
            <ChevronDown aria-hidden="true" className="h-4 w-4 animate-bounce text-solar-flare/70" />
            Begin the descent
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default ExploreHero;
