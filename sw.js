// Service worker : permet de lancer l'appli sans connexion.
// - Les pages (index.html) : réseau d'abord, pour récupérer la dernière version ; sinon le cache.
// - Le reste (JS, CSS, images) : cache d'abord. Vite ajoute un hash au nom de ces fichiers,
//   une nouvelle version porte donc un nouveau nom et n'est jamais masquée par le cache.
// Écrit en JavaScript ancien (pas de ?. ni d'async/await) pour Safari 12 et 13.

var CACHE = 'alphalearn-v1'

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.add('./')
    }).then(function () {
      return self.skipWaiting()
    })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (noms) {
      return Promise.all(noms.filter(function (nom) {
        return nom !== CACHE
      }).map(function (nom) {
        return caches.delete(nom)
      }))
    }).then(function () {
      return self.clients.claim()
    })
  )
})

function enregistrer(requete, reponse) {
  if (reponse.ok) {
    var copie = reponse.clone()
    caches.open(CACHE).then(function (cache) {
      cache.put(requete, copie)
    })
  }
  return reponse
}

self.addEventListener('fetch', function (event) {
  var requete = event.request
  if (requete.method !== 'GET' || new URL(requete.url).origin !== self.location.origin) return

  if (requete.mode === 'navigate') {
    event.respondWith(
      fetch(requete).then(function (reponse) {
        return enregistrer(requete, reponse)
      }).catch(function () {
        return caches.match(requete).then(function (enCache) {
          return enCache || caches.match('./')
        })
      })
    )
    return
  }

  event.respondWith(
    caches.match(requete).then(function (enCache) {
      return enCache || fetch(requete).then(function (reponse) {
        return enregistrer(requete, reponse)
      })
    })
  )
})
