import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Discovery } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { Reveal } from "@/components/ui/reveal";

/**
 * Discovery card — editorial feed item: category, date, title, short
 * summary, read more. No card chrome; the typography carries it.
 */
export function DiscoveryCard({
  discovery,
  delay = 0,
  featured = false,
}: {
  discovery: Discovery;
  delay?: number;
  featured?: boolean;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className={featured ? "h-full" : "group h-full"}>
        <Link
          href={`/discoveries#${discovery.slug}`}
          className="flex h-full flex-col"
        >
          {featured && (
            <object
              type="image/svg+xml"
              data={discovery.image}
              aria-hidden="true"
              className="pointer-events-none aspect-[16/9] w-full rounded-xl"
            >
              <img src={discovery.image} alt="" aria-hidden="true" />
            </object>
          )}
          <div className={featured ? "mt-6" : ""}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-tertiary">
              <span className="text-solar-flare/80">{discovery.category}</span>
              {discovery.date && (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={discovery.date}>
                    {formatDate(discovery.date)}
                  </time>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>{discovery.readingTime} min read</span>
            </div>
            <h3
              className={
                featured
                  ? "mt-3 font-heading text-h3 font-light text-white"
                  : "mt-3 font-heading text-xl font-normal leading-snug text-white transition-colors group-hover:text-solar-flare/90"
              }
            >
              {discovery.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              {discovery.summary}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-secondary transition-colors group-hover:text-white">
              Read discovery
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </article>
    </Reveal>
  );
}
