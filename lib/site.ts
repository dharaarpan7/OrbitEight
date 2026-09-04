/** Site-wide constants — navigation, brand, contact routing. */

export const site = {
  name: "Orbit Eight",
  /** Canonical origin — OpenGraph/canonical URLs resolve against it. */
  url: "https://orbiteight.vercel.app",
  tagline: "A place for people who look beyond Earth.",
  description:
    "Orbit Eight is a space enthusiast community for those who never stopped looking up. Astronomy, astrophotography, discoveries, and the universe beyond.",
  /** The inbox the Formspree endpoint forwards contact submissions to. */
  email: "dharaarpan7@protonmail.com",
  /** Contact form endpoint — Formspree. The dashboard forwards submissions
      to the inbox; the form POSTs FormData directly (see ContactForm). */
  contactFormEndpoint: "https://formspree.io/f/xkjnzobz",
  socials: [
    { label: "X", href: "https://x.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Discoveries", href: "/discoveries" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Per-page SEO — websitePrompt.md SEO section. */
export const pageMeta = {
  home: {
    title: "Orbit Eight — Explore Beyond the Known",
    description:
      "A space enthusiast community for people who look beyond Earth. Astronomy, astrophotography, discoveries, and the universe beyond.",
  },
  explore: {
    title: "Orbit Eight — Explore the Cosmos",
    description:
      "From the smallest worlds to the largest structures in the universe, there is always more to understand.",
  },
  discoveries: {
    title: "Orbit Eight — Discoveries",
    description:
      "New findings, observations, scientific developments, phenomena, and explainers from the universe beyond.",
  },
  about: {
    title: "Orbit Eight — About",
    description:
      "Why Orbit Eight exists, what it represents, and who it is for. A community built around curiosity, discovery, and the universe.",
  },
  contact: {
    title: "Orbit Eight — Contact",
    description:
      "Get in touch with Orbit Eight — general, community, partnership, media, collaboration, and support inquiries.",
  },
} as const;
