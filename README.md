# 🪐 Orbit Eight

> ✨ *"A place for people who look beyond Earth."*

**Orbit Eight** is a space-enthusiast community website covering astronomy, astrophotography, discoveries, and the universe beyond. Built as a modern, fully-typed Next.js application with an editorial design, interactive 3D hero backgrounds, and a comprehensive test suite.

---

https://github.com/user-attachments/assets/475751cd-34c7-4635-82d6-4ef0443945c6


## 📑 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📖 Available Scripts](#-available-scripts)
- [🧪 Testing](#-testing)
- [📁 Project Structure](#-project-structure)
- [📄 Pages](#-pages)
- [🖼️ Image Optimization](#️-image-optimization)
- [🎨 Customization](#-customization)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

- 🌌 **Interactive 3D & shader heroes** — Spline 3D scenes and animated WebGL shader backgrounds on key landing pages
- 📚 **Rich editorial content** — typed, in-file content layer (`lib/data.ts`) covering topics, discoveries, phenomena, and explainers
- 🔍 **Topic browser** — explore astronomy, astrophysics, cosmology, the solar system, planets, exoplanets, and more
- 📰 **Discoveries feed** — dated entries with categories, summaries, and reading times
- 📧 **Contact routing** — contact form with categorized inquiry routing (general, community, partnership, media, collaboration, support)
- 🖼️ **Optimized imagery** — local WebP variants generated with `sharp`, plus remote NASA/ESA public-domain imagery allowlisted in the Next.js config
- 🔎 **SEO-ready** — per-page metadata, Open Graph tags, and semantic HTML throughout
- ♿ **Accessible by default** — semantic landmarks (`main#main`), keyboard-friendly navigation
- 🧪 **Fully tested** — Vitest + React Testing Library with coverage tracking on all pages and key components

## 🛠️ Tech Stack

| Category      | Technology                                                                 |
| ------------- | -------------------------------------------------------------------------- |
| ⚙️ Framework  | [Next.js](https://nextjs.org) (App Router, Turbopack)                      |
| ⚛️ UI         | [React 19](https://react.dev)                                              |
| 🟦 Language   | [TypeScript](https://www.typescriptlang.org)                               |
| 🎨 Styling    | [Tailwind CSS](https://tailwindcss.com) + `clsx` / `tailwind-merge`        |
| 🧊 3D         | [@splinetool/react-spline](https://spline.design)                          |
| 🖼️ Fonts      | Inter (body) + Playfair Display (display) via `next/font`                  |
| 🧪 Testing    | [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) + jsdom |
| 📸 Imaging    | [sharp](https://sharp.pixelplumbing.com)                                   |
| 🔣 Icons      | [lucide-react](https://lucide.dev)                                        |

## 🚀 Getting Started

### 📋 Prerequisites

- 🟢 **Node.js** ≥ 18.18 (recommended: 20+)
- 📦 **npm** (comes with Node.js)

> 💡 **Windows note:** the Vitest config uses the `threads` pool because the `forks` pool times out on Windows — no extra setup needed, it just works.

### ⚙️ Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd OrbitEight

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

## 📖 Available Scripts

| Command                 | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `npm run dev`           | 🧑‍💻 Start the development server (with Turbopack) |
| `npm run build`         | 🏗️ Create a production build                      |
| `npm start`             | ▶️ Serve the production build                     |
| `npm test`              | ✅ Run the full test suite once                   |
| `npm run test:watch`    | 👀 Run tests in watch mode                        |
| `npm run test:coverage` | 📊 Run tests with V8 coverage report              |

## 🧪 Testing

The project uses **Vitest** with a **jsdom** environment and global test APIs (no imports needed for `describe`/`it`/`expect`).

```bash
# Run everything once
npm test

# Watch mode while developing
npm run test:watch

# With coverage (v8 provider, text + json-summary reporters)
npm run test:coverage
```

Test files live next to the code they test, named `*.test.ts(x)`:

- `app/**` — page-level tests (home, explore, discoveries, about, contact, icon)
- `components/**` — component tests (navbar, heroes, cards, sections)
- `lib/**` — data-layer and formatting tests

The `@` path alias maps to the project root, so tests import components as `@/components/...` exactly like the app does.

## 📁 Project Structure

```
📦 OrbitEight
├── 📂 app/                      # Next.js App Router pages
│   ├── 📂 about/                # About page
│   ├── 📂 contact/              # Contact page
│   ├── 📂 discoveries/          # Discoveries feed
│   ├── 📂 explore/              # Topic browser
│   ├── 📄 layout.tsx            # Root layout — fonts, navbar, footer, SEO metadata
│   ├── 📄 page.tsx              # Home page
│   ├── 📄 globals.css           # Tailwind base + design tokens
│   └── 📄 icon.svg              # Favicon
├── 📂 components/
│   ├── 📂 cards/                # DiscoveryCard, FeaturedDiscovery, TopicCard
│   ├── 📂 layout/               # Footer
│   ├── 📂 navigation/           # Navbar
│   ├── 📂 sections/             # Page heroes, previews, contact form, etc.
│   └── 📂 ui/                   # Reusable UI — Spline background, shader hero, reveal animations
├── 📂 lib/
│   ├── 📄 data.ts               # ✍️ Typed content layer — topics, discoveries, phenomena, explainers
│   ├── 📄 site.ts               # 🌐 Site constants — brand, nav links, per-page SEO meta
│   ├── 📄 format.ts             # Formatting helpers (dates, reading time)
│   └── 📄 utils.ts              # cn() class merge utility
├── 📂 public/
│   └── 📂 images/               # Optimized WebP imagery + SVG assets
├── 📂 scripts/
│   └── 📄 optimize-images.mjs   # 🖼️ One-off image resizer (see below)
├── 📄 next.config.mjs           # Remote image allowlist + Spline wasm aliases
├── 📄 tailwind.config.ts        # Design tokens — colors, fonts
├── 📄 tsconfig.json
├── 📄 vitest.config.ts          # Test + coverage configuration
└── 📄 vitest.setup.ts           # Testing Library matchers & mocks
```

## 📄 Pages

| Route          | Page          | Description                                                            |
| -------------- | ------------- | ---------------------------------------------------------------------- |
| `/`            | 🏠 Home        | Shader hero, featured discovery, topic & discoveries previews, testimonials, CTA |
| `/explore`     | 🔭 Explore     | Browse all topics — astronomy, astrophysics, cosmology, and more       |
| `/discoveries` | 📰 Discoveries | Latest findings, observations, and explainers with categories & dates  |
| `/about`       | ℹ️ About       | Why Orbit Eight exists, what it represents, and who it's for           |
| `/contact`     | 📬 Contact     | Routed inquiry form — general, community, partnership, media, etc.     |

## 🖼️ Image Optimization

The site never ships the ~780 KB photographic originals. Instead, resized WebP variants are generated alongside each source in `public/images/topics/`:

- `{name}-640.webp` — 🃏 cards and index thumbnails
- `{name}-1920.webp` — 🖥️ full-bleed hero backdrops

Regenerate all variants (idempotent — safe to re-run):

```bash
node scripts/optimize-images.mjs
```

Remote NASA/ESA public-domain imagery is allowlisted in `next.config.mjs` under `images.remotePatterns`, so those hosts can be swapped into `lib/data.ts` image fields later without component changes.

## 🎨 Customization

- ✍️ **Content** — all editorial content (topics, discoveries, phenomena, explainers) lives in `lib/data.ts`, fully typed. Edit it there; no component changes needed.
- 🌐 **Site identity** — brand name, tagline, email, socials, nav links, and per-page SEO metadata live in `lib/site.ts`.
- 🎨 **Design tokens** — colors (e.g. the `void` background), fonts, and spacing are defined in `tailwind.config.ts` and `app/globals.css`.
- 🧊 **3D scenes** — Spline scenes are wired through `components/ui/spline-background.tsx`; swap the scene URL there.

## 🚢 Deployment

The app is a standard Next.js project and deploys anywhere Next.js runs:

```bash
npm run build   # 🏗️ verify the production build passes
npm start       # ▶️ run it locally in production mode
```

💡 The easiest path is [Vercel](https://vercel.com) — import the repo and it auto-detects Next.js with zero config.

> ⚠️ Before going live, update the placeholder domain in `app/layout.tsx` (`metadataBase`) and the placeholder email in `lib/site.ts`.

## 🤝 Contributing

1. 🍴 Fork / branch off the latest code
2. ✍️ Make your changes — add or update tests alongside them
3. ✅ Run `npm test` and make sure everything passes
4. 🚀 Open a pull request

---

<p align="center">⭐ <em>Built for people who never stopped looking up.</em> 🌠</p>
