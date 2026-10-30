import {writeFile} from 'node:fs/promises';
// Bounded rendered-HTML audit, not a full schema validator or a ranking score.
// AUDIT_BASE can point to a local production build; canonicals stay on production.
// AUDIT_OUTPUT selects the JSON evidence file. At most five requests per second.
const base = process.env.AUDIT_BASE || 'https://cheshbonai.co.il';
const origin = 'https://cheshbonai.co.il';
const clean = s => s.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const attrs = s => Object.fromEntries([...s.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map(m=>[m[1],m[2]]));
const sitemap = await (await fetch(base+'/sitemap.xml')).text();
const seed = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
if (!seed.length) throw new Error('No URLs in sitemap; refusing an empty audit.');
const queue=[...new Set(seed)]; const seen=new Set(queue);const rows=[];let cursor=0;
async function worker(){while(cursor<queue.length){const path=queue[cursor++];const start=Date.now();try{
const r=await fetch(base+path,{signal:AbortSignal.timeout(25000)});const html=await r.text();
const meta=[...html.matchAll(/<meta\b[^>]*>/g)].map(m=>attrs(m[0]));const links=[...html.matchAll(/<a\b[^>]*>/g)].map(m=>attrs(m[0]).href).filter(Boolean);
const internal=[...new Set(links.flatMap(h=>{try{const u=new URL(h,origin+path);return u.origin===origin && !/\.[a-z0-9]{2,5}$/i.test(u.pathname) && !/^\/(api|admin|private|lp)(\/|$)/.test(u.pathname)?[u.pathname]:[]}catch{return[]}}))];
for(const p of internal)if(!seen.has(p)&&seen.size<500){seen.add(p);queue.push(p)}
const schemas=[];let invalidSchema=0;for(const m of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)){try{const j=JSON.parse(m[1]);schemas.push(...(Array.isArray(j)?j:j['@graph']||[j]))}catch{invalidSchema++}}
const canon=[...html.matchAll(/<link\b[^>]*>/g)].map(m=>attrs(m[0])).find(a=>a.rel==='canonical')?.href;
const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]||html;
rows.push({path,status:r.status,final:new URL(r.url).pathname,ms:Date.now()-start,title:clean(html.match(/<title>(.*?)<\/title>/s)?.[1]||''),description:meta.find(m=>m.name==='description')?.content||'',canonical:canon,h1:[...html.matchAll(/<h1\b[^>]*>(.*?)<\/h1>/gs)].map(m=>clean(m[1])),robots:meta.find(m=>m.name==='robots')?.content||'',xrobots:r.headers.get('x-robots-tag')||'',schemaTypes:schemas.map(s=>s['@type']),invalidSchema,internal,twitterTitle:meta.find(m=>m.name==='twitter:title')?.content,ogTitle:meta.find(m=>m.property==='og:title')?.content,ogUrl:meta.find(m=>m.property==='og:url')?.content,timeRequired:schemas.filter(s=>s.timeRequired).map(s=>s.timeRequired),ogImage:meta.find(m=>m.property==='og:image')?.content,imagesMissingAlt:[...main.matchAll(/<img\b[^>]*>/g)].filter(m=>!('alt'in attrs(m[0]))).length});
}catch(e){rows.push({path,error:e.message,internal:[]})}await new Promise(r=>setTimeout(r,1000))}}
await Promise.all(Array.from({length:5},worker));
const issues=[];for(const r of rows){if(r.error||r.status!==200)issues.push({path:r.path,type:'fetch',detail:r.error||r.status});if(!seed.includes(r.path))continue;
const home = rows.find(p=>p.path==='/');
for (const key of ['ogTitle','twitterTitle']) if(r.path!=='/' && r[key] && r[key]===home?.[key] && r.title!==home?.title) issues.push({path:r.path,type:'inherited homepage '+key});
for(const key of ['title','description','canonical','ogImage','ogUrl'])if(!r[key])issues.push({path:r.path,type:'missing '+key});
if(r.h1?.length!==1)issues.push({path:r.path,type:'h1',detail:r.h1});
if(/noindex/i.test(r.robots+' '+r.xrobots))issues.push({path:r.path,type:'noindex in sitemap'});
if(r.canonical && r.canonical.replace(/\/$/,'')!==(origin+r.path).replace(/\/$/,''))issues.push({path:r.path,type:'canonical mismatch',detail:r.canonical});
if(r.ogUrl && r.ogUrl.replace(/\/$/,'')!==(origin+r.path).replace(/\/$/,''))issues.push({path:r.path,type:'og:url mismatch',detail:r.ogUrl});
if(r.timeRequired?.some(t=>!/^PT\d+(?:\.\d+)?M$/.test(t)))issues.push({path:r.path,type:'invalid timeRequired',detail:r.timeRequired});
if(r.invalidSchema)issues.push({path:r.path,type:'invalid JSON-LD'});
if(r.imagesMissingAlt)issues.push({path:r.path,type:'images without alt',detail:r.imagesMissingAlt});
if(r.path!=='/'&&!rows.some(x=>x.path!==r.path&&x.internal.includes(r.path)))issues.push({path:r.path,type:'orphan'});
}
for(const key of ['title','description']){const groups=new Map();for(const r of rows.filter(r=>seed.includes(r.path)&&r[key])){const group=groups.get(r[key])||[];group.push(r.path);groups.set(r[key],group)}for(const [value,paths]of groups)if(paths.length>1)issues.push({type:'duplicate '+key,paths,value})}
const report={base,checkedAt:new Date().toISOString(),sitemap:seed.length,crawled:rows.length,issues,rows};
await writeFile(process.env.AUDIT_OUTPUT || '/tmp/cheshbonai-seo-review.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({sitemap:seed.length,crawled:rows.length,issues},null,2));
process.exitCode = issues.length ? 1 : 0;
