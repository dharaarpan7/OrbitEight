import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

/**
 * Discoveries page hero — same cinematic language as the Explore hero but
 * mirrored: the type sits right, the warm glow rises from the lower left,
 * and the nebula glare photo backs the type where Explore carries the star
 * funnel. One page opens left-to-right, the other right-to-left, so the
 * pair reads as chapters of one book rather than clones.
 */
export function DiscoveriesHero() {
  return (
    <section className="relative overflow-hidden bg-void">
      {/* Photographic backdrop — the nebula glare, dimmed so the type carries. */}
      <img
        src="/images/heroes/discoveries-hero-1920.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />
      {/* Warm light low and left, a cold breath low and right. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 32% at 24% 88%, rgba(245, 166, 35, 0.10), transparent 70%), radial-gradient(ellipse 40% 30% at 80% 92%, rgba(168, 98, 20, 0.06), transparent 70%)",
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

      <div className="relative mx-auto flex min-h-[78svh] w-full max-w-content flex-col justify-end px-6 pb-24 pt-36 sm:px-10 md:min-h-[720px] lg:px-20">
        <Reveal className="md:ml-auto md:max-w-2xl md:text-right">
          <p className="eyebrow">The record</p>
          <h1 className="mt-6 font-heading text-h1 font-light leading-[1.05] text-white">
            Discover what's beyond.
          </h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-secondary md:ml-auto">
            The universe is constantly revealing something new.
          </p>
        </Reveal>

        <Reveal delay={200} className="md:ml-auto md:max-w-2xl md:text-right">
          <p className="mt-16 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-tertiary md:mt-24 md:justify-end">
            Read the record
            <ChevronDown aria-hidden="true" className="h-4 w-4 animate-bounce text-solar-flare/70" />
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default DiscoveriesHero;
