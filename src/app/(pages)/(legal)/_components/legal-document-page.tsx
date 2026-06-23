import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface LegalSummaryCard {
  title: string;
  text: string;
}

export interface LegalSection {
  title: string;
  body: ReactNode;
}

interface LegalDocumentPageProps {
  active: 'privacy' | 'terms';
  title: string;
  kicker: string;
  description: string;
  lastUpdated: string;
  imageSeed: string;
  summary: LegalSummaryCard[];
  sections: LegalSection[];
  closingTitle: string;
  closingText: string;
}

export function LegalDocumentPage({
  title,
  kicker,
  description,
  lastUpdated,
  imageSeed,
  summary,
  sections,
  closingTitle,
  closingText,
}: LegalDocumentPageProps) {
  return (
    <div className="w-full overflow-x-hidden">
      <section className="relative px-4 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-primary sm:text-sm">
                {kicker}
              </p>

              <h1 className="text-4xl font-black leading-[1.05] text-white  md:text-5xl">
                {title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
                {description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <span className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-300 sm:text-sm">
                  Обновлено: {lastUpdated}
                </span>

                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                >
                  Вернуться к каталогу
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative h-[22rem] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 sm:h-[28rem] lg:h-[32rem]">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-80 grayscale contrast-125 saturate-150 transition duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(https://picsum.photos/seed/${imageSeed}/1200/1600)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-primary/10" />

              <div className="absolute bottom-0 p-6 sm:p-8">
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-zinc-950/70 p-4 backdrop-blur-xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <p className="text-xs leading-6 text-zinc-300 sm:text-sm">
                    Документы написаны простым языком для быстрого понимания правил сервиса.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
          {summary.map((item, index) => (
            <article
              key={item.title}
              className={cn(
                'rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:bg-white/[0.05]',
                index % 3 === 0 ? 'lg:col-span-7' : 'lg:col-span-5',
              )}
            >
              <div className="mb-6 h-1 w-14 rounded-full bg-primary/70 transition-all group-hover:w-24" />
              <h2 className="text-xl font-bold text-white sm:text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.35fr_0.65fr]">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
              Правила сервиса
            </h2>
            <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-base">
              Основные положения: аккаунт, данные, API, безопасность и ограничения.
            </p>
          </aside>

          <div className="space-y-5">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-2xl border border-white/10 bg-zinc-950/40 p-6 backdrop-blur-xl transition hover:border-white/20 sm:p-8"
              >
                <h3 className="text-lg font-bold text-white sm:text-xl md:text-2xl">
                  {section.title}
                </h3>

                <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
                  {section.body}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-40">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-8 sm:p-10 lg:p-14">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
                  {closingTitle}
                </h2>

                <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base sm:leading-8">
                  {closingText}
                </p>
              </div>

              <Link
                href="https://t.me/quincyqqe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Написать в Telegram
                <ArrowUpRight className="h-4 w-4 opacity-80" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
