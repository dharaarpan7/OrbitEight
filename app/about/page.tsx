import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { AboutHero } from "@/components/sections/about-hero";
import { AboutStory } from "@/components/sections/about-story";
import { CTASection } from "@/components/sections/cta-section";

export const metadata: Metadata = {
  title: pageMeta.about.title,
  description: pageMeta.about.description,
  openGraph: {
    title: pageMeta.about.title,
    description: pageMeta.about.description,
  },
};

/**
 * About — websitePrompt.md "PAGE 4 — ABOUT": who we are and why we exist.
 * The page opens on the raymarched black hole (the locked hero supplied in
 * about_section.md), then bridges into the editorial story below.
 */
export default function AboutPage() {
  return (
    <>
      <AboutHero />

      <AboutStory />

      <CTASection
        title="Look up with us."
        lede="The community is open to anyone the sky has ever kept awake at night."
        primary={{ text: "Join Orbit Eight", href: "/contact" }}
        secondary={{ text: "Explore the cosmos", href: "/explore" }}
      />
    </>
  );
}
