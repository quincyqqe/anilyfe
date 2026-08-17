import { AnimeCard } from '@/components/anime-card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { CatalogFilters, CatalogPagination, parseSearchParams } from '@/features/catalog';
import { fetchCatalog } from '@/features/catalog/api/catalog';
import { Compass, Sparkles } from 'lucide-react';

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: Props) {
  const raw = await searchParams;
  const { page, ...filters } = parseSearchParams(raw ?? {});
  const { data: animeList, meta } = await fetchCatalog({ ...filters, page });
  const total = meta.pagination?.total ?? 0;

  return (
    <main
      id="main-content"
      className="mx-auto min-h-[100dvh] w-full container px-4 pb-20 pt-28 sm:px-6 lg:px-8"
    >
      <header className="border-b border-white/[0.08] pb-7 sm:pb-9">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <Compass className="size-3.5" />
              Библиотека AniLyfe
            </div>
            <h1 className="max-w-2xl text-4xl font-black tracking-[-0.045em] text-foreground sm:text-5xl">
              {filters.search ? `Поиск: ${filters.search}` : 'Каталог аниме'}
            </h1>
          </div>

          <div className="flex items-end gap-3 border-l border-white/[0.08] pl-4 lg:justify-end">
            <Sparkles className="mb-1 size-4 text-muted-foreground" />
            <p className="text-sm leading-tight text-muted-foreground">
              <span className="block text-2xl font-semibold tabular-nums text-foreground">
                {total}
              </span>
              тайтлов найдено
            </p>
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(16rem,18rem)_minmax(0,1fr)] lg:gap-10">
        <CatalogFilters />

        <section aria-label="Результаты каталога" className="min-w-0">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Страница {page} из {meta.pagination?.total_pages ?? 1}
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Наведите на карточку, чтобы увидеть детали
            </p>
          </div>

          {animeList.length === 0 ? (
            <Empty className="min-h-80 border-white/[0.12] bg-card/30">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-12 rounded-2xl bg-muted/80">
                  <Compass className="size-6" />
                </EmptyMedia>
                <EmptyTitle>По этим параметрам ничего нет</EmptyTitle>
                <EmptyDescription>
                  Попробуйте расширить период, снять часть фильтров или изменить поисковый запрос.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <p className="text-xs text-muted-foreground">
                  Панель фильтров остаётся рядом — настройте выдачу без возврата наверх.
                </p>
              </EmptyContent>
            </Empty>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {animeList.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>

              <nav aria-label="Пагинация каталога" className="pt-12">
                <CatalogPagination
                  page={page}
                  totalPages={meta.pagination?.total_pages ?? 1}
                  filters={filters}
                />
              </nav>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
