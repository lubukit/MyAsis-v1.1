const CACHE_NAME = "smart-home-dashboard-v49";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./firebase-config.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./assets/pricelist/ecommerce-poster-design.jpg",
  "./assets/pricelist/flyers-design.jpg",
  "./assets/pricelist/poster-social-media.jpg",
  "./assets/pricelist/menu-design.jpg",
  "./assets/pricelist/menu-design-alt.jpg",
  "./assets/pricelist/packaging-design.jpg",
  "./assets/pricelist/bunting-banner-design.jpg",
  "./assets/pricelist/poster-design.jpg",
  "./assets/pricelist/sticker-design.jpg",
  "./assets/pricelist/tiktok-live-design.jpg",
  "./assets/pricelist/logo-branding.jpg"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
