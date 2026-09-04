import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { SplineCanvas } from "./spline-canvas";

/**
 * The scene renders only on the runtime's `webgpu` node-material pipeline —
 * forcing `renderer: "webgl"` left every cube unlit and threw
 * "e.layers is not iterable" out of the material-layer builder. So these tests
 * pin three things: no renderer override is passed (the runtime's documented
 * auto-selection stands), the scene is skipped where no WebGPU adapter is
 * granted rather than mounting a canvas that can only render black, and events
 * are bound globally so the cursor-driven rig works through the decorative
 * pointer-events-none wrapper. The runtime's render bundles are also opted out
 * via its `?bundles=off` URL-param surface — with bundles on, a recorded
 * bundle referencing a destroyed ShadowDepthTexture logs an uncaptured WebGPU
 * GPUValidationError on every load (three.js#34301). Plus the Application
 * lifecycle (load, onLoad, dispose) that react-spline used to provide.
 */

const loadMock = vi.fn().mockResolvedValue(undefined);
const disposeMock = vi.fn();
const setGlobalEventsMock = vi.fn();
// The shape the mock Application gives its instances — what the component
// actually touches on the runtime's Application object.
interface MockApplication {
  load: typeof loadMock;
  dispose: typeof disposeMock;
  setGlobalEvents: typeof setGlobalEventsMock;
}
// A class-style mock: `new Application(...)` must work, so use a
// constructable function rather than a plain object factory.
const Application = vi.fn(function (this: MockApplication) {
  this.load = loadMock;
  this.dispose = disposeMock;
  this.setGlobalEvents = setGlobalEventsMock;
});

vi.mock("@splinetool/runtime", () => ({
  Application: Application,
}));

const SCENE = "/spline/contact-hero.splinecode";

// jsdom has no WebGPU; the component probes for an adapter before mounting.
const requestAdapter = vi.fn().mockResolvedValue({});
const setGpu = (value: unknown) =>
  Object.defineProperty(navigator, "gpu", { value, configurable: true });

describe("SplineCanvas", () => {
  beforeEach(() => {
    Application.mockClear();
    loadMock.mockClear();
    disposeMock.mockClear();
    setGlobalEventsMock.mockClear();
    requestAdapter.mockClear();
    setGpu({ requestAdapter });
  });

  afterEach(() => {
    setGpu(undefined);
  });

  it("constructs the runtime Application without overriding the renderer", async () => {
    render(<SplineCanvas scene={SCENE} />);

    await waitFor(() => {
      expect(Application).toHaveBeenCalledTimes(1);
    });

    const [canvas, options] = Application.mock.calls[0] as unknown as [
      HTMLCanvasElement,
      Record<string, unknown>,
    ];
    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    // Leaving `renderer` unset is what selects the webgpu node-material
    // pipeline the scene needs; pinning it to "webgl" is the bug this replaces.
    expect(options).not.toHaveProperty("renderer");
  });

  it("loads the given scene into the runtime", async () => {
    render(<SplineCanvas scene={SCENE} />);

    await waitFor(() => {
      expect(loadMock).toHaveBeenCalledWith(SCENE);
    });
  });

  it("binds events globally so the scene tracks a cursor it never receives", async () => {
    render(<SplineCanvas scene={SCENE} />);

    await waitFor(() => {
      expect(setGlobalEventsMock).toHaveBeenCalledWith(true);
    });
  });

  it("skips the scene entirely when no WebGPU adapter is granted", async () => {
    requestAdapter.mockResolvedValueOnce(null);
    const onLoad = vi.fn();
    render(<SplineCanvas scene={SCENE} onLoad={onLoad} />);

    await waitFor(() => {
      expect(requestAdapter).toHaveBeenCalled();
    });
    // The WebGL fallback cannot draw this scene, so nothing should mount.
    expect(Application).not.toHaveBeenCalled();
    expect(onLoad).not.toHaveBeenCalled();
  });

  it("skips the scene entirely in a browser with no WebGPU at all", async () => {
    setGpu(undefined);
    render(<SplineCanvas scene={SCENE} />);

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(Application).not.toHaveBeenCalled();
  });

  it("notifies onLoad once the scene has finished loading", async () => {
    const onLoad = vi.fn();
    render(<SplineCanvas scene={SCENE} onLoad={onLoad} />);

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });
  });

  it("opts the runtime out of render bundles while the scene loads", async () => {
    // Observed inside the mocked load — the window where the runtime reads
    // its URL params to build the renderer.
    const observed: (string | null)[] = [];
    loadMock.mockImplementationOnce(async () => {
      observed.push(
        new URLSearchParams("").get("bundles"), // shimmed default
        new URLSearchParams("?bundles=rerecord").get("bundles"), // real param wins
        new URLSearchParams("?x=1").get("x"), // other keys untouched
        // An instance NOT built from window.location.search keeps native
        // behavior — the shim must not leak into unrelated param reads
        // (router queries, other components) during the load window.
        new URLSearchParams("?x=1").get("bundles"),
      );
    });

    // No ?bundles= on the test URL — the shim supplies the "off" default.
    expect(new URLSearchParams(window.location.search).get("bundles")).toBeNull();

    render(<SplineCanvas scene={SCENE} />);

    await waitFor(() => {
      expect(observed).toEqual(["off", "rerecord", "1", null]);
    });
  });

  it("restores URLSearchParams.get once the scene has loaded", async () => {
    render(<SplineCanvas scene={SCENE} />);

    await waitFor(() => {
      expect(loadMock).toHaveBeenCalled();
    });

    // After load settles, the prototype is back to answering for itself.
    await waitFor(() => {
      expect(new URLSearchParams("").get("bundles")).toBeNull();
      expect(new URLSearchParams("?bundles=rerecord").get("bundles")).toBe(
        "rerecord",
      );
    });
  });

  it("restores URLSearchParams.get when the scene fails to load", async () => {
    loadMock.mockRejectedValueOnce(new Error("network"));
    render(<SplineCanvas scene={SCENE} />);

    await waitFor(() => {
      expect(loadMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(new URLSearchParams("").get("bundles")).toBeNull();
    });
  });

  it("does not notify onLoad when the scene fails to load", async () => {
    loadMock.mockRejectedValueOnce(new Error("network"));
    const onLoad = vi.fn();
    render(<SplineCanvas scene={SCENE} onLoad={onLoad} />);

    // Effect has run and load rejected — onLoad must stay silent.
    await waitFor(() => {
      expect(loadMock).toHaveBeenCalled();
    });
    expect(onLoad).not.toHaveBeenCalled();
    expect(setGlobalEventsMock).not.toHaveBeenCalled();
  });

  it("disposes the runtime Application on unmount", async () => {
    const { unmount } = render(<SplineCanvas scene={SCENE} />);

    await waitFor(() => {
      expect(Application).toHaveBeenCalledTimes(1);
    });
    unmount();

    expect(disposeMock).toHaveBeenCalledTimes(1);
  });
});
