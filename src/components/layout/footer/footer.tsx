import { siteConfig } from '@/config/site.config';
import Link from 'next/link';
import { FaTelegram } from 'react-icons/fa';

const socialIconMap = {
  telegram: FaTelegram,
} as const;

const Footer = () => {
  const { brand, infoLinks, socialLinks } = siteConfig.footer;

  return (
    <footer className="border-t border-white/10 mt-24 relative">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="text-xs tracking-[0.14em] uppercase text-zinc-400">{brand.name}</span>
            <p className="text-sm text-zinc-600 leading-relaxed">{brand.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-500">
              Навигация
            </span>
            <ul className="flex flex-col gap-2.5">
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
                    aria-label={`Перейти на: ${item.label}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-500">
              Информация
            </span>
            <ul className="flex flex-col gap-2.5">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-500">
              Социальные сети
            </span>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
