import { memo } from 'react';
import Image from '@/components/ui/image';
import { Promotion } from '@/features/home/types/promotion';

interface Props {
  promo: Promotion;
  priority?: boolean;
}

const FeaturedSlide = ({ promo, priority = false }: Props) => {
  return (
    <div className="embla__slide relative">
      <Image
        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${promo.image.optimized.preview}`}
        alt={promo.release?.name.main || promo.title || ''}
        fill
        sizes="100vw"
        className="object-cover object-center"
        quality={75}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </div>
  );
};
export default memo(FeaturedSlide);
