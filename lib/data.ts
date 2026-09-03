/**
 * Content layer — typed, in-file editorial constants.
 * Synthetic brand-voice content per websitePrompt.md. Images are local
 * on-brand visuals (public/images/*); NASA/ESA public-domain URLs can be
 * swapped into the image fields later without component changes.
 */

export interface Topic {
  slug: string;
  title: string;
  description: string;
  image: string;
}

export interface Discovery {
  slug: string;
  category: string;
  date: string; // YYYY-MM-DD; "" when the entry is undated
  title: string;
  summary: string;
  readingTime: number; // minutes
  image: string;
}

export interface Phenomenon {
  slug: string;
  title: string;
  description: string;
}

export interface Explainer {
  slug: string;
  question: string;
  teaser: string;
  readingTime: number;
}

/* --- Topics (Explore page + Home preview) ------------------------------- */

export const topics: Topic[] = [
  {
    slug: "astronomy",
    title: "Astronomy",
    description:
      "The oldest science. Learning to read the sky — its motions, its measure, and its quiet regularity.",
    image: "/images/topics/astronomy-640.webp",
  },
  {
    slug: "astrophysics",
    title: "Astrophysics",
    description:
      "The physics of everything above the atmosphere: how stars shine, how matter falls, how the elements form.",
    image: "/images/topics/astrophysics-640.webp",
  },
  {
    slug: "cosmology",
    title: "Cosmology",
    description:
      "The universe as a single object — its beginning, its expansion, and its eventual fate.",
    image: "/images/topics/cosmology-640.webp",
  },
  {
    slug: "the-solar-system",
    title: "The Solar System",
    description:
      "One star, eight worlds, and the leftover pieces of a formation that has not quite finished.",
    image: "/images/topics/solar-system-640.webp",
  },
  {
    slug: "planets",
    title: "Planets",
    description:
      "Worlds enough to lose count of. How they form, migrate, and sometimes collide.",
    image: "/images/topics/planets-640.webp",
  },
  {
    slug: "exoplanets",
    title: "Exoplanets",
    description:
      "Every star a possible sun. Five thousand known worlds and a method for finding the rest.",
    image: "/images/topics/exoplanets-640.webp",
  },
  {
    slug: "stars",
    title: "Stars",
    description:
      "Furnaces with lifetimes. Born in collapse, sustained by fusion, ending in fire or silence.",
    image: "/images/topics/stars-640.webp",
  },
  {
    slug: "galaxies",
    title: "Galaxies",
    description:
      "Islands of stars bound by dark matter, a hundred billion of them, drifting apart.",
    image: "/images/topics/galaxies-640.webp",
  },
  {
    slug: "black-holes",
    title: "Black holes",
    description:
      "Where geometry wins. Regions of spacetime that bend light, swallow gas, and slow time.",
    image: "/images/topics/black-holes-640.webp",
  },
  {
    slug: "neutron-stars",
    title: "Neutron stars",
    description:
      "A city-sized remnant spinning hundreds of times a second, with a magnetic field to match.",
    image: "/images/topics/neutron-stars-640.webp",
  },
  {
    slug: "astrophotography",
    title: "Astrophotography",
    description:
      "The craft of collecting photons that left their stars before photography was invented.",
    image: "/images/topics/astrophotography-640.webp",
  },
  {
    slug: "space-exploration",
    title: "Space exploration",
    description:
      "Machines we send ahead of us — orbiters, landers, telescopes, and the occasional human.",
    image: "/images/topics/space-exploration-640.webp",
  },
];

/* --- Discoveries (Home preview + Discoveries page) ----------------------- */

export const featuredDiscovery: Discovery = {
  slug: "jwst-early-galaxies",
  category: "Cosmology",
  date: "2026-08-14",
  title: "The galaxies that arrived too early",
  summary:
    "The first deep fields from Webb kept turning up galaxies that seemed too massive, too ordered, too soon after the Big Bang. New observations are starting to explain why — or change what we think the first hundred million years were like.",
  readingTime: 8,
  image: "/images/discoveries/early-galaxies.svg",
};

export const discoveries: Discovery[] = [
  {
    slug: "enceladus-plume-organics",
    category: "Planetary science",
    date: "2026-08-28",
    title: "Enceladus is still venting its ocean",
    summary:
      "Fresh analysis of the plume feeding Saturn's E ring finds complex organics and phosphates — the chemistry of habitability, sampled from orbit.",
    readingTime: 6,
    image: "/images/discoveries/enceladus.svg",
  },
  {
    slug: "fast-radio-burst-repeat",
    category: "Astronomy",
    date: "2026-08-21",
    title: "A fast radio burst with a rhythm",
    summary:
      "A repeater in a nearby galaxy fires on a predictable 22-day cycle. Whatever makes these bursts, this one keeps time.",
    readingTime: 5,
    image: "/images/discoveries/fast-radio-burst-640.webp",
  },
  {
    slug: "europa-ridge-salt",
    category: "Planetary science",
    date: "2026-08-09",
    title: "Salt on Europa's fractured ridge",
    summary:
      "A reprocessed Europa Clipper pass reveals sodium chloride along a dilated ridge — a hint that its ice shell communicates with the ocean below.",
    readingTime: 6,
    image: "/images/discoveries/europa.svg",
  },
  {
    slug: "gravitational-wave-background",
    category: "Astrophysics",
    date: "2026-07-30",
    title: "The hum of supermassive pairs",
    summary:
      "Pulsar timing arrays now agree: spacetime carries a background ripple, most plausibly the chorus of orbiting supermassive black hole binaries.",
    readingTime: 7,
    image: "/images/discoveries/gw-background.svg",
  },
  {
    slug: "interstellar-comet-3i",
    category: "Space exploration",
    date: "2026-07-18",
    title: "A third visitor from another system",
    summary:
      "Only the third interstellar object ever recorded is inbound — faint, fast, and already being watched by every telescope that can see it.",
    readingTime: 4,
    image: "/images/discoveries/interstellar.svg",
  },
  {
    slug: "venus-cloud-map",
    category: "Planetary science",
    date: "2026-07-02",
    title: "Venus, mapped in a new light",
    summary:
      "A year of infrared observation resolves the cloud deck's four-day dance in finer detail than any orbiter has managed in a decade.",
    readingTime: 5,
    image: "/images/discoveries/venus.svg",
  },
];

/* --- Space phenomena (Discoveries page) ---------------------------------- */

export const phenomena: Phenomenon[] = [
  {
    slug: "solar-eclipses",
    title: "Solar eclipses",
    description:
      "The moon's shadow crossing Earth — a coincidence of size and distance that will not last forever.",
  },
  {
    slug: "meteor-showers",
    title: "Meteor showers",
    description:
      "Earth running through the debris trails of comets, twice a year, predictably.",
  },
  {
    slug: "supernovae",
    title: "Supernovae",
    description:
      "The deaths of massive stars — bright enough to outshine their galaxies, brief enough to miss.",
  },
  {
    slug: "aurorae",
    title: "Aurorae",
    description:
      "Solar wind meeting magnetic field: curtains of light over the poles, visible further south than usual this decade.",
  },
  {
    slug: "gravitational-waves",
    title: "Gravitational waves",
    description:
      "Spacetime itself, ringing after a collision of black holes a billion light-years away.",
  },
  {
    slug: "cosmic-collisions",
    title: "Cosmic collisions",
    description:
      "Galaxies passing through one another. Stars almost never touch; the gas always does.",
  },
];

/* --- Explainers (Discoveries page) --------------------------------------- */

export const explainers: Explainer[] = [
  {
    slug: "detect-exoplanets",
    question: "How do we detect exoplanets?",
    teaser:
      "Mostly by watching a star blink, wobble, or bend — three subtle signatures, three Nobel-worthy techniques.",
    readingTime: 6,
  },
  {
    slug: "gravitational-lensing",
    question: "How does gravitational lensing work?",
    teaser:
      "Mass curves spacetime, spacetime curves light. The universe's largest objects are also its best telescopes.",
    readingTime: 7,
  },
  {
    slug: "seeing-the-past",
    question: "Why do we see the past when we look into space?",
    teaser:
      "Light travels fast, but space is vast. Every view of the sky is a view of history — some of it nearly the beginning.",
    readingTime: 5,
  },
  {
    slug: "star-dies",
    question: "What happens when a star dies?",
    teaser:
      "Its mass decides everything: a slow fade, a violent explosion, or a collapse that never finishes.",
    readingTime: 8,
  },
];
