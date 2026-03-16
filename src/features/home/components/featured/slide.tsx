import Image from '@/components/ui/image';
import { Promotion } from '@/features/home/types/promotion';

const FeaturedSlide = ({ promo }: { promo: Promotion }) => {
  return (
    <div className="embla__slide min-h-screen relative">
      <Image
        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${promo.image.optimized.preview}`}
        alt={promo.release?.name.main || ''}
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
    </div>
  );
};

export default FeaturedSlide;
