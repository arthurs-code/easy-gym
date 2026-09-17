'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../Publish');
async function main(){
  const code=fs.readFileSync(path.join(root,'js/app.js'),'utf8');
  let dialog;
  const context={t:key=>key,showEasyGymDialog:options=>{dialog=options;return Promise.resolve(true);},alert(){throw Error('Browser alert is forbidden');}};
  const notice=code.match(/function showAppStoreShareNotice\(\)\{[\s\S]*?\n  \}/)[0];
  const share=code.match(/async function sharePlanLink\(\)\{[^}]*\}/)[0];
  vm.runInNewContext(notice+'\n'+share,context);
  await context.sharePlanLink();
  assert.equal(dialog.message,'SHARE available in App-Store Version');
  assert.equal(dialog.notice,true);assert.equal(dialog.hideTitle,true);
  assert(code.includes("els.planShareLinkBtn.addEventListener('click', sharePlanLink)"));
  assert(code.includes("els.sharePlanBtn.addEventListener('click', showAppStoreShareNotice)"));
  const prefix=code.match(/const PACKAGE_PREFIX = (.*);/)[1];
  const originalScope='https://example.test/easy-gym/SEPT/';
  const same=vm.runInNewContext(prefix,{URL,window:{location:{href:originalScope}}});
  const nested=vm.runInNewContext(prefix,{URL,window:{location:{href:originalScope+'index.html'}}});
  const other=vm.runInNewContext(prefix,{URL,window:{location:{href:'https://example.test/easy-gym/OTHER/'}}});
  assert.equal(same,nested);assert.notEqual(same,other);
  assert.equal(same,'easyGym.pwaTest.'+encodeURIComponent('/easy-gym/SEPT/')+'.');
  const events={},buckets=new Map(),deleted=[];
  const absolute=input=>new URL(typeof input==='string'?input:input.url,originalScope).href;
  const load=input=>{
    const url=new URL(absolute(input));
    let relative=decodeURIComponent(url.pathname.slice(new URL(originalScope).pathname.length));
    if(!relative||relative.endsWith('/'))relative+='index.html';
    const file=path.resolve(root,relative);assert(file.startsWith(root+path.sep),'Unexpected cache path');
    return new Response(fs.readFileSync(file));
  };
  function bucket(name){
    if(!buckets.has(name))buckets.set(name,new Map());
    const entries=buckets.get(name);
    return {async addAll(urls){for(const url of urls)entries.set(absolute(url),load(url));},async match(url){return entries.get(absolute(url))?.clone();},async put(url,response){entries.set(absolute(url),response.clone());}};
  }
  const swContext={URL,Response,fetch:async()=>{throw Error('offline');},caches:{open:async name=>bucket(name),keys:async()=>[...buckets.keys()],delete:async name=>{deleted.push(name);return buckets.delete(name);}},self:{registration:{scope:originalScope},skipWaiting(){},clients:{claim(){}},addEventListener:(event,handler)=>{events[event]=handler;}}};
  const info=vm.runInNewContext(fs.readFileSync(path.join(root,'service-worker.js'),'utf8')+'\n;({CACHE,CACHE_PREFIX,ASSETS});',swContext);
  const old=info.CACHE_PREFIX+'v316x-r1';buckets.set(old,new Map());
  const unrelated='easy-gym-pwa-test:'+encodeURIComponent('https://example.test/easy-gym/OTHER/')+':v316x-r1';buckets.set(unrelated,new Map());
  let pending;
  events.install({waitUntil:p=>{pending=p;}});await pending;
  assert.equal(buckets.get(info.CACHE).size,new Set(info.ASSETS.map(absolute)).size,'Not all assets were cached');
  events.activate({waitUntil:p=>{pending=p;}});await pending;
  assert(deleted.includes(old));assert(!deleted.includes(unrelated));assert(buckets.has(unrelated));
  const offline=async(relative,mode)=>{events.fetch({request:{url:absolute(relative),mode},respondWith:p=>{pending=p;}});return await pending;};
  const script=await offline('./js/app.js?v=317X','cors');assert.equal(script.status,200);assert((await script.text()).includes('SHARE available in App-Store Version'));
  const html=await offline('./unknown-page','navigate');assert.equal(html.status,200);assert((await html.text()).includes('generated/content.js'));
  const missing=await offline('./missing.js','cors');assert.equal(missing.type,'error','Missing JS must not receive HTML');
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
  assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');assert.equal(manifest.id,'./');assert.equal(manifest.display,'standalone');
  console.log('PWA PASS: exact custom SHARE popup, both SHARE controls, storage-path stability, scoped cache cleanup, offline assets/navigation and standalone manifest.');
}
main().catch(e=>{console.error(e.stack);process.exitCode=1;});
