"use client";

import { useEffect, useRef } from "react";
import type { Application } from "@splinetool/runtime";

/**
 * Spline scene canvas on a fixed renderer. The runtime's default
 * auto-selection picks three.js WebGPURenderer in any WebGPU-capable
 * browser, which hits "Destroyed texture [ShadowDepthTexture] used in a
 * submit" GPUValidationErrors (three.js#34301). The scene uses no
 * WebGPU-only features, so the documented public `renderer: "webgl"`
 * option pins it to the classic WebGL pipeline — visually identical,
 * validation-error-free.
 *
 * Replaces the react-spline component for this one scene: react-spline
 * (v4.1.0) exposes no renderer option. Same Application lifecycle it
 * provided — construct, load, dispose on unmount — plus explicit load
 * error handling instead of rethrowing into React.
 */
export function SplineCanvas({
  scene,
  onLoad,
  className,
}: {
  scene: string;
  onLoad?: (app: Application) => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Latest callbacks without re-running the load effect — the scene loads
  // once; prop identity changes shouldn't reload it.
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let app: Application | undefined;

    // Client-only import: the runtime touches window/WebGL at module and
    // construction time, so it must never evaluate during SSR.
    import("@splinetool/runtime").then(({ Application }) => {
      if (disposed) return;

      app = new Application(canvas, {
        renderer: "webgl",
        renderMode: "auto",
      });
      app.load(scene).then(
        () => {
          if (!disposed && app) onLoadRef.current?.(app);
        },
        () => {
          // Scene failed to load (network, corrupt file) — stay silent and
          // keep the backdrop empty rather than crashing the page.
        }
      );
    });

    return () => {
      disposed = true;
      app?.dispose();
    };
  }, [scene]);

  return <canvas ref={canvasRef} className={className} />;
}

export default SplineCanvas;
