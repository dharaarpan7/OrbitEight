import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AmbientAudio } from "./ambient-audio";

/** The pathname AmbientAudio gates itself on; each test sets its own. */
let mockPathname = "/";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

/** jsdom has no media playback — stub the element methods the component
    touches. Each test shapes play()'s behavior. */
const playMock = vi.fn<() => Promise<void>>();
const pauseMock = vi.fn();

beforeEach(() => {
  mockPathname = "/";
  playMock.mockReset().mockResolvedValue(undefined);
  pauseMock.mockReset();
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(playMock);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pauseMock);
  sessionStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AmbientAudio", () => {
  it("shows the sound toggle and starts playback on the homepage", async () => {
    mockPathname = "/";
    render(<AmbientAudio />);

    expect(
      screen.getByRole("button", { name: /mute ambience/i })
    ).toBeInTheDocument();
    await waitFor(() => expect(playMock).toHaveBeenCalled());
  });

  it("shows the sound toggle and starts playback on /about", async () => {
    mockPathname = "/about";
    render(<AmbientAudio />);

    expect(
      screen.getByRole("button", { name: /mute ambience/i })
    ).toBeInTheDocument();
    await waitFor(() => expect(playMock).toHaveBeenCalled());
  });

  it.each(["/explore", "/discoveries", "/contact"])(
    "hides the toggle and pauses the track on %s",
    (route) => {
      mockPathname = route;
      render(<AmbientAudio />);

      expect(
        screen.queryByRole("button", { name: /ambience/i })
      ).not.toBeInTheDocument();
      expect(pauseMock).toHaveBeenCalled();
      expect(playMock).not.toHaveBeenCalled();
    }
  );

  it("does not autoplay when the visitor muted it earlier this session", () => {
    sessionStorage.setItem("orbit-eight:ambience-muted", "1");
    mockPathname = "/about";
    render(<AmbientAudio />);

    // The stored preference is read in an effect — flush it.
    expect(playMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /unmute ambience/i })
    ).toBeInTheDocument();
  });

  it("muting pauses the track and remembers the choice", async () => {
    mockPathname = "/about";
    render(<AmbientAudio />);
    fireEvent.click(screen.getByRole("button", { name: /mute ambience/i }));

    expect(pauseMock).toHaveBeenCalled();
    expect(sessionStorage.getItem("orbit-eight:ambience-muted")).toBe("1");
    const toggle = screen.getByRole("button", { name: /unmute ambience/i });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("starts on the first interaction when autoplay is blocked", async () => {
    // First attempt rejected — the browser's autoplay policy.
    playMock.mockRejectedValueOnce(new DOMException("blocked", "NotAllowedError"));
    mockPathname = "/about";
    render(<AmbientAudio />);

    await waitFor(() => expect(playMock).toHaveBeenCalledTimes(1));
    // The visitor interacts; playback begins.
    fireEvent.pointerDown(window);
    await waitFor(() => expect(playMock).toHaveBeenCalledTimes(2));
  });
});
