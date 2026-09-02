"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

/**
 * Spline scene as a decorative hero backdrop. Per the spline-3d-integration
 * skill: the ~500 KB runtime is lazy-loaded client-only (next/dynamic with
 * ssr:false — the runtime touches `window`), the container is purely
 * decorative (aria-hidden, pointer-events-none) so the page stays fully
 * interactive, and the scene fades in once loaded instead of popping.
 * The scene is self-hosted under /spline/ rather than fetched from
 * prod.spline.design (skill CORS/reliability recommendation).
 */
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

export function SplineBackground({ scene }: { scene: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      aria-hidden="true"
      data-spline-background=""
      className="pointer-events-none absolute inset-0"
    >
      <div
        data-spline-canvas=""
        className={`h-full w-full transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <Spline
          scene={scene}
          onLoad={() => setLoaded(true)}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
