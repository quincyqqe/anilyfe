import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Send, Sparkles } from 'lucide-react';
import { LegalTabs } from './legal-tabs';
import { LegalAnimeArtCard } from './legal-anime-art-card';
import { LegalSectionsExplorer, type DetailedLegalSection } from './legal-sections-explorer';
import { LegalFAQ, type FAQItem } from './legal-faq';
import type { AnimeArtItem } from './anime-art';
import { FALLBACK_ANIME_ARTS } from './anime-art';

export interface LegalPillar {
  icon: ReactNode;
  tag: string;
  highlight: string;
  title: string;
  description: string;
}

interface LegalDocumentPageProps {
  title: string;
  kicker: string;
  description: string;
  animeArt?: AnimeArtItem;
  pillars: LegalPillar[];
  sections: DetailedLegalSection[];
  faq: FAQItem[];
  closingTitle?: string;
  closingText?: string;
}

export function LegalDocumentPage({
  title,
  kicker,
  description,
  animeArt = FALLBACK_ANIME_ARTS[0],
  pillars,
  sections,
  faq,
  closingTitle = 'Остались вопросы или нужна помощь?',
  closingText = 'Если нужно удалить аккаунт, прояснить правила или предложить улучшение сервиса — напиши создателю проекта в Telegram.',
}: LegalDocumentPageProps) {
  return (
    <main className="relative min-h-[100dvh] w-full overflow-x-hidden pt-28 pb-32 sm:pt-36">
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-96 right-0 -z-10 h-[400px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-14">
          <LegalTabs />
        </div>

        <section className="relative mb-20 lg:mb-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{kicker}</span>
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg sm:leading-8">
                {description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/catalog"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-95"
                >
                  <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
                  <span>В каталог аниме</span>
                </Link>

                <Link
                  href="https://t.me/quincyqqe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-95"
                >
                  <Send className="h-3.5 w-3.5 text-primary" />
                  <span>Telegram поддержки</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <LegalAnimeArtCard art={animeArt} />
            </div>
          </div>
        </section>

        <section className="mb-20 sm:mb-28">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Ключевые принципы
            </p>
            <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
              На чём строится честность AniLyfe
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition duration-300 hover:border-white/20 hover:bg-zinc-950/80"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary transition group-hover:scale-105">
                    {pillar.icon}
                  </div>
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-primary">
                    {pillar.highlight}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-white group-hover:text-primary transition-colors">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 sm:mb-28">
          <LegalFAQ title="Вопросы и ответы" items={faq} />
        </section>

        <section className="mb-20 sm:mb-28">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Полный текст правил
            </p>
            <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
              Детальные положения и регламент
            </h2>
          </div>

          <LegalSectionsExplorer sections={sections} />
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-950/80 to-zinc-900/60 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-12">
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Прямая связь с разработчиком
              </span>
              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl md:text-4xl">
                {closingTitle}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base sm:leading-7">
                {closingText}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="https://t.me/quincyqqe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-zinc-950 shadow-lg transition hover:bg-zinc-200 active:scale-95"
              >
                <Send className="h-4 w-4" />
                <span>Написать в Telegram</span>
                <ArrowUpRight className="h-4 w-4 opacity-60" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
