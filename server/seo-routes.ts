export const BASE = "https://zeroprint.kz";

// Единственный источник правды: какие страницы реально существуют
export const STATIC_ROUTES: string[] = [
  "/",
  "/catalog",
  "/poligrafiya",
  "/portfolio",
  "/about",
  "/kontakty",
  "/uslugi/vyshivka",
  "/uslugi/pechat",
  "/uslugi/poshiv",
  "/uslugi/brendirovanie",
  "/uslugi/horeca",
  "/uslugi/stroitelstvo",
  "/uslugi/shkoly",
  "/uslugi/it-ofis",
  "/uslugi/proizvodstvo",
];

// Существуют, но закрыты от индексации
export const PRIVATE_PREFIXES = ["/cart", "/account", "/manager", "/kp/", "/landing"];

// Старый адрес -> новый, отдаём 301
export const REDIRECTS: Record<string, string> = {
  "/poshiv": "/uslugi/poshiv",
  "/index.html": "/",
  "/uslugi": "/",
  "/vyshivka": "/uslugi/vyshivka",
  "/pechat": "/uslugi/pechat",
  "/brendirovanie": "/uslugi/brendirovanie",
  "/horeca": "/uslugi/horeca",
  "/katalog": "/catalog",
};

export const PRODUCT_PATH = /^\/catalog\/product\/([A-Za-z0-9._-]+)$/;

export function isKnownPath(p: string): boolean {
  if (STATIC_ROUTES.includes(p)) return true;
  if (PRIVATE_PREFIXES.some((x) => p === x || p.startsWith(x))) return true;
  if (PRODUCT_PATH.test(p)) return true;
  return false;
}
