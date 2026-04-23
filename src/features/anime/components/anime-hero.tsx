import Image from "@/components/ui/image";

interface Props {
  posterSrc: string;
}

export function AnimeHero({ posterSrc }: Props) {
  return (
    <div className="anime-hero ad-hero__bg">
      <Image
        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${posterSrc}`}
        alt=""
        aria-hidden
        width={32}
        height={48}
        quality={75}
        preload
        className="absolute inset-0 w-full h-full object-cover rounded-2xl scale-110 blur-2xl opacity-50 -z-10"
      />
      <div className="ad-hero__bg-overlay" />
    </div>
  );
}
