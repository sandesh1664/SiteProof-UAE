import {mkdir, readFile, writeFile, copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root = new URL('../', import.meta.url);
const out = new URL('dist/', root);
await mkdir(out, {recursive:true});
for (const name of ['app.js', 'style.css', 'demo.js']) {
  await copyFile(new URL('public/'+name, root), new URL(name, out));
}
const html = await readFile(new URL('public/index.html', root), 'utf8');
await writeFile(new URL('index.html', out), html.replace(
  '<script type="module" src="/app.js"></script>',
  '<script type="module" src="/demo.js"></script><script type="module" src="/app.js"></script>'
));
console.log('Browser-local demo built at '+fileURLToPath(out));
