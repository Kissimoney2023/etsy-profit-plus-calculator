
import { Metadata } from 'next';
import { ROUTES, SITE } from './seo';

export function buildMetadata(path: string): Metadata {
  const route = ROUTES.find((r) => r.path === path) || ROUTES[0];
  const url = `${SITE.url}${path}`;

  return {
    title: route.title,
    description: route.description,
    keywords: route.keywords,
    alternates: {
      canonical: url,
    },
    robots: route.noindex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: route.title,
      description: route.description,
      url: url,
      siteName: SITE.name,
      images: [
        {
          url: SITE.defaultOgImage,
          width: 1200,
          height: 630,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: route.title,
      description: route.description,
      creator: SITE.twitterHandle,
      images: [SITE.defaultOgImage],
    },
  };
}
