import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

/**
 * Home — "About preview" (websitePrompt.md). The supplied About component
 * is the About page (about_section.md contained no About content — it
 * carried the black-hole hero — so this preview quotes the About page's
 * core message and hands off to it). The transition into the section is
 * intentional: a quiet editorial interlude between the discoveries feed
 * and the testimonials.
 */
export function AboutPreviewSection() {
  return (
    <section className="mx-auto w-full max-w-content px-6 py-24 sm:px-10 md:py-32 lg:px-20">
      <div className="grid items-center gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">About Orbit Eight</p>
          <h2 className="mt-4 font-heading text-h2 font-light text-white">
            A place for people who look beyond Earth.
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <p className="max-w-xl text-base leading-relaxed text-secondary">
            Orbit Eight exists for the ones who stayed curious — who read the
            launch schedule, who photograph what their telescope can barely
            resolve, who understand that every clear night is a window and
            not a ceiling.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-secondary">
            We are not experts only. We are enthusiasts in the original
            sense: possessed by wonder, and careful with it.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-1.5 text-sm text-white transition-colors hover:text-solar-flare"
          >
            Read our story
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
