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
 *
 * SplineCanvas (not react-spline) renders the scene: react-spline exposes no
 * renderer option and no way to bind events globally, both of which this scene
 * needs — it only draws on the runtime's webgpu node-material pipeline, and
 * because this wrapper is pointer-events-none its cursor-driven rig has to
 * listen on the document. See spline-canvas.tsx for the full rationale.
 */
const SplineCanvas = dynamic(() => import("./spline-canvas"), {
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
        <SplineCanvas
          scene={scene}
          onLoad={() => setLoaded(true)}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
