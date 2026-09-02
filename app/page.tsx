import type { Metadata } from "next";
import Hero from "@/components/ui/animated-shader-hero";
import { pageMeta } from "@/lib/site";
import { IntroSection } from "@/components/sections/intro-section";
import { ExplorePreviewSection } from "@/components/sections/explore-preview-section";
import { FeaturedDiscoverySection } from "@/components/sections/featured-discovery-section";
import { DiscoveriesPreviewSection } from "@/components/sections/discoveries-preview-section";
import { AboutPreviewSection } from "@/components/sections/about-preview-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CTASection } from "@/components/sections/cta-section";

export const metadata: Metadata = {
  title: pageMeta.home.title,
  description: pageMeta.home.description,
  openGraph: {
    title: pageMeta.home.title,
    description: pageMeta.home.description,
  },
};

/**
 * Home — websitePrompt.md "PAGE 1 — HOME": navigation and footer live in
 * the root layout; the section order below follows the prompt exactly.
 */
export default function HomePage() {
  return (
    <>
      <Hero
        headline={{
          line1: "Look beyond",
          line2: "the horizon.",
        }}
        subtitle="Orbit Eight is a space enthusiast community for those who never stopped looking up."
        buttons={{
          primary: { text: "Join Orbit Eight", href: "/contact" },
          secondary: { text: "Explore the cosmos", href: "/explore" },
        }}
      />

      <IntroSection />
      <ExplorePreviewSection />
      <FeaturedDiscoverySection />
      <DiscoveriesPreviewSection />
      <AboutPreviewSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
