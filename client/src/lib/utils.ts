import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DIRECT_IMAGE_DOMAINS = ['s.a-5.ru', 'cdn.', 'img.', 'images.', 'static.', 'media.'];

export function proxyImage(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('/')) return url;
  if (typeof window !== 'undefined' && url.includes(window.location.hostname)) return url;
  // These CDN domains serve images without hotlink protection - load directly
  if (DIRECT_IMAGE_DOMAINS.some(d => url.includes(d))) return url;
  return '/api/img?url=' + encodeURIComponent(url);
}
