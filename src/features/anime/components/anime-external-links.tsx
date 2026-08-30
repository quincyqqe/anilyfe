import { ExternalLink, Globe } from 'lucide-react';

import type { AniListAnime } from '@/shared/types/anilist';

interface Props {
  links: AniListAnime['externalLinks'];
}

export function AnimeExternalLinks({ links }: Props) {
  if (links.length === 0) {
    return null;
  }

  const sortedLinks = [...new Map(links.map((link) => [link.site, link])).values()].sort((a, b) =>
    a.site.localeCompare(b.site, undefined, {
      sensitivity: 'base',
    }),
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <span className="flex size-6 items-center justify-center rounded-md border border-white/8 bg-white/5">
          <ExternalLink className="size-3 text-zinc-400" strokeWidth={2} />
        </span>

        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
          Ссылки
        </span>

        <span className="h-px flex-1 bg-gradient-to-r from-white/8 to-transparent" />
      </div>

      <div className="flex flex-wrap gap-2">
        {sortedLinks.map((link) => {
          const color = link.color ?? '#a1a1aa';

          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={
                {
                  '--link-color': color,
                } as React.CSSProperties
              }
              className="group relative inline-flex h-8 items-center gap-2 overflow-hidden rounded-md border border-white/8 bg-white/[0.035] px-2.5 text-xs font-medium text-zinc-400 transition-all duration-200 hover:border-[color-mix(in_srgb,var(--link-color)_55%,transparent)] hover:bg-[color-mix(in_srgb,var(--link-color)_12%,#18181b)] hover:text-zinc-100 hover:shadow-[0_0_18px_color-mix(in_srgb,var(--link-color)_12%,transparent)]"
            >
              <span
                className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 15% 50%, ${color}18, transparent 55%)`,
                }}
              />

              <span className="relative flex size-4 shrink-0 items-center justify-center">
                {link.icon ? (
                  <img
                    src={link.icon}
                    alt=""
                    className="size-4 object-contain opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:drop-shadow-[0_0_5px_var(--link-color)]"
                  />
                ) : (
                  <Globe className="size-3.5 text-zinc-500 transition-colors duration-200 group-hover:text-[var(--link-color)]" />
                )}
              </span>

              <span className="relative">{link.site}</span>

              <ExternalLink className="relative size-3 text-zinc-600 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--link-color)] group-hover:opacity-100" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
