import { Reveal } from "@/components/ui/reveal";

/**
 * Home — "Orbit Eight introduction" (websitePrompt.md).
 * What Orbit Eight is, without a corporate About-Us block: an editorial
 * composition — a large serif statement on the left, the interests listed
 * as a quiet reading column on the right. No icon grids.
 */
export function IntroSection() {
  const interests = [
    "Astronomy",
    "Astrophotography",
    "Space science",
    "Cosmic discoveries",
    "Space exploration",
    "Learning",
    "Discussion",
  ];

  return (
    <section className="mx-auto w-full max-w-content px-6 py-24 sm:px-10 md:py-32 lg:px-20">
      <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">The community</p>
          <h2 className="mt-4 font-heading text-h1 font-light leading-[1.1] text-white">
            Space is not just somewhere we look.
            <span className="block text-secondary">
              It is something we explore together.
            </span>
          </h2>
          <p className="mt-6 max-w-prose text-base leading-relaxed text-secondary">
            Orbit Eight brings together people who never stopped looking up —
            observers, photographers, readers, and the simply curious. Some
            own telescopes. Some own only a question. All are welcome under
            the same sky.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <p className="text-xs uppercase tracking-[0.18em] text-tertiary">
            What gathers here
          </p>
          <ul className="mt-5 divide-y divide-ash/60 border-y border-ash/60">
            {interests.map((interest) => (
              <li
                key={interest}
                className="py-3 text-sm text-secondary transition-colors hover:text-white"
              >
                {interest}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
