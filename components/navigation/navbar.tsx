"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/site";

/** Micro-captions beneath each mobile menu link — a line of texture that
    keeps the list from reading as a bare sitemap. Keyed by href. */
const linkCaptions: Record<string, string> = {
  "/": "Back to the beginning",
  "/explore": "The subjects we study",
  "/discoveries": "The latest from the record",
  "/about": "The people looking up",
  "/contact": "Say hello",
};

/**
 * Global navigation — websitePrompt.md "Global Navigation".
 * Quiet and integrated into the cinematic black environment: transparent
 * until scroll, then a near-black veil. Desktop: elegant horizontal nav.
 * Mobile: refined full-screen overlay.
 */
export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on any navigation — the link taps below close it directly,
  // and this covers browser back/forward, which changes the pathname without
  // firing a click. Adjusting state during render (React's documented
  // pattern) instead of in an effect avoids the cascading re-render.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Lock body scroll while the full-screen menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Keyboard support while the menu is open: Escape closes it, focus moves
  // into the menu on open and back to the toggle on close.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Snapshot the toggle now — the ref may be null again by cleanup time.
    const toggle = toggleRef.current;
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "border-b border-ash/60 bg-void/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-content items-center justify-between px-6 sm:px-10 lg:px-20"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-lg tracking-[-0.01em] text-white transition-opacity hover:opacity-80"
        >
          Orbit Eight
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-sm transition-colors",
                    active
                      ? "text-white"
                      : "text-secondary hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Link href="/contact" className="btn-ghost hidden !px-5 !py-2 md:inline-flex">
            Join Orbit Eight
          </Link>

          {/* Mobile switch — a bordered disc that warms, glows, and turns
              ninety degrees while the menu is open, so the state change is
              felt in the button itself, not only in the overlay. */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-300 md:hidden",
              open
                ? "rotate-90 border-solar-flare/60 bg-solar-flare/10 text-solar-flare shadow-[0_0_24px_rgba(245,166,35,0.3)]"
                : "border-ash/60 bg-void/40 text-white hover:border-solar-flare/40 hover:text-solar-flare/80"
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu — opened by the switch above. One
          top-anchored group: the links lead, the CTA follows directly
          beneath them. Nothing is pinned to the viewport bottom; a
          `justify-between` column there read like a footer band instead of
          navigation. The layered backdrop — orbital rings arcing in from
          the top-right, a warm aura, a faint starfield, and the ghost
          wordmark sinking off the bottom — gives the void depth; every
          decorative layer is pointer-inert and clipped by the outer box. */}
      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="md:hidden"
      >
        <div className="relative max-h-[calc(100svh-4rem)] overflow-hidden bg-gradient-to-b from-void via-void to-surface">
          <div
            aria-hidden="true"
            className="menu-aura pointer-events-none absolute inset-0"
          />
          <div
            aria-hidden="true"
            className="menu-stars pointer-events-none absolute inset-0"
          />
          {/* Three concentric rings, all centred 64px inside the top-right
              corner; their arcs sweep across the menu like an orbit. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[144px] -top-[144px] h-[416px] w-[416px] rounded-full border border-ash/25"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[160px] -top-[160px] h-[448px] w-[448px] rounded-full border border-solar-flare/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[176px] -top-[176px] h-[480px] w-[480px] rounded-full border border-ash/30"
          />
          {/* A planet riding the middle ring (positioned so the dot's
              centre sits exactly on the 224px arc). */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-[254px] top-[172px] h-2 w-2 rounded-full bg-solar-flare shadow-[0_0_14px_rgba(245,166,35,0.9)]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -right-3 select-none font-heading text-[11rem] font-light leading-none tracking-[-0.04em] text-white/[0.04]"
          >
            Orbit
          </span>
          {/* The decorative layers clip the overhanging rings and wordmark;
              this inner layer carries the vertical scroll instead, so the
              overflow never turns into a horizontal scrollbar. */}
          <div className="relative max-h-[calc(100svh-4rem)] overflow-y-auto px-6 pb-10 pt-6">
            <div className="animate-fade-in-down">
              <div className="flex items-baseline justify-between gap-4">
                <p className="eyebrow">Menu</p>
                <p className="text-[0.6875rem] uppercase tracking-[0.25em] text-tertiary">
                  Explore beyond the known
                </p>
              </div>
              <ul className="mt-5 divide-y divide-ash/40 border-y border-ash/40">
                {navLinks.map((link, i) => {
                  const active = pathname === link.href;
                  return (
                    <li
                      key={link.href}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      {/* Close the menu on navigation — the tap that
                          navigates is also the tap that dismisses the
                          overlay. */}
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className="group flex items-center gap-5 py-4"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "w-6 text-xs tabular-nums tracking-[0.15em] transition-colors",
                            active
                              ? "text-solar-flare"
                              : "text-tertiary group-hover:text-solar-flare/70"
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span
                            className={cn(
                              "font-heading text-3xl font-light tracking-[-0.01em] transition-colors",
                              active
                                ? "text-white"
                                : "text-secondary group-hover:text-white"
                            )}
                          >
                            {link.label}
                          </span>
                          <span className="mt-1 truncate text-[0.6875rem] uppercase tracking-[0.18em] text-tertiary transition-colors duration-300 group-hover:text-secondary">
                            {linkCaptions[link.href]}
                          </span>
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className={cn(
                            "ml-auto h-5 w-5 shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-70",
                            active &&
                              "translate-x-0 text-solar-flare opacity-100"
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn-primary mt-8 w-full"
              >
                Join Orbit Eight
              </Link>
              <p className="mt-3 text-center text-xs tracking-[0.05em] text-tertiary">
                For those who never stopped looking up
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
