import { featuredDiscovery } from "@/lib/data";
import { SectionHeader } from "@/components/ui/section-header";
import { FeaturedDiscovery } from "@/components/cards/featured-discovery";

/**
 * Home — "Featured discovery" (websitePrompt.md): one important discovery,
 * large cinematic visual + editorial text. Closer to a premium scientific
 * magazine feature than a blog card.
 */
export function FeaturedDiscoverySection() {
  return (
    <section className="mx-auto w-full max-w-content px-6 py-24 sm:px-10 md:py-32 lg:px-20">
      <SectionHeader
        eyebrow="Featured discovery"
        title="Somewhere, light is still arriving."
      />
      <div className="mt-12">
        <FeaturedDiscovery discovery={featuredDiscovery} />
      </div>
    </section>
  );
}
