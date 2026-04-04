// ── Pé na Areia · Service Worker ──
// Versão do cache — mude esse número sempre que atualizar os arquivos
const CACHE_VERSION = 'pe-na-areia-v1';

// Arquivos que ficam em cache pra funcionar offline
const CACHE_STATIC = [
  '/',
  '/index.html',
  '/login.html',
  '/agendamento.html',
  '/meus-agendamentos.html',
  '/perfil.html',
  '/configuracoes.html',
  '/manifest.json'
];

// ── INSTALL: salva os arquivos estáticos no cache ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(CACHE_STATIC);
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: limpa caches antigos ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: estratégia Network First com fallback para cache ──
// Para o Firebase e APIs externas sempre vai direto pra rede.
// Para os arquivos do app tenta a rede primeiro, e se falhar serve do cache.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignora requests não-GET e APIs externas (Firebase, Google Fonts, etc.)
  if (event.request.method !== 'GET') return;
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('fonts.googleapis.com')
  ) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Salva a resposta fresca no cache enquanto serve
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Sem rede: serve do cache
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // Fallback para o index se nada for encontrado
          return caches.match('/index.html');
        });
      })
  );
});
