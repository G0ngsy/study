import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve('dist');
const files = (await readdir(dist)).filter(name => !name.startsWith('.') && name !== 'sw.js').sort();
const hash = createHash('sha256');
for (const name of files) {
  hash.update(name);
  hash.update(await readFile(resolve(dist, name)));
}
const version = hash.digest('hex').slice(0, 16);
const assets = ['/', ...files.map(name => '/' + name)];
const sw = [
  'const CACHE_NAME = ' + JSON.stringify('concept-cards-' + version) + ';',
  'const ASSETS = ' + JSON.stringify(assets) + ';',
  "self.addEventListener('install', event => { event.waitUntil((async () => { const cache = await caches.open(CACHE_NAME); await cache.addAll(ASSETS); await self.skipWaiting(); })()); });",
  "self.addEventListener('activate', event => { event.waitUntil((async () => { const names = await caches.keys(); await Promise.all(names.filter(name => name.startsWith('concept-cards-') && name !== CACHE_NAME).map(name => caches.delete(name))); await self.clients.claim(); })()); });",
  "self.addEventListener('fetch', event => { const request = event.request; const url = new URL(request.url); if(request.method !== 'GET' || url.origin !== self.location.origin || url.pathname === '/sw.js') return; event.respondWith((async () => { const cache = await caches.open(CACHE_NAME); if(request.mode === 'navigate') return (await cache.match('/index.html')) || fetch(request); return (await cache.match(request, { ignoreSearch: true })) || fetch(request); })()); });"
].join('\n') + '\n';
await writeFile(resolve(dist, 'sw.js'), sw);
console.log('Generated offline cache ' + version + ' with ' + assets.length + ' assets');
