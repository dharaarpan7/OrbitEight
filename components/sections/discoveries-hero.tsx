import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

/**
 * Discoveries page hero — same cinematic language as the Explore hero but
 * mirrored: the type sits right, the warm glow rises from the lower left.
 * One page opens left-to-right, the other right-to-left, so the pair reads
 * as chapters of one book rather than clones.
 */
export function DiscoveriesHero() {
  return (
    <section className="relative overflow-hidden bg-void">
      {/* Deep-space backdrop: warm light low and left, a cold breath low and
          right, stars scattered above the horizon. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 32% at 24% 88%, rgba(245, 166, 35, 0.10), transparent 70%), radial-gradient(ellipse 40% 30% at 80% 92%, rgba(168, 98, 20, 0.06), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1.2px 1.2px at 8% 30%, rgba(255,255,255,0.6) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 22% 15%, rgba(255,243,222,0.5) 50%, transparent 51%)," +
            "radial-gradient(1.4px 1.4px at 36% 26%, rgba(255,255,255,0.75) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 56% 38%, rgba(255,255,255,0.5) 50%, transparent 51%)," +
            "radial-gradient(1.2px 1.2px at 70% 20%, rgba(255,243,222,0.65) 50%, transparent 51%)," +
            "radial-gradient(1px 1px at 85% 34%, rgba(255,255,255,0.55) 50%, transparent 51%)," +
            "radial-gradient(1.3px 1.3px at 95% 15%, rgba(255,255,255,0.6) 50%, transparent 51%)",
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
