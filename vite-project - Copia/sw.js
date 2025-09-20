import { offlineFallback, warmStrategyCache } from "workbox-recipes";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { registerRoute, Route } from "workbox-routing";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

let cacheName = "Planner-JP-PWA";
let filesToCache = ["/", "/index.html", "css/style.css", "js/main.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

//Configurando o cache

const pageCache = new CacheFirst({
  cacheName: "meu-horario-pwa",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

//indicando o cache da página

warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

//registra a rota
registerRoute(({ request }) => request.mode === "navigate", pageCache);

// configura o cache de assets

registerRoute(
  ({ request }) => ["style", "worker"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: "asset-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

offlineFallback({
  pageFallback: "/offline.html",
});

const imageRoute = new Route(
  ({ request }) => {
    return request.destination === "image";
  },
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);

registerRoute(imageRoute);
