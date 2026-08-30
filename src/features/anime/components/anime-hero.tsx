import Image from 'next/image';

interface Props {
  posterSrc: string;
}

export function AnimeHero({ posterSrc }: Props) {
  return (
    <div className="ad-hero__bg overflow-hidden" aria-hidden="true">
      <Image
        fill
        preload
        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${posterSrc}`}
        alt=""
        sizes="100vw"
        quality={75}
        className="pointer-events-none object-cover"
      />

      <div className="ad-hero__bg-overlay" />
    </div>
  );
}
