import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Topic } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";
import { EditorialImage } from "@/components/ui/editorial-image";

/**
 * Topic card — websitePrompt.md "Explore the cosmos": topic, short
 * description, explore interaction, subtle hover motion. Stays within the
 * Orbit Eight palette; no per-category colors.
 */
export function TopicCard({
  topic,
  delay = 0,
}: {
  topic: Topic;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/explore#${topic.slug}`}
        className="group flex h-full flex-col justify-between rounded-2xl border border-ash/60 bg-surface p-6 transition-all duration-500 hover:border-burnt-amber/50 hover:bg-surface/80"
      >
        <EditorialImage
          src={topic.image}
          className="pointer-events-none h-32 w-full rounded-xl"
        />
        <div className="mt-6">
          <h3 className="font-heading text-xl font-normal text-white">
            {topic.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            {topic.description}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-tertiary transition-colors group-hover:text-solar-flare">
            Explore
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
