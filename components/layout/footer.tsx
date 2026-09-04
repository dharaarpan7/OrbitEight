import Link from "next/link";
import { navLinks, site } from "@/lib/site";

/**
 * Shared footer — websitePrompt.md "Footer".
 * Extremely minimal: brand, short statement, navigation, socials, legal.
 */
export function Footer() {
  return (
    <footer className="border-t border-ash/60 bg-void">
      <div className="mx-auto w-full max-w-content px-6 py-16 sm:px-10 lg:px-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <p className="font-heading text-xl font-light text-white">
              Orbit Eight
            </p>
            <p className="mt-3 text-sm leading-relaxed text-tertiary">
              {site.tagline}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials + contact */}
          <div className="space-y-3">
            <ul className="flex gap-4">
              {site.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-secondary transition-colors hover:text-white"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${site.email}`}
              className="block text-sm text-tertiary transition-colors hover:text-secondary"
            >
              {site.email}
            </a>
          </div>
        </div>

        {/* Legal */}
        {/* Legal — privacy/terms pages don't exist yet; dead links would be
            worse than none, so only the copyright stands until they do. */}
        <div className="mt-14 border-t border-ash/60 pt-6 text-xs text-tertiary">
          <p>
            © {new Date().getFullYear()} Orbit Eight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
