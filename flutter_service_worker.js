'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "18fef65274a4d9a6b8ebbecac2e5e0de",
"assets/assets/act_complete_icon.png": "e9cb6af90de09140ea5e7a71990490ee",
"assets/assets/alert_empty.png": "30fac4016b7af86cfddd1410353a8d6a",
"assets/assets/battery_new_1.png": "4c61f0e233eae2e4a61802e2e4347e48",
"assets/assets/circle_rgb.jpg": "52a46dd8bc1ff7433c0bd7dc79077091",
"assets/assets/dashboard_icons/co2.png": "1f020ecb0838b25ea1b1cd542ae88ef5",
"assets/assets/dashboard_icons/hcoh.png": "0eb32f186c2c7eb89a04d7992e3886ad",
"assets/assets/dashboard_icons/humidity.png": "f393bc1d697974779d8036b7f0f7eeee",
"assets/assets/dashboard_icons/pm10.png": "5b3d6889ae19906257c6b3b21662cd80",
"assets/assets/dashboard_icons/pm2.png": "a4859e008a4eb622f9fb4f53d53a6b3f",
"assets/assets/dashboard_icons/temperature.png": "1a64c86b5b903c834bab4166afb70cbb",
"assets/assets/dashboard_icons/voc.png": "6b1e4a5bb61dd2ef6240e8d6086f6559",
"assets/assets/emd_icon.png": "8a2e1ea04ca1f80521603aa332f86ead",
"assets/assets/empty_device.png": "7fbc6c54052d6529a0c2d18eb7a94db1",
"assets/assets/ic_customer_care.png": "713636eb61b214759466db04162a6c46",
"assets/assets/ic_half_icon.png": "7ccc0b88439156b24a1533c8c674a8e8",
"assets/assets/ic_my_products.png": "8176aced819df39476b14f0467fdc6a4",
"assets/assets/ic_service_req.png": "a270c0fb2092d326ebc0489f641f69bb",
"assets/assets/ic_wifi_4.png": "fcd54b6df6743bf969efb7dbf058e279",
"assets/assets/ic_wifi_full.webp": "14de6faf51a6ae5653fc312a3ec96e0d",
"assets/assets/info_request.png": "993cfae45736a24d833e66e189e207bf",
"assets/assets/liquid_new_1.png": "8862063c2bd0af3547854ee75836e857",
"assets/assets/onboard_image.png": "25844887ff26c4287d78ba4bc797631d",
"assets/assets/pinch_zoom.png": "40d4c9b155701c22e45bd8a9661f0c05",
"assets/assets/stations_round_bg.png": "6fb824ac76e42b1cdf6a54a616b88922",
"assets/assets/threshold_icons/co2_icon.png": "daf61d49a8ac6f0765929491768e513a",
"assets/assets/threshold_icons/humidity_icon.png": "18ae7a78e27f1d99cf9571f171244402",
"assets/assets/threshold_icons/motion_icon.png": "e10ea5aaf82c108a51bad7da3ebe12d0",
"assets/assets/threshold_icons/temp_icon.png": "c0949ee527dacd9dbbff86faf8e1854c",
"assets/assets/threshold_icons/voc_icon.png": "d5376c9298cb8953c35d83b53377ab76",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "031708127c5ba8994587a6a24300c921",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "d8f8ddef149129ac4c528484a3ac0271",
"/": "d8f8ddef149129ac4c528484a3ac0271",
"main.dart.js": "db9e469642e54e49f632b606aaa7f831",
"manifest.json": "71e0154c18320c9ca4cbf26c3e30935d",
"version.json": "21b60d415374031526ebe304809a0f7a"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
