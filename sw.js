"use strict";

const CACHE = "v1";

const fromNetwork = (request) =>
  fetch(request).then((response) => {
    caches.open(CACHE).then((cache) => cache.put(request, response.clone()));

    return response.clone();
  });

const fromCache = (request) =>
  caches
    .open(CACHE)
    .then((cache) =>
      cache
        .match(request)
        .then((matching) => matching || Promise.reject("no-match"))
    );

const update = (event, response) => {
  event.waitUntil(
    fetch(event.request).then((response2) =>
      caches.open(CACHE).then((cache) => cache.put(event.request, response2))
    )
  );

  return response;
};

const files = [
  "index.html",
  "style.css",
  "module.js",
  "icons/favicon.svg",
  "icons/icon512.png",
  "sw.js",
  "manifest.webmanifest",
];

self.addEventListener("install", (event) =>
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(files)))
);

self.addEventListener("fetch", (event) =>
  event.respondWith(
    fromCache(event.request)
      .then((response) => update(event, response))
      .catch(() => fromNetwork(event.request))
  )
);
