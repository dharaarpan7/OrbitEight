import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { SplineCanvas } from "./spline-canvas";

/**
 * The Spline scene is forced onto the WebGL backend (`renderer: "webgl"`)
 * because the runtime's auto-selection picks three.js WebGPURenderer in any
 * WebGPU-capable browser, which hits the destroyed-ShadowDepthTexture
 * GPUValidationError (three.js#34301). These tests pin the integration to
 * the runtime's documented public option — the WebGL pipeline — and verify
 * the Application lifecycle (load, onLoad, dispose) that react-spline used
 * to provide.
 */

const loadMock = vi.fn().mockResolvedValue(undefined);
const disposeMock = vi.fn();
const applicationMock = vi.fn().mockImplementation(() => ({
  load: loadMock,
  dispose: disposeMock,
}));

vi.mock("@splinetool/runtime", () => ({
  Application: applicationMock,
}));

describe("SplineCanvas", () => {
  beforeEach(() => {
    applicationMock.mockClear();
    loadMock.mockClear();
    disposeMock.mockClear();
  });

  it("constructs the runtime Application with the WebGL renderer forced", async () => {
    render(<SplineCanvas scene="/spline/contact-hero.splinecode" />);

    await waitFor(() => {
      expect(applicationMock).toHaveBeenCalledTimes(1);
    });

    const [canvas, options] = applicationMock.mock.calls[0];
    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(options).toEqual(expect.objectContaining({ renderer: "webgl" }));
  });

  it("loads the given scene into the runtime", async () => {
    render(<SplineCanvas scene="/spline/contact-hero.splinecode" />);

    await waitFor(() => {
      expect(loadMock).toHaveBeenCalledWith("/spline/contact-hero.splinecode");
    });
  });

  it("notifies onLoad once the scene has finished loading", async () => {
    const onLoad = vi.fn();
    render(
      <SplineCanvas scene="/spline/contact-hero.splinecode" onLoad={onLoad} />
    );

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });
  });

  it("does not notify onLoad when the scene fails to load", async () => {
    loadMock.mockRejectedValueOnce(new Error("network"));
    const onLoad = vi.fn();
    render(
      <SplineCanvas scene="/spline/contact-hero.splinecode" onLoad={onLoad} />
    );

    // Effect has run and load rejected — onLoad must stay silent.
    await waitFor(() => {
      expect(loadMock).toHaveBeenCalled();
    });
    expect(onLoad).not.toHaveBeenCalled();
  });

  it("disposes the runtime Application on unmount", async () => {
    const { unmount } = render(
      <SplineCanvas scene="/spline/contact-hero.splinecode" />
    );

    await waitFor(() => {
      expect(applicationMock).toHaveBeenCalledTimes(1);
    });
    unmount();

    expect(disposeMock).toHaveBeenCalledTimes(1);
  });
});
