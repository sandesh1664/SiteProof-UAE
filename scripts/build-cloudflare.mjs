import {readFileSync,writeFileSync,mkdirSync,cpSync} from 'node:fs';
const assets={};for(const [name,type] of [['index.html','text/html; charset=utf-8'],['app.js','text/javascript; charset=utf-8'],['style.css','text/css; charset=utf-8']])assets['/'+name]={type,body:readFileSync('public/'+name,'utf8')};
mkdirSync('dist/server',{recursive:true});writeFileSync('dist/server/index.js',readFileSync('cloudflare/worker.mjs','utf8').replace('__ASSETS__',()=>JSON.stringify(assets)));
assets['/app.js'].body+='\n'+readFileSync('cloudflare/ui.mjs','utf8');
assets['/app.js'].body=assets['/app.js'].body.replaceAll('4 * 1024 * 1024','700 * 1024').replaceAll('file.size>4e6','file.size>700000').replaceAll('4 MB','700 KB').replaceAll('4MB','700KB');
assets['/style.css'].body+='\n.cloud-entry{margin-top:20px}.cloud-entry p{font-size:12px;line-height:1.6;color:#777;margin:12px 0}.cloud-entry .text-button{margin-top:8px}.live-demo-note{padding:10px 20px;background:#fff0e8;color:#733b21;font-size:12px;border-bottom:1px solid #e7baa4;position:relative;z-index:10}.cloud-entry+small{margin-top:20px}';
writeFileSync('dist/server/index.js',readFileSync('cloudflare/worker.mjs','utf8').replace('__ASSETS__',()=>JSON.stringify(assets)));
