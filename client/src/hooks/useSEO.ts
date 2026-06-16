import { useEffect } from "react";

const CANONICAL_BASE = "https://zeroprint.kz";

function setMetaTag(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO(title: string, description: string, keywords?: string, canonicalPath?: string) {
  useEffect(() => {
    document.title = title;
    setMetaTag("name", "description", description);
    if (keywords) {
      setMetaTag("name", "keywords", keywords);
    }
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);

    // Canonical — prevents duplicate content across replit.app and zeroprint.kz
    const path = canonicalPath ?? window.location.pathname;
    setCanonical(CANONICAL_BASE + path);
  }, [title, description, keywords, canonicalPath]);
}
