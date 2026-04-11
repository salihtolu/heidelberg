
const CACHE = 'hd-pro-v4';
const ANA_DOSYA = '/heidelberg/heidelberg_pro_teshis_v3_ios.html';

// Kurulum: dosyayı cache'e al
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.add(ANA_DOSYA);
    }).then(() => self.skipWaiting())
  );
});

// Aktivasyon: eski cache'i temizle
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

// Her istek: önce cache, internet yoksa cache'den ver
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // İnternetten geldi → cache'e kaydet
        const clone = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => {
        // İnternet yok → cache'den ver
        return caches.match(e.request).then(r => r || caches.match(ANA_DOSYA));
      })
  );
});
