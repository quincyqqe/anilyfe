export const siteConfig = {
  title: 'AniLyfe — Все новинки аниме онлайн',
  description:
    'Смотрите аниме онлайн бесплатно на AniLyfe. Большой каталог аниме, актуальное расписание выхода серий, информация о сезонах. Премиальная платформа для просмотра аниме с профессиональной озвучкой, без рекламы и в максимальном качестве',
  theme: 'dark',
  language: 'ru',
  url: 'https://anilyfe.vercel.app/',
  navItems: [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Аниме' },
    { href: '/schedule', label: 'Расписание' },
  ],
  footer: {
    brand: {
      name: 'AniLyfe',
      description: 'Премиальная платформа для просмотра аниме с профессиональной озвучкой',
    },
    infoLinks: [
      { href: 'https://anilibria.top/api/docs/v1#/', label: 'API' },
      { href: 'https://anilibria.top/support', label: 'Поддержка' },
    ],
    socialLinks: [
      {
        href: 'https://t.me/quincyqqe',
        label: 'Telegram',
        icon: 'telegram',
      },
    ],
  },
} as const;
