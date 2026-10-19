/* Service worker Lumimon. Lingkupnya HANYA halaman game (didaftarkan dengan scope = alamat halaman), jadi halaman lain di situs sekolah tidak tersentuh.
   Halaman game: jaringan dulu (4 dtk) lalu salinan, supaya update langsung terpakai saat ada sinyal. Ikon/manifest & Google Fonts: salinan dulu. Online (Supabase) tidak disimpan. */
const CACHE = 'lumimon-v90', PAGE = 'tes-metaverse.html';
const CORE = ['./' + PAGE, './lumimon.webmanifest', './lumimon-192.png', './lumimon-512.png', './lumimon-maskable-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('lumimon-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
const keep = (key, res) => { if (res && (res.ok || res.type === 'opaque')) { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(key, c)); } return res; };
const timeout = (p, ms) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error('lambat')), ms))]);
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (r.mode === 'navigate') { e.respondWith(timeout(fetch(r), 4000).then(res => keep('./' + PAGE, res)).catch(() => caches.match('./' + PAGE))); return; }
  if (u.origin === location.origin && /\/lumimon[-.]/.test(u.pathname)) { e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => keep(r, res)))); return; }
  if (/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.host)) e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => keep(r, res))));
});
