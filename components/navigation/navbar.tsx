"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/site";

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

          {/* Mobile toggle */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu — one top-anchored group: the links lead,
          the CTA follows directly beneath them. Nothing is pinned to the
          viewport bottom; a `justify-between` column there read like a
          footer band instead of navigation. */}
      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="md:hidden"
      >
        <div className="flex max-h-[calc(100svh-4rem)] flex-col overflow-y-auto bg-void px-6 pb-10 pt-6">
          <p className="eyebrow">Menu</p>
          <ul className="mt-4 divide-y divide-ash/40 border-y border-ash/40">
            {navLinks.map((link, i) => {
              const active = pathname === link.href;
              return (
                <li
                  key={link.href}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Close the menu on navigation — the tap that navigates is
                      also the tap that dismisses the overlay. */}
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
                    <span
                      className={cn(
                        "font-heading text-3xl font-light tracking-[-0.01em] transition-colors",
                        active ? "text-white" : "text-secondary group-hover:text-white"
                      )}
                    >
                      {link.label}
                    </span>
                    {active && (
                      <span
                        aria-hidden="true"
                        className="ml-auto h-px w-8 self-center bg-solar-flare"
                      />
                    )}
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
        </div>
      </div>
    </header>
  );
}
