"use client";

import * as React from "react";
import { BlackHoleHeroSection } from "@/components/ui/blackhole-hero-section";

/**
 * The reading half of the About hero. The engine behind it paints the hole
 * high and to the right on wide screens — leaving this column clear — and low
 * on narrow ones, where the copy stacks above it under a scrim.
 *
 * The engine props follow the supplied demo's responsive pattern: the disc
 * carries the brand solar-flare tone, and narrow screens take a cheaper,
 * tighter framing.
 */

/** True when the viewport matches, or false when matchMedia is unavailable (SSR). */
function useNarrow(query: string): boolean {
  const [narrow, setNarrow] = React.useState(false);

  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(query);
    const update = () => setNarrow(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return narrow;
}

/**
 * True while the page is scrolling (plus a short cooldown after it stops).
 *
 * The black hole raymarches every ray, every frame — hundreds of steps per
 * pixel — and that work competes with scrolling for the frame budget. While
 * this is true the hero asks the engine for a much cheaper ray budget and
 * restores it a moment after scrolling settles, through the engine's public
 * props.
 *
 * `steps` is the only dial this may touch. It feeds a uniform and takes
 * effect on the next frame, leaving the render targets and the temporal
 * average untouched. The resolution/maxDpr route (forcing a resize with a
 * 1px border to trip the engine's ResizeObserver) was tried and removed:
 * every resize drops the render targets and resets the accumulated history
 * (`settled = 0`), so a single low-resolution sample lands on screen at
 * full weight, twice per scroll burst — once to cheapen, once to restore.
 * That pop is the flicker.
 */
function useScrolling(cooldownMs = 200): boolean {
  const [scrolling, setScrolling] = React.useState(false);

  React.useEffect(() => {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return; // nothing moves; nothing needs throttling
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      setScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => setScrolling(false), cooldownMs);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, [cooldownMs]);

  return scrolling;
}

/** Ray budget and render scale, rebalanced for weak GPUs.
 *
 * Measured on this project's reference machine (Intel HD 520): 300 steps at
 * 0.7 resolution renders at ~120ms/frame — the shader is beautiful and the
 * GPU is not. 240 steps at 0.6 keeps the look (temporal accumulation and
 * bloom hide the softer scene target) at roughly half the cost.
 *
 * While scrolling the ray budget drops to the engine's floor: a uniform-only
 * change, so the accumulated image history survives and the frame never
 * pops. Resolution and maxDpr stay fixed at all times — see useScrolling.
 */
const REST_STEPS = { wide: 240, narrow: 180 };
const SCROLL_STEPS = 90;
const REST_RESOLUTION = { wide: 0.6, narrow: 0.5 };

export function AboutHero() {
  const narrow = useNarrow("(max-width: 767px)");
  const scrolling = useScrolling();

  return (
    <section className="relative isolate">
      <BlackHoleHeroSection
        midColor="#F5A623"
        focus={narrow ? [0.5, 0.76] : [0.72, 0.46]}
        scrim={narrow ? "top" : "left"}
        elevation={narrow ? -7 : -5.5}
        fov={narrow ? 58 : 42}
        glow={narrow ? 0.85 : 1}
        steps={scrolling ? SCROLL_STEPS : narrow ? REST_STEPS.narrow : REST_STEPS.wide}
        resolution={narrow ? REST_RESOLUTION.narrow : REST_RESOLUTION.wide}
        maxDpr={1.75}
        className="absolute inset-0"
      >
        <div className="relative mx-auto flex min-h-[92svh] w-full max-w-content flex-col justify-center px-6 pt-32 pb-24 md:min-h-[720px] md:px-10">
          <div className="max-w-xl">
            <p className="eyebrow">About</p>
            <h1 className="mt-6 font-heading text-h1 leading-[1.05] text-white">
              A place for people who look beyond Earth.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-secondary">
              Orbit Eight is a community of space enthusiasts — possessed by
              wonder, and careful with it.
            </p>
          </div>
        </div>
      </BlackHoleHeroSection>
    </section>
  );
}

export default AboutHero;
