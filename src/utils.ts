export type Locale = "de" | "en";

export const defaultLang: Locale = "de";
export const languages: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
} as const;

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang === "en" || lang === "de") return lang as Locale;
  return defaultLang;
}

export function getRouteFromUrl(url: URL): string {
  const [, lang, ...route] = url.pathname.split('/').filter(Boolean);
  if (lang === "en" || lang === "de") {
    return route.join('/');
  }
  return [lang, ...route].join('/');
}

export function getLocalizedPath(currentPath: string, locale: Locale): string {
  const pathSegments = currentPath.replace(/^\/+/, '').split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const isLocaleInPath = firstSegment === "en" || firstSegment === "de";
  const pathWithoutLocale = isLocaleInPath ? pathSegments.slice(1) : pathSegments;
  const newPath = '/' + pathWithoutLocale.join('/');
  return locale === defaultLang ? newPath || '/' : `/${locale}${newPath}`;
}

export function getLangFromParams(params: { lang?: string }): Locale {
  if (params.lang === "en" || params.lang === "de") return params.lang as Locale;
  return defaultLang;
}

/** params for matching langauge based dynamic paths */
export function getStaticPathsLang() {
  return Object.keys(languages).filter(l => l !== defaultLang).map((lang) => ({ params: { lang } }));
}
