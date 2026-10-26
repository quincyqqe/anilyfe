'use client';

import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export interface FAQItem {
  question: string;
  answer: string;
}

interface LegalFAQProps {
  title?: string;
  items: FAQItem[];
}

export function LegalFAQ({ title = 'Вопросы и ответы', items }: LegalFAQProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white sm:text-2xl">{title}</h3>
          <p className="text-xs text-zinc-400 sm:text-sm">
            Короткие и понятные ответы на главные вопросы пользователей
          </p>
        </div>
      </div>

      <Accordion
        defaultValue={['item-0']}
        className="flex w-full flex-col gap-3 border-none bg-transparent"
      >
        {items.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={`item-${index}`}
            className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-1.5 backdrop-blur-md transition data-open:border-white/20 data-open:bg-white/[0.04] sm:px-5"
          >
            <AccordionTrigger className="py-3 text-left text-base font-semibold text-white transition hover:no-underline hover:text-primary sm:text-lg">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
