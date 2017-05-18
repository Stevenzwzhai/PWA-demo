/**
 * Created by Stevenzwzhai on 2017/2/28.
 */
console.log('Script loaded!')
var cacheStorageKey = 'm-pwa'

var cacheList = [
	'/',
	"index.html",
	"main.css",
	"a.png"
]

self.addEventListener('install', function(e) {
	console.log('Cache event!')
	e.waitUntil(
		caches.open(cacheStorageKey).then(function(cache) {
			console.log('Adding to Cache:', cacheList)
			//如果是一些大文件或者不稳定文件可以选择不返回cache.addAll，小文件再返回
			return cache.addAll(cacheList)
		}).then(function() {
			console.log('Skip waiting!')
			//更新的时候，新的sw不必等待，而是可以直接接管当前页面。
			return self.skipWaiting()
		})
	)
})

self.addEventListener('activate', function(e) {
	console.log('Activate event')
	e.waitUntil(
		Promise.all(
			caches.keys().then(cacheNames => {
				return cacheNames.map(name => {
					if (name !== cacheStorageKey) {
		return caches.delete(name)
	}
})
})
	).then(() => {
		console.log('Clients claims.')
	return self.clients.claim()
})
	)
})

self.addEventListener('fetch', function(e) {
	// console.log('Fetch event:', e.request.url)
	e.respondWith(
		caches.match(e.request).then(function(response) {
			if (response != null) {
				console.log('Using cache for:', e.request.url)
				return response
			}
			console.log('Fallback to fetch:', e.request.url)
			return fetch(e.request.url)
		})
	)
})
