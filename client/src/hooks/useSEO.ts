import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { getMetaForPath } from "@shared/seoMeta";

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

// Для страниц, которые описаны в shared/seoMeta.ts, title, description и canonical
// берутся оттуда — тем же правилом, что использует сервер. Иначе после загрузки JS
// мета-теги расходились с серверными: пропадал город, canonical категорий уходил на /catalog.
// Аргументы title/description применяются только к страницам вне этой карты
// (корзина, КП, лендинги — они и так закрыты от индексации).
export function useSEO(title: string, description: string, keywords?: string, _canonicalPath?: string) {
  const [location] = useLocation();
  const search = useSearch();

  useEffect(() => {
    const meta = getMetaForPath(window.location.pathname, search);
    const finalTitle = meta.matched ? meta.title : title;
    const finalDescription = meta.matched ? meta.description : description;

    document.title = finalTitle;
    setMetaTag("name", "description", finalDescription);
    if (keywords) {
      setMetaTag("name", "keywords", keywords);
    }
    setMetaTag("property", "og:title", finalTitle);
    setMetaTag("property", "og:description", finalDescription);
    setMetaTag("property", "og:url", meta.canonical);
    setMetaTag("name", "twitter:title", finalTitle);
    setMetaTag("name", "twitter:description", finalDescription);
    setCanonical(meta.canonical);
  }, [location, search, title, description, keywords]);
}
