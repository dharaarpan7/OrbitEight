import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMeta } from "@/lib/site";
import { topics } from "@/lib/data";
import { ExploreHero } from "@/components/sections/explore-hero";
import { TopicIndex } from "@/components/sections/topic-index";
import { FeaturedDiscovery } from "@/components/cards/featured-discovery";
import { Reveal } from "@/components/ui/reveal";
import { CTASection } from "@/components/sections/cta-section";

export const metadata: Metadata = {
  title: pageMeta.explore.title,
  description: pageMeta.explore.description,
  openGraph: {
    title: pageMeta.explore.title,
    description: pageMeta.explore.description,
  },
};

/**
 * Explore — redesigned around a cinematic CSS-only hero, a full-bleed
 * featured spread, and a numbered subject index. Content and data are
 * unchanged from the websitePrompt.md "PAGE 2 — EXPLORE" brief.
 */
export default function ExplorePage() {
  const cosmology = topics.find((t) => t.slug === "cosmology")!;

  return (
    <>
      <ExploreHero />

      {/* Featured topic — full-bleed editorial spread */}
      <section className="relative bg-surface/40">
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-solar-flare/40 to-transparent"
        />
        <div className="mx-auto w-full max-w-content px-6 py-24 sm:px-10 md:py-32 lg:px-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <Reveal>
              <p className="font-heading text-8xl font-light leading-none text-solar-flare/25">
                01
              </p>
              <p className="eyebrow mt-6">Featured topic</p>
              <h2 className="mt-3 font-heading text-h2 font-light text-white">
                The largest view
              </h2>
              <p className="mt-4 max-w-prose text-base leading-relaxed text-secondary">
                Where does it begin? How does it expand? And how does it end?
                Cosmology treats the universe as a single object — one with a
                history we can measure, model, and slowly understand. Begin
                with the widest view there is.
              </p>
              <Link href="/discoveries" className="btn-secondary mt-8">
                Read about cosmology
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <Reveal delay={150}>
              <FeaturedDiscovery
                discovery={{
                  ...cosmology,
                  category: "Cosmology",
                  date: "",
                  summary:
                    "Beginnings, expansions, possible endings — the universe's whole life story, told from the inside.",
                  readingTime: 9,
                }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Subject index — the numbered archive */}
      <section className="mx-auto w-full max-w-content px-6 py-24 sm:px-10 md:py-32 lg:px-20">
        <Reveal>
          <h2 className="font-heading text-h2 font-light text-white">
            The subjects
          </h2>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-secondary">
            Twelve doors into the universe. Each leads somewhere larger than
            the room it opens from.
          </p>
        </Reveal>
        <div className="mt-10">
          <TopicIndex />
        </div>
      </section>

      <CTASection
        title="There's always more to discover."
        lede="The archive grows with the community that reads it. Add your curiosity to ours."
        primary={{ text: "Join Orbit Eight", href: "/contact" }}
        secondary={{ text: "Read the discoveries", href: "/discoveries" }}
      />
    </>
  );
}
