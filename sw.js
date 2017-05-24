/**
 * Created by Stevenzwzhai on 2017/2/28.
 */
console.log('Script loaded!')
var cacheVersion = 'm-pwa'

var cacheList = [
	'/',
	"index.html",
	"main.css",
	"a.png"
]

//install

self.addEventListener('install', (event) =>{
    // 如果查到文件没有缓存，则会发送请求去获取，并且会带上 cache-bust 的 query string
    console.log('install');
    self.skipWaiting()
    event.waitUntil(
        caches.open(cacheVersion)
            //箭头函数在这里将缓存返回
            .then(cache => cache.addAll(cacheList))
            .then(() => self.skipWaiting())
    )
})

//缓存捕获
self.addEventListener('fetch', (event) => {
    console.log('fetch', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if(response){
                    return response;
                }
                console.log(event.request, event.request.url);
                return fetch(event.request);
            })
    )
})

//update更新
self.addEventListener('activate', (event) => {
    console.log('update');
    event.waitUntil(
        //会
  
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cachename => {
                    if(cachename == cacheVersion){
                        return caches.delete(cachename);
                    }
                })
            ).then(() => {
                return self.clients.claim()
            })
        })
        
    )
})
