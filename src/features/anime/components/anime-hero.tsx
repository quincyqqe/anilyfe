import Image from '@/components/ui/image';

interface Props {
  posterSrc: string;
}

export function AnimeHero({ posterSrc }: Props) {
  return (
    <div className="anime-hero ad-hero__bg relative overflow-hidden rounded-2xl">
      <Image
        fill
        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${posterSrc}`}
        alt=""
        aria-hidden
        sizes="100vw"
        preload
        fetchPriority="high"
        quality={75}
        className="object-cover opacity-50 -z-10"
      />

      <div className="ad-hero__bg-overlay" />
    </div>
  );
}
