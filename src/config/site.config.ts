export const siteConfig = {
  title: 'AniLyfe — Все новинки аниме онлайн',
  description:
    'Смотрите аниме онлайн на AniLyfe. Большой каталог аниме, новинки сезонов, рейтинги, информация о франшизах и расписание выхода серий.',
  theme: 'dark',
  language: 'ru',
  url: 'https://anilyfe.vercel.app',
  navItems: [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Аниме' },
    { href: '/schedule', label: 'Расписание' },
  ],
  footer: {
    brand: {
      name: 'AniLyfe',
      description: 'Аниме платформа для просмотра аниме с профессиональной озвучкой',
    },
    infoLinks: [
      { href: 'https://anilibria.top/api/docs/v1#/', label: 'API' },
      { href: 'https://anilibria.top/support', label: 'Поддержка' },
    ],
    legalLinks: [
      { href: '/privacy', label: 'Политика конфиденциальности' },
      { href: '/terms', label: 'Условия использования' },
    ],
    socialLinks: [
      {
        href: 'https://t.me/quincyqqe',
        label: 'Telegram',
        icon: 'telegram',
      },
      {
        label: 'GitHub',
        href: 'https://github.com/quincyqqe/anilyfe',
        icon: 'github',
      },
    ],
  },
} as const;
