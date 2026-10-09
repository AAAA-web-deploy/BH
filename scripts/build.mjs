import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
await fs.rm(output, {recursive:true, force:true});
await fs.mkdir(path.join(output, 'assets', 'web'), {recursive:true});
await fs.mkdir(path.join(output, 'assets', 'png'), {recursive:true});
for (const file of ['styles.css','app.js','site-config.js']) {
  await fs.copyFile(path.join(root,file), path.join(output,file));
}
let html = await fs.readFile(path.join(root,'index.html'),'utf8');
const context = {window:{}};
vm.runInNewContext(await fs.readFile(path.join(root,'site-config.js'),'utf8'),context);
try {
  const site = new URL(context.window.BOTHR_CONFIG.siteUrl);
  if (site.protocol === 'https:') {
    const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
    const base = site.href.endsWith('/') ? site.href : site.href + '/';
    const image = new URL('assets/web/banner-1920x640.jpg',base).href;
    html = html.replace('<meta property="og:url" content="">','<meta property="og:url" content="'+escape(site.href)+'">');
    html = html.replace('<meta property="og:image" content="">','<meta property="og:image" content="'+escape(image)+'">');
  }
} catch { /* Keep unannounced publication metadata empty. */ }
await fs.writeFile(path.join(output,'index.html'),html);
await fs.cp(path.join(root,'assets','web'), path.join(output,'assets','web'), {recursive:true});
for (const file of await fs.readdir(path.join(root,'assets','png'))) {
  await fs.copyFile(path.join(root,'assets','png',file), path.join(output,'assets','png',file));
}
console.log('Static site exported to dist/. No dependencies were installed.');
