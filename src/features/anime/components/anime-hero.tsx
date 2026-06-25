import Image from 'next/image';

interface Props {
  posterSrc: string;
}

export function AnimeHero({ posterSrc }: Props) {
  return (
    <div className="ad-hero__bg relative overflow-hidden">
      <Image
        fill
        preload
        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${posterSrc}`}
        alt=""
        aria-hidden
        sizes="100vw"
        quality={75}
        className="pointer-events-none object-cover"
      />

      <div className="ad-hero__bg-overlay" />
    </div>
  );
}
