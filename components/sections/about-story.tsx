import { Reveal } from "@/components/ui/reveal";

/**
 * About page body — websitePrompt.md "PAGE 4 — ABOUT".
 * No About component was supplied (about_section.md carried the black-hole
 * hero instead), so this content is authored to the brand voice: why Orbit
 * Eight exists, what it represents, who it is for, its philosophy, its
 * vision. Editorial, not corporate: large typography, generous whitespace.
 */
export function AboutStory() {
  return (
    <>
      {/* Bridge: out of the black hole, into the story */}
      <section className="mx-auto w-full max-w-content px-6 pt-24 pb-8 text-center sm:px-10 md:pt-32 lg:px-20">
        <Reveal className="mx-auto max-w-2xl">
          <p className="eyebrow">The eighth orbit</p>
          <h2 className="mt-6 font-heading text-h1 font-light leading-[1.1] text-white">
            Past the edge of the familiar.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-secondary">
            The black hole behind those words is not a picture. It is light,
            traced backwards through curved space until it found its way to
            you — which is rather what this community does with ideas.
          </p>
        </Reveal>
      </section>

      {/* Why Orbit Eight exists */}
      <section className="mx-auto w-full max-w-content px-6 py-24 sm:px-10 md:py-28 lg:px-20">
        <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">Why we exist</p>
            <h2 className="mt-4 font-heading text-h1 font-light leading-[1.1] text-white">
              The universe is larger than memory.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="max-w-xl text-base leading-relaxed text-secondary">
              Orbit Eight began the way most good things do — with a group of
              people standing in the dark, looking at the same point of light,
              arguing happily about what it was.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-secondary">
              Somewhere between that night and this website, the argument
              became a community. The questions got better. The telescopes
              multiplied. What never changed was the starting point: the sky
              is common ground, and curiosity is the only membership fee.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-secondary">
              The name comes from the eighth orbit — the place past the
              familiar seven, the one we are still working toward. It is a
              reminder that exploration has no final address.
            </p>
          </Reveal>
        </div>
      </section>

      {/* What Orbit Eight represents */}
      <section className="bg-surface/40">
        <div
          className="h-px w-full bg-gradient-to-r from-transparent via-solar-flare/40 to-transparent"
          aria-hidden="true"
        />
        <div className="mx-auto w-full max-w-content px-6 py-24 sm:px-10 md:py-28 lg:px-20">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {[
              {
                title: "Curiosity, taken seriously",
                body: "Wonder is not a phase you outgrow. It is a discipline — one you sharpen by asking better questions and refusing easy answers.",
              },
              {
                title: "Science, shared plainly",
                body: "The universe does not require a password. Everything we publish is written to be understood, not to impress.",
              },
              {
                title: "A quiet corner of the internet",
                body: "No noise, no outrage, no algorithmic sky. Just people, patience, and the deep dark between the stars.",
              },
            ].map((value, i) => (
              <Reveal key={value.title} delay={i * 100}>
                <h3 className="font-heading text-h3 font-light text-white">
                  {value.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-secondary">
                  {value.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who it is for + philosophy */}
      <section className="mx-auto w-full max-w-content px-6 py-24 sm:px-10 md:py-28 lg:px-20">
        <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">Who it is for</p>
            <h2 className="mt-4 font-heading text-h2 font-light text-white">
              If you have read this far, it is probably for you.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="max-w-xl text-base leading-relaxed text-secondary">
              Orbit Eight is for the astrophotographer up at 3 a.m. waiting
              for transparency to improve. For the student who wants the
              explanation behind the headline. For the parent answering
              “how big is the universe” at bedtime. For the engineer, the
              teacher, the retired pilot, the kid with binoculars.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-secondary">
              Expertise is welcome and shared freely — but it is not the door.
              The door is interest.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-surface/40">
        <div
          className="h-px w-full bg-gradient-to-r from-transparent via-solar-flare/40 to-transparent"
          aria-hidden="true"
        />
        <div className="mx-auto w-full max-w-content px-6 py-24 text-center sm:px-10 md:py-32 lg:px-20">
          <Reveal className="mx-auto max-w-3xl">
            <p className="eyebrow">Our vision</p>
            <p className="mt-6 font-heading text-h2 font-light leading-snug text-white">
              “Somewhere, something incredible is waiting to be known.”
            </p>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-secondary">
              We want Orbit Eight to be the place where that waiting happens
              together — a community that grows more knowledgeable, more
              welcoming, and more ambitious with every year it looks up.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
