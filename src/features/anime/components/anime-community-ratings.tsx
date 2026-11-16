import { ExternalLink } from 'lucide-react';
import { SiMyanimelist, SiShikimori } from 'react-icons/si';

import type { Anime } from '@/shared/types/anime';

interface Props {
  mal: Anime['mal'];
  shikimori: Anime['shikimori'];
}

type SourceId = 'mal' | 'shikimori';

interface SourceConfig {
  readonly label: string;
  readonly Icon: typeof SiMyanimelist;
  readonly iconColor: string;
  readonly iconBg: string;
  readonly hoverBorder: string;
  readonly hoverShadow: string;
  readonly barColor: string;
  readonly glowColor: string;
}

interface RatingSource extends SourceConfig {
  readonly id: SourceId;
  readonly score: number;
  readonly votes: number;
  readonly url: string;
}

const VOTE_FORMATTER = new Intl.NumberFormat('ru-RU');

const SOURCE_CONFIG = {
  mal: {
    label: 'MyAnimeList',
    Icon: SiMyanimelist,
    iconColor: 'text-[#7ea2f7]',
    iconBg: 'border-[#2e51a2]/35 bg-[#2e51a2]/15',
    hoverBorder: 'hover:border-[#4f77d6]/40',
    hoverShadow: 'hover:shadow-[0_8px_24px_rgba(46,81,162,0.18)]',
    barColor: '#4f77d6',
    glowColor: 'rgba(46, 81, 162, 0.16)',
  },
  shikimori: {
    label: 'Shikimori',
    Icon: SiShikimori,
    iconColor: 'text-purple-300',
    iconBg: 'border-purple-500/30 bg-purple-500/15',
    hoverBorder: 'hover:border-purple-400/40',
    hoverShadow: 'hover:shadow-[0_8px_24px_rgba(168,85,247,0.18)]',
    barColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.14)',
  },
} as const satisfies Record<SourceId, SourceConfig>;

function formatVotes(votes: number): string {
  if (votes >= 1_000_000) {
    return `${(votes / 1_000_000).toFixed(1)}M`;
  }

  if (votes >= 10_000) {
    return `${(votes / 1_000).toFixed(0)}k`;
  }

  if (votes >= 1_000) {
    return `${(votes / 1_000).toFixed(1)}k`;
  }

  return String(votes);
}

function createSource(
  id: SourceId,
  rating: { rating: number; votes: number; url: string } | null | undefined,
): RatingSource | null {
  if (!rating || !Number.isFinite(rating.rating) || rating.rating <= 0 || !rating.url) {
    return null;
  }

  return {
    id,
    score: rating.rating,
    votes: Number.isFinite(rating.votes) ? Math.max(0, rating.votes) : 0,
    url: rating.url,
    ...SOURCE_CONFIG[id],
  };
}

export function AnimeCommunityRatings({ mal, shikimori }: Props) {
  const sources: RatingSource[] = [];

  const malSource = createSource('mal', mal);
  const shikimoriSource = createSource('shikimori', shikimori);

  if (malSource) sources.push(malSource);
  if (shikimoriSource) sources.push(shikimoriSource);

  if (sources.length === 0) return null;

  return (
    <section className="flex flex-col gap-2.5" aria-labelledby="community-ratings-heading">
      <div className="flex items-center gap-2.5">
        <h2
          id="community-ratings-heading"
          className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500"
        >
          Оценки сообщества
        </h2>

        <span
          aria-hidden="true"
          className="h-px flex-1 bg-gradient-to-r from-white/8 to-transparent"
        />
      </div>

      <div className="flex flex-col gap-2">
        {sources.map(
          ({
            id,
            label,
            score,
            votes,
            url,
            Icon,
            iconColor,
            iconBg,
            hoverBorder,
            hoverShadow,
            barColor,
            glowColor,
          }) => {
            const formattedVotes = formatVotes(votes);
            const normalizedScore = Math.min(10, Math.max(0, score));
            const fullVotesLabel =
              votes > 0 ? `${VOTE_FORMATTER.format(votes)} голосов` : undefined;

            return (
              <a
                key={id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label}: ${score.toFixed(2)} из 10. ${
                  votes > 0 ? `${fullVotesLabel}. ` : ''
                }Открыть внешний рейтинг`}
                className={[
                  'group relative flex items-center justify-between gap-3',
                  'overflow-hidden rounded-xl border border-white/[0.08]',
                  'glass p-2.5',
                  hoverBorder,
                  hoverShadow,
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none"
                  style={{
                    background: `radial-gradient(circle at 10% 50%, ${glowColor}, transparent 65%)`,
                  }}
                />

                <div className="relative flex min-w-0 items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none ${iconBg} ${iconColor}`}
                  >
                    <Icon className="size-4" />
                  </span>

                  <div className="flex min-w-0 flex-col">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate text-xs font-semibold text-zinc-200 transition-colors group-hover:text-white">
                        {label}
                      </span>

                      <ExternalLink
                        aria-hidden="true"
                        className="size-3 shrink-0 -translate-x-1 text-zinc-500 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-zinc-300 group-hover:opacity-100 motion-reduce:transform-none motion-reduce:transition-none"
                      />
                    </div>

                    <span
                      className="truncate text-[11px] text-zinc-400/90 transition-colors group-hover:text-zinc-300"
                      title={fullVotesLabel}
                    >
                      {votes > 0 ? `${formattedVotes} голосов` : 'Открыть рейтинг'}
                    </span>
                  </div>
                </div>

                <div className="relative flex shrink-0 flex-col items-end gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-sm font-bold tabular-nums text-white">
                      {score.toFixed(2)}
                    </span>

                    <span className="text-[10px] font-medium text-zinc-500">/10</span>
                  </div>

                  <div
                    aria-hidden="true"
                    className="h-1 w-11 overflow-hidden rounded-full bg-white/[0.08]"
                  >
                    <div
                      className="h-full rounded-full transition-[width,filter] duration-300 group-hover:brightness-125 motion-reduce:transition-none"
                      style={{
                        width: `${(normalizedScore / 10) * 100}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                </div>
              </a>
            );
          },
        )}
      </div>
    </section>
  );
}
