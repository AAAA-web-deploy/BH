import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
for (const file of ['app.js','site-config.js']) new vm.Script(read(file), {filename:file});
const context = {window:{}};
vm.runInNewContext(read('site-config.js'),context);
assert.equal(context.window.BOTHR_CONFIG.chainId,1);
const html = read('index.html');
for (const match of html.matchAll(/(?:src|href|srcset)="([^"]+)"/g)) {
  const value = match[1];
  if (value.startsWith('#') || /^https?:/.test(value)) continue;
  for (const part of value.split(',')) {
    const file = part.trim().split(/\s+/)[0];
    assert(fs.existsSync(path.join(root,file)), 'Missing local file: ' + file);
  }
}
for (const file of ['meme-01-human-error','meme-02-case-reopened','meme-03-clarification-required','meme-04-work-24-7']) {
  for (const ext of ['png','webp']) assert(fs.existsSync(path.join(root,'assets',ext === 'png' ? 'png' : 'web',file+'.'+ext)));
}
const manifest = JSON.parse(read('docs/asset-manifest.json'));
assert.equal(manifest.distinct_designs,11);
assert.equal(manifest.assets.filter(a => a.kind === 'story').length,5);
for (const asset of manifest.assets) {
  for (const key of ['png','web']) assert(fs.existsSync(path.join(root,asset[key].file)), 'Missing manifest asset');
}
const banner = manifest.assets.find(a => a.kind === 'banner').png;
assert.equal(banner.width,3*banner.height);
const logo = manifest.assets.find(a => a.kind === 'logo').png;
assert.deepEqual(logo.alpha_range,[0,255]);
assert.deepEqual(logo.corner_alpha,[0,0,0,0]);
console.log('Checks passed: JavaScript syntax, local assets, five story scenes, four memes, 3:1 banner, transparent logo.');
