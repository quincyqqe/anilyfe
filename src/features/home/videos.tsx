import Image from '@/components/ui/image';
import { BASE_API_URL } from '@/shared/api/client';
import { Eye } from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';

type Video = {
  id: number;
  url: string;
  title: string;
  views: number;
  video_id: string;
  image: {
    optimized: {
      thumbnail: string;
      preview: string;
    };
  };
};

const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_URL!;

export default async function Videos() {
  let videos: Video[] | null = null;

  try {
    const res = await fetch(BASE_API_URL + '/media/videos?limit=4', {
      next: { revalidate: 86400 },
    });
    if (res.ok) {
      videos = await res.json();
    }
  } catch (err) {
    console.error('[VIDEOS ERROR]', err);
  }

  if (!videos || videos.length === 0) return null;

  return (
        <section className="py-6 md:py-12 px-4 ">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaYoutube className="w-6 h-6 text-red-500 shrink-0" />
              <p className="text-primary text-sm font-semibold tracking-wide uppercase leading-none">
                Самые интересные видео ролики от любимой команды
              </p>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white">Последние видео</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {videos.map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col gap-3 rounded-2xl glass p-3 border border-white/5 hover:border-white/20 transition-all hover:shadow-2xl hover:shadow-primary/20"
            >
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/50">
                <Image
                  src={MEDIA_BASE_URL + video.image.optimized.preview}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  fill
                />
              </div>

              <div className="flex flex-col gap-2 px-1">
                <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {video.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mt-auto">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{video.views.toLocaleString('ru-RU')} просмотров</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
