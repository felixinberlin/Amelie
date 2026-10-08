import { useLayoutEffect, useRef } from 'react';
import { parsePageRoute } from './routes';
import metadata from 'virtual:site-metadata';
import { useLocation, useNavigationType } from 'react-router-dom';

const positions = new Map<string, number>();

/** Run after lazy content commits, when its height is available for restoration. */
export function RouteEffects({ title, missing }: { title?: string; missing: boolean }) {
  const location = useLocation();
  const type = useNavigationType();
  const previousPath = useRef(location.pathname);
  useLayoutEffect(() => {
    const page = metadata.pages[location.pathname];
    document.title = missing ? 'Page not found — Amélie' : title ? `${title} — Amélie` : page?.title ?? 'Amélie';
    document.documentElement.lang = new URLSearchParams(location.search).get('lang')?.match(/^(de|en|es)$/)?.[0] ?? 'en';
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]']) {
      document.querySelector(selector)?.setAttribute('content', missing ? 'The requested page is unavailable.' : page?.description ?? 'Ideas and tools given away as public goods.');
    }
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    const canonical = document.querySelector('link[rel="canonical"]');
    canonical?.setAttribute('href', `https://felixinberlin.github.io${import.meta.env.BASE_URL}${location.pathname.slice(1)}`);
  }, [location.pathname, location.search, title, missing]);

  useLayoutEffect(() => {
    const route = parsePageRoute(location.pathname, location.search);
    if (type === 'REPLACE' && previousPath.current === location.pathname) {
      // Query-only edits keep the current reading position.
    } else if (type === 'POP' && positions.has(location.key)) {
      window.scrollTo(0, positions.get(location.key)!);
    } else if (route.kind === 'dose' && route.chapter) {
      document.getElementById('dose-book')?.scrollIntoView();
    } else if (location.hash && !/^#\/?(?:dose|sim|compare|venture)[=/]/.test(location.hash)) {
      let id = location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Keep the literal anchor. */ }
      document.getElementById(id)?.scrollIntoView();
    } else window.scrollTo(0, 0);
    previousPath.current = location.pathname;
    const main = document.getElementById('main-content');
    if (main) { main.dataset.routeReady = 'true'; main.dataset.routePath = location.pathname; }
    // History traversal restores native focus after popstate; defer our focus to the next task.
    const focusTask = window.setTimeout(() => main?.focus({ preventScroll: true }), 0);
    const save = () => positions.set(location.key, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => { window.clearTimeout(focusTask); save(); if (main) { delete main.dataset.routeReady; delete main.dataset.routePath; } window.removeEventListener('scroll', save); };
  }, [location.key, location.hash, type]);
  return null;
}
