// Form Filler moved to https://formfiller-app.github.io/form-filler/ on 2026-11-21. This takes the place of the
// service worker an earlier version left at this address, so a copy kept for offline use, or put on a home screen,
// stops opening the old version: every page opened from now on comes from the network (the page saying where Form
// Filler went), or, with no connection, is a short note made here. A copy of the old version that is already open
// keeps getting its own files from what it kept, so nothing typed into it is lost; it then reloads into the new page
// by itself when nothing is open in it. This keeps nothing new, and the page removes what the old one kept.
const MOVED = 'https://formfiller-app.github.io/form-filler/';
const OFFLINE = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
  '<title>Form Filler has moved</title><h1>Form Filler has moved</h1><p>It is now at <a href="' + MOVED + '">' + MOVED + '</a>. ' +
  'This device has no connection: open that address once it does.</p></html>';
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => new Response(OFFLINE, { headers: { 'content-type': 'text/html; charset=utf-8' } })));
    return;
  }
  event.respondWith(caches.match(request, { ignoreSearch: true }).then(kept => kept || fetch(request)));
});
