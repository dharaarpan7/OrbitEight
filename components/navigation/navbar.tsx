"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the full-screen menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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

      {/* Mobile full-screen menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="md:hidden"
      >
        <div className="flex min-h-[calc(100svh-4rem)] flex-col justify-between bg-void px-6 pb-10 pt-8">
          <ul className="space-y-2">
            {navLinks.map((link, i) => {
              const active = pathname === link.href;
              return (
                <li key={link.href} style={{ animationDelay: `${i * 60}ms` }}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block py-3 font-heading text-3xl font-light tracking-[-0.01em] transition-colors",
                      active ? "text-white" : "text-secondary hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href="/contact" className="btn-primary mt-10 w-full">
            Join Orbit Eight
          </Link>
        </div>
      </div>
    </header>
  );
}
