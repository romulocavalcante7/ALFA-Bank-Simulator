// ALFA Bank – Service Worker
// Estratégia: Cache First para assets estáticos, Network First para rotas dinâmicas

const CACHE_NAME = "ngb-bank-v1";

// Assets que serão cacheados durante a instalação
const PRECACHE_URLS = [
    "/",
    "/dashboard",
    "/manifest.json",
];

// ── Install ──────────────────────────────────────────────────
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_URLS).catch(() => {
                // Ignora falhas individuais (ex.: rotas que retornam redirect)
            });
        })
    );
    self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
    const { request } = event;

    // Ignora requisições não-GET e extensões dev do Vite
    if (request.method !== "GET") return;
    if (request.url.includes("hot-update") || request.url.includes("__vite")) return;

    // Para navegação (HTML), tenta Network e cai no cache (Offline support)
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request).catch(() =>
                caches.match("/").then((cached) => cached || new Response("App offline", { status: 503 }))
            )
        );
        return;
    }

    // Para assets estáticos: Cache First
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                // Só cacheia respostas válidas
                if (!response || response.status !== 200 || response.type === "opaque") {
                    return response;
                }
                const toCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, toCache));
                return response;
            });
        })
    );
});
