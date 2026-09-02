import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { topics } from "@/lib/data";
import { SectionHeader } from "@/components/ui/section-header";
import { TopicCard } from "@/components/cards/topic-card";
import { Reveal } from "@/components/ui/reveal";

/**
 * Home — "Explore the cosmos" (websitePrompt.md): a small number of premium
 * topic cards (not a huge grid), each with topic, description, and an
 * explore interaction. Palette stays Orbit Eight throughout.
 */
export function ExplorePreviewSection() {
  const featured = topics.slice(0, 4);

  return (
    <section className="border-t border-ash/60 bg-surface/40">
      <div className="mx-auto w-full max-w-content px-6 py-24 sm:px-10 md:py-32 lg:px-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="The subjects"
            title="Explore the cosmos"
            lede="From the smallest worlds to the largest structures in the universe, there is always more to understand."
          />
          <Reveal delay={100}>
            <Link
              href="/explore"
              className="btn-secondary"
            >
              All subjects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((topic, i) => (
            <TopicCard key={topic.slug} topic={topic} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
