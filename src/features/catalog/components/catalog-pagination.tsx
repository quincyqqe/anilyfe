'use client';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buildCatalogUrl } from '../utils/build-catalog-url';
import type { CatalogFilters } from '../types/catalog';
import { cn } from '@/lib/utils/cn';

interface Props {
  page: number;
  totalPages: number;
  filters: Omit<CatalogFilters, 'page'>;
}

function getPages(page: number, total: number): (number | '...')[] {
  const pages: (number | '...')[] = [1];
  const start = Math.max(2, page - 2);
  const end = Math.min(total - 1, page + 2);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('...');
  if (total > 1) pages.push(total);
  return pages;
}

export function CatalogPagination({ page, totalPages, filters }: Props) {
  if (totalPages <= 1) return null;

  const pages = getPages(page, totalPages);

  return (
    <nav className="flex justify-center items-center gap-3" aria-label="Пагинация">
      {/* Назад */}
      <Link
        href={buildCatalogUrl(filters, Math.max(page - 1, 1))}
        aria-disabled={page === 1}
        className={cn(
          'flex items-center gap-1.5 text-sm font-medium transition-colors duration-150',
          page === 1 ? 'text-white/20 pointer-events-none' : 'text-white/50 hover:text-white',
        )}
      >
        <ChevronLeft size={15} />
        Назад
      </Link>

      <div className="w-px h-5 bg-white/10" />

      <div className="flex items-center gap-1">
        {pages.map((num, idx) =>
          num === '...' ? (
            <span key={`dots-${idx}`} className="w-9 text-center text-white/20 text-sm select-none">
              ···
            </span>
          ) : (
            <Link
              key={num}
              href={buildCatalogUrl(filters, num)}
              aria-current={num === page ? 'page' : undefined}
              className={cn(
                'relative w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150',
                num === page
                  ? 'text-white pointer-events-none after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary'
                  : 'text-white/40 hover:text-white hover:bg-white/5',
              )}
            >
              {num}
            </Link>
          ),
        )}
      </div>

      <div className="w-px h-5 bg-white/10" />

      <Link
        href={buildCatalogUrl(filters, Math.min(page + 1, totalPages))}
        aria-disabled={page === totalPages}
        className={cn(
          'flex items-center gap-1.5 text-sm font-medium transition-colors duration-150',
          page === totalPages
            ? 'text-white/20 pointer-events-none'
            : 'text-white/50 hover:text-white',
        )}
      >
        Вперёд
        <ChevronRight size={15} />
      </Link>
    </nav>
  );
}
