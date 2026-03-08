import { CatalogFilters, CatalogPagination, parseSearchParams } from '@/features/catalog';
import { fetchCatalog } from '@/features/catalog/api/catalog';
import { TrendingUp } from 'lucide-react';
import { AnimeCard } from '@/components/anime-card';

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: Props) {
  const raw = await searchParams;
  const { page, ...filters } = parseSearchParams(raw ?? {});

  const { data: animeList, meta } = await fetchCatalog({ ...filters, page });

  return (
    <main className="min-h-screen w-full pt-28 pb-16 container mx-auto max-md:px-4">
      <header className="mb-8 space-y-6">
        <div>
          <h1 className="font-black text-4xl sm:text-5xl text-white">
            {filters.search ? `Поиск: ${filters.search}` : 'Каталог Аниме'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Найдено {meta.pagination?.total ?? 0} тайтлов
          </p>
        </div>
        <nav aria-label="Фильтры каталога">
          <CatalogFilters />
        </nav>
      </header>

      <section className="space-y-8">
        {animeList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="max-w-md w-full p-8 rounded-2xl glass-effect text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-card flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-white">Ничего не найдено</h2>
              <p className="text-muted-foreground">
                Попробуйте изменить фильтры или вернитесь позже
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 sm:gap-6">
              {animeList.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
            <nav aria-label="Пагинация" className="pt-8">
              <CatalogPagination
                page={page}
                totalPages={meta.pagination?.total_pages ?? 1}
                filters={filters}
              />
            </nav>
          </>
        )}
      </section>
    </main>
  );
}
