import { SectionHeader } from "@/components/ui/section-header";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";

/**
 * Home — "Testimonials" (websitePrompt.md): the supplied locked component,
 * integrated after visitors understand what Orbit Eight is. Visually
 * restrained — a header, the component, nothing else.
 */
export function TestimonialsSection() {
  return (
    <section className="border-t border-ash/60 bg-surface/40">
      <div className="mx-auto w-full max-w-content px-6 pt-24 sm:px-10 md:pt-32 lg:px-20">
        <SectionHeader
          eyebrow="The community, in their words"
          title="Wonder, shared."
          lede="Members of Orbit Eight on what the community gives them."
        />
      </div>
      <div className="mt-12">
        <StaggerTestimonials />
      </div>
    </section>
  );
}
