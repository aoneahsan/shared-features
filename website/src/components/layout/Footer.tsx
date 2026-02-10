import { Link } from 'react-router-dom';
import { Heart, ExternalLink } from 'lucide-react';
import {
  APP_NAME,
  APP_VERSION,
  FOOTER_LINKS,
  DEVELOPER,
  SUPPORT_URL,
} from '@/config/constants';

interface FooterLinkItem {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

/**
 * Renders a single footer link, handling both internal router links
 * and external links that open in a new tab.
 */
function FooterLink({ link }: { link: FooterLinkItem }) {
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm text-surface-400 transition-colors hover:text-white"
      >
        {link.label}
        <ExternalLink className="h-3 w-3" />
      </a>
    );
  }

  return (
    <Link
      to={link.href}
      className="text-sm text-surface-400 transition-colors hover:text-white"
    >
      {link.label}
    </Link>
  );
}

/**
 * Marketing footer with 4-column grid layout, developer contact links,
 * support link, and copyright bar.
 */
export function Footer() {
  return (
    <footer className="bg-surface-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Product Column */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-surface-300">
              Product
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-surface-300">
              Resources
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-surface-300">
              Legal
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-surface-300">
              Connect
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${DEVELOPER.email}`}
                  className="text-sm text-surface-400 transition-colors hover:text-white"
                >
                  {DEVELOPER.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${DEVELOPER.phone}`}
                  className="text-sm text-surface-400 transition-colors hover:text-white"
                >
                  {DEVELOPER.phone}
                </a>
              </li>
              <li>
                <a
                  href={DEVELOPER.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-surface-400 transition-colors hover:text-white"
                >
                  LinkedIn
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href={DEVELOPER.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-surface-400 transition-colors hover:text-white"
                >
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href={DEVELOPER.npm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-surface-400 transition-colors hover:text-white"
                >
                  NPM
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href={DEVELOPER.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-surface-400 transition-colors hover:text-white"
                >
                  Portfolio
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Support Link */}
        <div className="mt-10 flex justify-center border-t border-surface-700 pt-8">
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-surface-800 px-5 py-2.5 text-sm font-medium text-surface-300 transition-colors hover:bg-surface-700 hover:text-white"
          >
            <Heart className="h-4 w-4 text-red-400" />
            Support this project
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-surface-700 pt-8 sm:flex-row">
          <p className="text-sm text-surface-500">
            &copy; {new Date().getFullYear()} {APP_NAME} by {DEVELOPER.name}. All rights reserved.
          </p>
          <p className="text-xs text-surface-600">
            v{APP_VERSION}
          </p>
        </div>
      </div>
    </footer>
  );
}
