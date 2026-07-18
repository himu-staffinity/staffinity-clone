const description_en = `Staffinity.AI is an innovative company that develops software solutions for recruitment. Our experienced team offers tailored services that promote the success of our clients.`;
const description_de = `Staffinity.AI ist ein innovatives Unternehmen, das Softwarelösungen für die Personalbeschaffung entwickelt. Unser erfahrenes Team bietet maßgeschneiderte Dienstleistungen, die den Erfolg unserer Kunden fördern.`;

export const SITE_DE = {
  title: 'Staffinity.AI',
  email: 'info@staffinity.ai',
  description: description_de,
  url: 'https://staffinity.ai',
  baseurl: '',
  twitter: 'staffinity',
  twitter_username: 'staffinity',
  github_username: 'staffinity',
  linkedin: 'https://www.linkedin.com/company/staffinity-technologies-gmbh/',
  phone: '+491631944738',
  cloudflare_image_base: '/cdn-cgi/image/format=webp',
};

export const SITE_EN = {
  ...SITE_DE,
  description: description_en,
};

// Default SITE for backwards compatibility (German)
export const SITE = {
  ...SITE_DE,
};

// Locale-aware site config lookup
export function getSite(locale: string) {
  return locale === 'en' ? SITE_EN : SITE_DE;
}
