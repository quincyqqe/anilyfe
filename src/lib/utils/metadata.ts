import type { Metadata } from 'next';

import { siteConfig } from '@/config/site.config';

const SITE_NAME = siteConfig.footer.brand.name;
const SITE_URL = siteConfig.url;

const DEFAULT_TITLE = `${SITE_NAME} — смотреть аниме онлайн с озвучкой`;
const DEFAULT_DESCRIPTION =
  'Смотри аниме онлайн с качественной озвучкой. Открывай новые тайтлы, изучай жанры и следи за выходом серий на AniLyfe.';

const DEFAULT_SOCIAL_IMAGE = {
  url: '/preview.jpeg',
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: `${SITE_NAME} — смотреть аниме онлайн`,
};

type SocialImages = NonNullable<Metadata['openGraph']>['images'];

interface BuildMetadataProps {
  /** Document title without the site suffix; " / AniLyfe" is added by the root template. */
  title?: string;
  description?: string;
  /** Path starting with "/" used for the canonical URL and og:url. Defaults to "/". */
  path?: string;
  /** Social preview images; falls back to the branded /preview.jpeg. */
  images?: SocialImages;
  openGraph?: Metadata['openGraph'];
  twitter?: Metadata['twitter'];
  robots?: Metadata['robots'];
}

/**
 * Builds a complete, self-contained Metadata object: canonical, Open Graph,
 * and Twitter Card fields are always filled so child segments never inherit
 * a stale canonical from the root layout.
 */
const buildMetadata = ({
  title,
  description,
  path,
  images,
  openGraph,
  twitter,
  robots,
}: BuildMetadataProps = {}): Metadata => {
  const canonical = path ?? '/';
  const resolvedTitle = title ?? DEFAULT_TITLE;
  // Social titles bypass the root title template, so append the site name here.
  const socialTitle = title ? `${title} / ${SITE_NAME}` : DEFAULT_TITLE;
  const resolvedDescription = description ?? DEFAULT_DESCRIPTION;
  const resolvedImages = images ?? [DEFAULT_SOCIAL_IMAGE];

  return {
    title: title ? title : { default: DEFAULT_TITLE, template: `%s / ${SITE_NAME}` },
    description: resolvedDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'ru_RU',
      url: canonical,
      title: socialTitle,
      description: resolvedDescription,
      images: resolvedImages,
      ...openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: resolvedDescription,
      images: resolvedImages,
      ...twitter,
    },
    robots,
  };
};

export { buildMetadata, SITE_URL };
