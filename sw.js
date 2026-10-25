// Service worker : permet de lancer l'appli sans connexion.
// - Les pages (index.html) : réseau d'abord, pour récupérer la dernière version ; sinon le cache.
// - Le reste (JS, CSS, images) : cache d'abord. Vite ajoute un hash au nom de ces fichiers,
//   une nouvelle version porte donc un nouveau nom et n'est jamais masquée par le cache.
// Ce fichier n'est pas transformé par Vite : il est écrit en JavaScript ancien
// (pas de ?., ni d'async/await, ni de const) pour Safari 12.

var CACHE_NAME = 'alphalearn-v1'

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.add('./')
    }).then(function () {
      return self.skipWaiting()
    })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames.filter(function (cacheName) {
        return cacheName !== CACHE_NAME
      }).map(function (outdatedCacheName) {
        return caches.delete(outdatedCacheName)
      }))
    }).then(function () {
      return self.clients.claim()
    })
  )
})

function storeResponseInCache(request, response) {
  if (response.ok) {
    var responseCopy = response.clone()
    caches.open(CACHE_NAME).then(function (cache) {
      cache.put(request, responseCopy)
    })
  }
  return response
}

function fetchPageFromNetworkThenCache(request) {
  return fetch(request).then(function (response) {
    return storeResponseInCache(request, response)
  }).catch(function () {
    return caches.match(request).then(function (cachedResponse) {
      return cachedResponse || caches.match('./')
    })
  })
}

function fetchAssetFromCacheThenNetwork(request) {
  return caches.match(request).then(function (cachedResponse) {
    return cachedResponse || fetch(request).then(function (response) {
      return storeResponseInCache(request, response)
    })
  })
}

self.addEventListener('fetch', function (event) {
  var request = event.request
  var isSameOriginGetRequest = request.method === 'GET' && new URL(request.url).origin === self.location.origin
  if (!isSameOriginGetRequest) return

  if (request.mode === 'navigate') {
    event.respondWith(fetchPageFromNetworkThenCache(request))
  } else {
    event.respondWith(fetchAssetFromCacheThenNetwork(request))
  }
})
