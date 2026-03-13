import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function proxyImage(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('/') || url.includes(window.location.hostname)) {
    return url;
  }
  return '/api/img?url=' + encodeURIComponent(url);
}
