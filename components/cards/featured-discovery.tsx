import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Discovery } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { Reveal } from "@/components/ui/reveal";
import { EditorialImage } from "@/components/ui/editorial-image";

/**
 * Featured discovery — websitePrompt.md: "large cinematic visual + editorial
 * text" in a premium scientific-magazine composition. The visual dominates;
 * the section is asymmetric rather than a blog card.
 */
export function FeaturedDiscovery({
  discovery,
}: {
  discovery: Discovery;
}) {
  return (
    <Reveal>
      <div className="grid items-center gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
        {/* Cinematic visual — dominant, three-fifths on desktop */}
        <div className="overflow-hidden rounded-2xl border border-ash/60">
          <EditorialImage
            src={discovery.image}
            className="pointer-events-none aspect-[16/10] w-full transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>

        {/* Editorial text */}
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-tertiary">
            <span className="text-solar-flare/90">{discovery.category}</span>
            {/* Featured topics (Explore spread) carry no date — hide the
                metadata rather than print "Invalid Date". */}
            {discovery.date && (
              <>
                <span aria-hidden="true">·</span>
                <time dateTime={discovery.date}>
                  {formatDate(discovery.date)}
                </time>
              </>
            )}
          </div>
          <h3 className="mt-4 font-heading text-h2 font-light leading-tight text-white">
            {discovery.title}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-secondary">
            {discovery.summary}
          </p>
          <Link
            href={`/discoveries#${discovery.slug}`}
            className="btn-secondary mt-8"
          >
            Read discovery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
