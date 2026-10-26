'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site.config';

function isActiveLink(pathname: string, href: string) {
  const path = href.split('?')[0];
  return path === '/' ? pathname === '/' : pathname.startsWith(path);
}

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Основная навигация"
      className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
    >
      {siteConfig.navItems.map((item) => {
        const active = isActiveLink(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className="group relative rounded-md px-3 py-1.5 text-xs font-medium tracking-wide outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <span
              className={
                active
                  ? 'text-zinc-50'
                  : 'text-zinc-400 transition-colors group-hover:text-zinc-100'
              }
            >
              {item.label}
            </span>

            <span
              className={[
                'absolute inset-x-3 -bottom-0.5 h-px rounded-full bg-white/60 transition-transform duration-200',
                active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
              ].join(' ')}
            />
          </Link>
        );
      })}
    </nav>
  );
}
