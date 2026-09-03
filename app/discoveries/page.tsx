import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { featuredDiscovery, discoveries, phenomena, explainers } from "@/lib/data";
import { DiscoveriesHero } from "@/components/sections/discoveries-hero";
import { FeaturedDiscovery } from "@/components/cards/featured-discovery";
import { DiscoveryCard } from "@/components/cards/discovery-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { CTASection } from "@/components/sections/cta-section";

export const metadata: Metadata = {
  title: pageMeta.discoveries.title,
  description: pageMeta.discoveries.description,
  openGraph: {
    title: pageMeta.discoveries.title,
    description: pageMeta.discoveries.description,
  },
};

/**
 * Discoveries — redesigned as an editorial record: cinematic mirrored hero,
 * magazine spread for the featured story, a timeline feed for the latest
 * findings, then phenomena and explainers. Content and data are unchanged
 * from the websitePrompt.md "PAGE 3 — DISCOVERIES" brief.
 */
export default function DiscoveriesPage() {
  return (
    <>
      <DiscoveriesHero />

      {/* Featured discovery — magazine split spread */}
      <section id={featuredDiscovery.slug} className="relative scroll-mt-24 bg-surface/40">
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-solar-flare/40 to-transparent"
        />
        <div className="mx-auto w-full max-w-content px-6 py-24 sm:px-10 md:py-32 lg:px-20">
          <Reveal>
            <FeaturedDiscovery discovery={featuredDiscovery} />
          </Reveal>
        </div>
      </section>

      {/* Latest discoveries — timeline feed */}
      <section className="mx-auto w-full max-w-content px-6 py-24 sm:px-10 md:py-32 lg:px-20">
        <SectionHeader
          eyebrow="Latest discoveries"
          title="New findings, observations, and developments."
        />

        {/* A vertical hairline carries the record; each entry is a node on
            it. Entries alternate sides of the line. */}
        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-solar-flare/50 via-ash/60 to-transparent md:left-1/2"
          />
          <div className="space-y-16 md:space-y-24">
            {discoveries.map((discovery, i) => (
              <Reveal key={discovery.slug} delay={Math.min(i * 60, 240)}>
                <div
                  id={discovery.slug}
                  className={`relative scroll-mt-24 pl-10 md:w-1/2 md:pl-0 ${
                    i % 2 === 0
                      ? "md:pr-16 md:text-right"
                      : "md:ml-auto md:pl-16"
                  }`}
                >
                  {/* The node on the line */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-2 h-2 w-2 rounded-full bg-solar-flare/80 shadow-[0_0_12px_rgba(245,166,35,0.6)] ${
                      i % 2 === 0
                        ? "left-0 md:-right-1 md:left-auto"
                        : "left-0 md:-left-1"
                    }`}
                  />
                  <DiscoveryCard discovery={discovery} withImage />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Space phenomena — hover-lifting cards */}
      <section className="bg-surface/40">
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-solar-flare/40 to-transparent"
        />
        <div className="mx-auto w-full max-w-content px-6 py-24 sm:px-10 md:py-32 lg:px-20">
          <SectionHeader
            eyebrow="Space phenomena"
            title="Events worth watching for."
            lede="The sky keeps a schedule. Some of it is written down."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {phenomena.map((phenomenon, i) => (
              <Reveal key={phenomenon.slug} delay={i * 60} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-ash/60 bg-void p-6 transition-all duration-500 hover:-translate-y-1 hover:border-burnt-amber/40">
                  {/* A warm corner breathes in on hover */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(ellipse 80% 60% at 85% 0%, rgba(245, 166, 35, 0.08), transparent 70%)",
                    }}
                  />
                  <h3 className="relative font-heading text-xl font-normal text-white">
                    {phenomenon.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-secondary">
                    {phenomenon.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Explainers — large-type Q&A list */}
      <section className="mx-auto w-full max-w-content px-6 py-24 sm:px-10 md:py-32 lg:px-20">
        <SectionHeader
          eyebrow="Explainers"
          title="Questions, answered carefully."
          lede="The ideas behind the headlines, explained without shortcuts."
        />
        <div className="mt-12 divide-y divide-ash/40 border-y border-ash/40">
          {explainers.map((explainer, i) => (
            <Reveal key={explainer.slug} delay={Math.min(i * 60, 240)}>
              <article className="group py-10">
                <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                  <h3 className="font-heading text-2xl font-light leading-snug text-white transition-colors duration-300 group-hover:text-solar-flare/90 sm:text-3xl">
                    {explainer.question}
                  </h3>
                  <span className="text-xs tabular-nums tracking-wide text-tertiary">
                    {explainer.readingTime} min read
                  </span>
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-secondary">
                  {explainer.teaser}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection
        title="The record is still being written."
        lede="Somewhere tonight, something is being observed for the first time. Read along with us."
        primary={{ text: "Join Orbit Eight", href: "/contact" }}
        secondary={{ text: "Explore the subjects", href: "/explore" }}
      />
    </>
  );
}
