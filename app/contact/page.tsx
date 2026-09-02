import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { pageMeta, site } from "@/lib/site";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/sections/contact-form";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: pageMeta.contact.title,
  description: pageMeta.contact.description,
  openGraph: {
    title: pageMeta.contact.title,
    description: pageMeta.contact.description,
  },
};

/**
 * Contact — websitePrompt.md "PAGE 5 — CONTACT": a premium, inviting page
 * with a contact introduction and the inquiry form. Quieter than the rest
 * of the site — this page's job is to lower the barrier to writing in.
 */
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Say hello."
        lede="Questions, ideas, observations, collaborations — the inbox is open. So is the sky."
        spline="/spline/contact-hero.splinecode"
      />

      <section className="border-t border-ash/60 bg-surface/40">
        <div className="mx-auto grid w-full max-w-content gap-12 px-6 py-24 sm:px-10 md:py-28 lg:grid-cols-[3fr_2fr] lg:gap-20 lg:px-20">
          <Reveal>
            <ContactForm />
          </Reveal>

          {/* Direct channels */}
          <Reveal delay={150}>
            <h2 className="font-heading text-h3 font-light text-white">
              Other ways to reach us
            </h2>
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-tertiary">
                  Email
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-2 inline-flex items-center gap-2 text-sm text-white transition-colors hover:text-solar-flare"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {site.email}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-tertiary">
                  Social
                </p>
                <ul className="mt-2 space-y-2">
                  {site.socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white transition-colors hover:text-solar-flare"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-tertiary">
                  Response time
                </p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-secondary">
                  A few days, usually. We are often outside at night — but we
                  do reply.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
