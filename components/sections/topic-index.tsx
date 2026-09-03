"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { topics } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";

/**
 * The subject index — the Explore page's archive, redesigned as a numbered
 * table of contents (01–12). Large typographic rows: the number and title
 * carry the row at rest; the description and arrow surface on hover.
 * Readable, searchable, and quiet — a curated index, not a card grid.
 */
export function TopicIndex() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      {/* Search — quiet, pill-shaped, on-brand */}
      <div className="relative max-w-md">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-tertiary"
        />
        <label htmlFor="topic-search" className="sr-only">
          Search topics
        </label>
        <input
          id="topic-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the archive"
          className="w-full rounded-full border border-ash bg-surface py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-tertiary focus:border-burnt-amber/60 focus:outline-none"
        />
      </div>

      {/* The index itself */}
      {filtered.length > 0 ? (
        <ol className="mt-10 divide-y divide-ash/40 border-y border-ash/40">
          {filtered.map((topic, i) => (
            <li key={topic.slug}>
              <Reveal delay={Math.min(i * 40, 240)}>
                <Link
                  href="/discoveries"
                  className="group flex items-center gap-6 py-7 transition-colors md:gap-10"
                >
                  {/* Topic thumbnail — every subject ships a photographed
                      640px webp now (see scripts/optimize-images.mjs). */}
                  <img
                    src={topic.image}
                    alt=""
                    aria-hidden="true"
                    className="hidden h-16 w-24 shrink-0 rounded-lg border border-ash/60 object-cover transition-colors duration-300 group-hover:border-burnt-amber/50 sm:block"
                  />
                  <span
                    aria-hidden="true"
                    className="font-heading text-sm tabular-nums tracking-[0.15em] text-tertiary transition-colors duration-300 group-hover:text-solar-flare"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-heading text-2xl font-light text-white transition-colors duration-500 group-hover:text-solar-flare/90 sm:text-3xl md:text-4xl">
                      {topic.title}
                    </span>
                    <span className="mt-2 block max-w-xl text-sm leading-relaxed text-tertiary transition-opacity duration-500 md:opacity-60 md:group-hover:opacity-100">
                      {topic.description}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 -translate-x-2 text-tertiary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-solar-flare group-hover:opacity-100"
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-12 text-sm text-secondary" role="status">
          Nothing in the archive matches “{query.trim()}”. Try a broader word —
          star, planet, light.
        </p>
      )}
    </div>
  );
}

export default TopicIndex;
