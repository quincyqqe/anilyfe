interface Props {
  posterSrc: string;
}

export function AnimeHero({ posterSrc }: Props) {
  return (
    <div className="anime-hero ad-hero__bg">
      <img
        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${posterSrc}`}
        alt=""
        aria-hidden
        className="object-cover w-full h-full absolute inset-0"
      />
      <div className="ad-hero__bg-overlay" />
      <div className="ad-hero__noise" />
    </div>
  );
}
