var cacheName,cacheObjs,cacheObjs2,cacheSync,cacheUrlNotNeeded,offlinePage,offlineUrl,onActivate,onFetch,onGet,onInstall,onInstall1,onPush,onSync,oncatch,publish,pushTag,pushUrl,syncTag,syncUrl,toCacheUrls,urls,hasProp={}.hasOwnProperty;cacheName="Augm",offlinePage="./augm.html",pushTag="PushTest",pushUrl="/app/data/store/Push.json",cacheSync="Sync",syncTag="SyncTest",syncUrl="/app/data/store/Sync.json",offlineUrl="/augm.html",cacheObjs2={Augm:{name:"Augm",status:0,url:"/app/augm/Augm.js"},Vue:{name:"Vue",status:0,url:"/lib/vue/vue.esm.browser.js"},Main:{name:"Main",status:0,url:"/app/augm/Main.js"},Home:{name:"Main",status:0,url:"/app/augm/Home.js"},Router:{name:"Router",status:0,url:"/app/augm/router.js"},VueRouter:{name:"VueRouter",status:0,url:"/lib/vue/vue-router.esm.js"},Roboto:{name:"Roboto",status:0,url:"/css/font/roboto/Roboto.css"},Roll:{name:"Roll",status:0,url:"/app/augm/Augm.roll.js"}},toCacheUrls=function(e){var t,a,s;for(t in s=[],e)hasProp.call(e,t)&&(a=e[t],s.push(a.url));return s},urls=toCacheUrls(cacheObjs={Main:{name:"Main",status:0,url:"/main.html"},Augm:{name:"Augm",status:0,url:"/augm.html"},Muse:{name:"Muse",status:0,url:"/muse.html"}}),publish=(e,t,a=null)=>{},oncatch=(e,t,a)=>{console.error(e,t,a)},onInstall=e=>{e.waitUntil(caches.open(cacheName).then(e=>{var t,a;for(t in publish("Install","------ Open ------"),cacheObjs)hasProp.call(cacheObjs,t)&&(a=cacheObjs[t],fetch(a.url).then(t=>(a.status=t.status,publish("Install",t.status+":"+t.url),e.put(t.url,t))))}).catch(e=>{oncatch("Install","Error",e)}))},onInstall1=e=>{e.waitUntil(caches.open(cacheName).then(e=>(publish("Install","Success"),e.addAll(urls))).catch(e=>{oncatch("Install","Error",e)}))},cacheUrlNotNeeded=e=>"/app/augm/Augm.roll.js"===e,onActivate=e=>{e.waitUntil(caches.keys().then(e=>e.filter(e=>cacheUrlNotNeeded(e))).then(e=>Promise.all(e.map(e=>caches.delete(e)))).then(()=>(self.clients.claim(),publish("Activate","Success"))).catch(e=>{oncatch("Activate","Error",e)}))},onFetch=e=>{e.respondWith(caches.open(cacheName).then(t=>t.match(e.request,{ignoreSearch:!0}).then(a=>a||fetch(e.request).then(a=>(t.put(e.request,a.clone()),publish("Fetch","Success",e.request.url),a)))).catch(t=>oncatch("Fetch",e.request.url,t)))},onGet=e=>{"GET"===e.request.method&&(console.log("Worker.onGet()",e.request),e.respondWith(caches.match(e.request).then(t=>{var a;return a=fetch(e.request).then(t=>{var a;return a=t.clone(),caches.open(cacheName).then(e=>{},cache.put(e.request,a),publish("Get","Success")),t}).catch(e=>(caches.match(offlinePage),oncatch("Get","Error",e))),t||a})))},onPush=e=>{e.data.text()===pushTag&&e.waitUntil(caches.open(cacheName)).then(e=>fetch(pushUrl).then(t=>{var a;return e.put(pushUrl,t.clone()),a=t.json(),publish("Push",pushTag,a),a}))},onSync=e=>{e.tag===syncTag&&e.waitUntil(caches.open(cacheSync).then(e=>e.add(syncUrl)))},self.addEventListener("install",onInstall),self.addEventListener("activate",onActivate),self.addEventListener("fetch",onFetch);