"use client";

import { useEffect, useRef } from "react";
import type { Application } from "@splinetool/runtime";

/**
 * Spline scene canvas.
 *
 * Renderer is deliberately left unset. The runtime auto-selects its `webgpu`
 * node-material pipeline wherever the browser grants a WebGPU adapter, and
 * falls back to classic `webgl` elsewhere. This scene is authored with node
 * materials driving a cursor-following cloner rig, and it only renders on the
 * node pipeline: forcing `renderer: "webgl"` left all 144 cubes unlit and threw
 * `TypeError: e.layers is not iterable` out of the material-layer builder,
 * which killed the state-transition chain and froze the scene at its rest pose.
 * Measured on a real GPU, hovering moved mean frame luminance 0.04 -> 0.75 on
 * `webgpu` and 0.040 -> 0.041 on `webgl`.
 *
 * Because the WebGL fallback cannot draw this particular scene, we probe for an
 * adapter first and skip the backdrop entirely when there is none, rather than
 * mounting a canvas that can only render black and throw.
 *
 * Events are bound globally. The backdrop wrapper is decorative
 * (aria-hidden, pointer-events-none) and the hero's text column paints over it,
 * so the canvas element itself receives no pointer events at all — with the
 * default canvas-local binding the cursor-following Effector never moves and
 * the scene sits inert no matter where the pointer goes.
 *
 * Render bundles are switched off through the runtime's own `?bundles=off`
 * diagnostics param (there is no Application option for it). With bundles on,
 * the scene's state transitions destroy a shadow-map depth texture that a
 * recorded bundle still references, and three.js logs an uncaptured
 * `GPUValidationError: Destroyed texture [Texture "ShadowDepthTexture"] used in
 * a submit` (three.js#34301) — non-fatal, but it surfaces as a console error
 * on every load. The param is injected by a scoped `URLSearchParams.get` shim
 * around Application construction + load (the runtime reads
 * `window.location.search` when it builds the renderer), so the address bar
 * stays clean and a real `?bundles=` param brought by the visitor wins.
 * Bundles are a command-replay optimization, not a rendering feature: the
 * runtime's own safety valve disables them after 4+ of these errors anyway, so
 * the no-bundle steady state is where it ends up on its own — we just skip the
 * error storm. Verified: with bundles off the console is clean and the hover
 * animation responds exactly as with bundles on.
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

    // Scoped shim that answers `bundles=off` for the runtime's renderer-init
    // URL-param lookup (see header). Non-`bundles` keys and a real `?bundles=`
    // param pass through untouched; the prototype is restored the moment the
    // scene load settles (or the component goes away first).
    const originalGet = URLSearchParams.prototype.get;
    const shim = function (this: URLSearchParams, key: string) {
      const real = originalGet.call(this, key);
      return key === "bundles" && real === null ? "off" : real;
    } as URLSearchParams["get"];
    const unshim = () => {
      if (URLSearchParams.prototype.get === shim) {
        URLSearchParams.prototype.get = originalGet;
      }
    };

    void (async () => {
      // WebGPU isn't in TS's DOM lib yet, and we only need the adapter probe.
      const gpu = (
        navigator as Navigator & {
          gpu?: { requestAdapter(): Promise<unknown> };
        }
      ).gpu;
      const adapter = await gpu?.requestAdapter().catch(() => null);
      if (disposed || !adapter) return;

      // Client-only import: the runtime touches window/WebGL at module and
      // construction time, so it must never evaluate during SSR.
      const { Application } = await import("@splinetool/runtime");
      if (disposed) return;

      URLSearchParams.prototype.get = shim;
      app = new Application(canvas, { renderMode: "auto" });
      try {
        await app.load(scene);
      } catch {
        // Scene failed to load (network, corrupt file) — stay silent and
        // keep the backdrop empty rather than crashing the page.
        return;
      } finally {
        unshim();
      }
      if (disposed) return;

      // Listen on the document, not the canvas: the decorative wrapper is
      // pointer-events-none, so canvas-local events never fire.
      app.setGlobalEvents(true);
      onLoadRef.current?.(app);
    })();

    return () => {
      disposed = true;
      unshim();
      app?.dispose();
    };
  }, [scene]);

  return <canvas ref={canvasRef} className={className} />;
}

export default SplineCanvas;
