"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { topics } from "@/lib/data";
import { TopicCard } from "@/components/cards/topic-card";

/**
 * Explore page topic browser (websitePrompt.md "Explore"): filtering,
 * search, and hover previews over the primary topics. Reads like a curated
 * scientific archive, not a database.
 */
export function TopicBrowser() {
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

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((topic, i) => (
            <TopicCard key={topic.slug} topic={topic} delay={i * 60} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-sm text-secondary" role="status">
          Nothing in the archive matches “{query.trim()}”. Try a broader word —
          star, planet, light.
        </p>
      )}
    </div>
  );
}
