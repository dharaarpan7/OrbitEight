import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { discoveries } from "@/lib/data";
import { SectionHeader } from "@/components/ui/section-header";
import { DiscoveryCard } from "@/components/cards/discovery-card";
import { Reveal } from "@/components/ui/reveal";

/**
 * Home — "Latest discoveries preview" (websitePrompt.md): a small selection
 * of discovery stories in an editorial composition — one lead story and a
 * reading column, rather than a conventional three-column blog grid.
 */
export function DiscoveriesPreviewSection() {
  const [lead, ...rest] = discoveries.slice(0, 3);

  return (
    <section className="border-t border-ash/60 bg-surface/40">
      <div className="mx-auto w-full max-w-content px-6 py-24 sm:px-10 md:py-32 lg:px-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Latest discoveries"
            title="The universe is constantly revealing something new."
          />
          <Reveal delay={100}>
            <Link href="/discoveries" className="btn-secondary">
              View all discoveries
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-10 border-t border-ash/60 pt-10 md:grid-cols-[2fr_3fr] md:gap-16">
          {/* Lead story — larger, image-bearing */}
          <DiscoveryCard discovery={lead} featured delay={0} />

          {/* Reading column */}
          <div className="divide-y divide-ash/60">
            {rest.map((discovery, i) => (
              <div key={discovery.slug} className="py-6 first:pt-0 last:pb-0">
                <DiscoveryCard discovery={discovery} delay={(i + 1) * 100} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
