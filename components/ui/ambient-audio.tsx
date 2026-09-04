"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";

/** Routes where the ambience plays. */
const AUDIO_ROUTES = ["/", "/about"];
const SRC = "/audio/dear-yayoi.mp3";
/** Quiet enough to sit under browsing, loud enough to be heard. */
const VOLUME = 0.35;
/** Session-scoped mute preference — a visitor who silenced it once isn't
    re-surprised by autoplay on the next route change. */
const MUTE_KEY = "orbit-eight:ambience-muted";

// sessionStorage *is* the mute store: getSnapshot reads it, toggle() writes
// it and pings the subscribers. useSyncExternalStore reads the client value
// before the first effect runs (so a session-muted visitor never hears a
// stray play attempt) and keeps the server snapshot `false`, which renders
// prerendered HTML that hydrates cleanly.
const listeners = new Set<() => void>();
/** Fallback for browsers where sessionStorage access throws (old private
    modes) — the choice then lives only in memory. */
let memoryMuted = false;

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

function getMutedSnapshot(): boolean {
  try {
    return sessionStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return memoryMuted;
  }
}

function getServerMutedSnapshot(): boolean {
  return false;
}

function setMutedPref(next: boolean) {
  try {
    if (next) sessionStorage.setItem(MUTE_KEY, "1");
    else sessionStorage.removeItem(MUTE_KEY);
  } catch {
    memoryMuted = next;
  }
  listeners.forEach((notify) => notify());
}

/**
 * Background music for the home and about pages. Browsers block audible
 * autoplay until the visitor has interacted with the page, so the component
 * attempts an unmuted `play()` on route entry — this succeeds on every load
 * after the visitor's first-ever interaction with the site. When it is
 * rejected (a genuine first visit), the track starts muted right away —
 * muted autoplay is always allowed — and unmutes the moment the visitor
 * touches the page, so playback never has to "catch up" from a click. A
 * small toggle (bottom-right) mutes or unmutes; the choice persists for the
 * session. Navigating to any other route pauses the track and rewinds it,
 * so the motif restarts on re-entry.
 */
export function AmbientAudio() {
  const pathname = usePathname();
  const active = AUDIO_ROUTES.includes(pathname);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const muted = useSyncExternalStore(
    subscribe,
    getMutedSnapshot,
    getServerMutedSnapshot
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = VOLUME;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!active || muted) {
      // Off-route, the track pauses and rewinds so the motif begins from
      // the top on the next entry; muted, it simply stays silent.
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    let cancelled = false;
    // Unmuting outside a user-activation event is itself blocked by
    // autoplay policy, so this must run from pointerdown/keydown —
    // scroll and mouse-move don't grant activation.
    const activate = () => {
      if (cancelled) return;
      audio.muted = false;
      if (audio.paused) audio.play().catch(() => {});
    };

    audio.play().catch(() => {
      // First-ever visit: audible autoplay is blocked. Start muted
      // immediately (always allowed), so the track is already rolling —
      // the instant the visitor touches the page, sound begins, with no
      // start-up delay to wait through.
      audio.muted = true;
      audio.play().catch(() => {});
      window.addEventListener("pointerdown", activate, { once: true });
      window.addEventListener("keydown", activate, { once: true });
    });

    return () => {
      cancelled = true;
      audio.muted = false;
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
    };
  }, [active, muted]);

  function toggle() {
    const audio = audioRef.current;
    const next = !muted;
    setMutedPref(next);
    if (!audio) return;
    if (next) audio.pause();
    // Unmuting is itself a user gesture, so play() is allowed here.
    else if (active) audio.play().catch(() => {});
  }

  return (
    <>
      <audio ref={audioRef} src={SRC} loop preload="auto" />
      {active && (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={muted}
          aria-label={muted ? "Unmute ambience" : "Mute ambience"}
          className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-ash/60 bg-void/70 text-secondary backdrop-blur-md transition-colors hover:text-white"
        >
          {muted ? (
            <VolumeX className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Volume2 className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      )}
    </>
  );
}
