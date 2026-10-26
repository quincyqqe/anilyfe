'use client';

import { useState, type ReactNode } from 'react';
import { Check, Link2, Sparkles } from 'lucide-react';

export interface DetailedLegalSection {
  id: string;
  tag: string;
  title: string;
  tldr: string;
  body: ReactNode;
}

interface LegalSectionsProps {
  sections: DetailedLegalSection[];
}

export function LegalSectionsExplorer({ sections }: LegalSectionsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (id: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        const isCopied = copiedId === section.id;
        const displayNumber = index + 1;

        return (
          <article
            key={section.id}
            id={section.id}
            className="group relative scroll-mt-28 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl transition duration-300 hover:border-white/20 sm:p-8"
          >
            <div className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition group-hover:opacity-100" />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                    {displayNumber < 10 ? `0${displayNumber}` : displayNumber}
                  </span>
                  <span className="rounded-md bg-white/5 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    {section.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {section.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => handleCopyLink(section.id)}
                className="inline-flex items-center gap-1.5 self-start rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white active:scale-95"
                title="Скопировать прямую ссылку на раздел"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Скопировано</span>
                  </>
                ) : (
                  <>
                    <Link2 className="h-3.5 w-3.5 opacity-70" />
                    <span>Ссылка</span>
                  </>
                )}
              </button>
            </div>

            {section.tldr && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/[0.04] p-4 text-xs leading-relaxed text-zinc-200 sm:text-sm sm:leading-6">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-white mb-0.5">В двух словах (TL;DR):</p>
                  <p className="text-zinc-300">{section.tldr}</p>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
              {section.body}
            </div>
          </article>
        );
      })}
    </div>
  );
}
