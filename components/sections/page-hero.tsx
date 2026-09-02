import { Reveal } from "@/components/ui/reveal";
import { SplineBackground } from "@/components/ui/spline-background";

/**
 * Shared interior-page hero — quiet typographic opening for Explore,
 * Discoveries, About, and Contact. Generous negative space below the fixed
 * navbar (which is transparent until scroll, so these pages open dark and
 * empty, per the cinematic direction).
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  spline,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  image?: string;
  spline?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      {/* Optional photographic backdrop — dimmed so the type still carries. */}
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}
      {/* Optional Spline 3D backdrop — decorative, lazy-loaded, fades in. */}
      {spline && <SplineBackground scene={spline} />}
      {/* A breath of warm light low on the horizon. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 70% 90%, rgba(245, 166, 35, 0.07), transparent 70%)",
        }}
      />
      <div className="mx-auto w-full max-w-content px-6 pb-16 pt-36 sm:px-10 md:pb-24 md:pt-44 lg:px-20">
        <Reveal>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-4 max-w-3xl font-heading text-h1 font-light leading-[1.1] text-white">
            {title}
          </h1>
          {lede && (
            <p className="mt-6 max-w-prose text-base leading-relaxed text-secondary">
              {lede}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
