#!/usr/bin/env node
'use strict';
// Dependency-free builder. Canonical editable text lives in Content/, not Web/generated/.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, 'Source');
const checkOnly = process.argv.includes('--check');
const outputs = new Map();
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const parse = file => { try { return JSON.parse(read(file)); } catch (error) { throw new Error(`${file}: ${error.message}`); } };
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
function walk(dir, prefix = '') {
  return fs.readdirSync(dir, {withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en')).flatMap(entry => {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') return [];
    assert(!entry.isSymbolicLink(), `Symlink not supported: ${prefix}${entry.name}`);
    const name = prefix + entry.name;
    return entry.isDirectory() ? walk(path.join(dir,entry.name),name+'/') : [name];
  });
}
function compareShape(reference, candidate, location) {
  if (Array.isArray(reference)) {
    assert(Array.isArray(candidate) && candidate.length === reference.length, `${location}: expected ${reference.length} entries`);
    reference.forEach((value,i)=>compareShape(value,candidate[i],`${location}[${i}]`));
  } else if (object(reference)) {
    assert(object(candidate), `${location}: expected an object`);
    assert(JSON.stringify(Object.keys(reference).sort())===JSON.stringify(Object.keys(candidate).sort()), `${location}: translation keys differ from English`);
    for (const key of Object.keys(reference)) compareShape(reference[key],candidate[key],`${location}.${key}`);
  } else assert(typeof reference===typeof candidate, `${location}: expected ${typeof reference}`);
}
function build() {
  for(const file of walk(WEB))outputs.set('Publish/'+file,fs.readFileSync(path.join(WEB,file)));

  const config = parse('Content/languages.json');
  assert(Array.isArray(config.enabled) && config.enabled.length > 0, 'languages.json: enabled must be a nonempty array');
  assert(config.enabled.every(code=>typeof code==='string' && /^[a-z][a-z0-9-]*$/.test(code)), 'Invalid language code');
  assert(new Set(config.enabled).size===config.enabled.length, 'Duplicate enabled language');
  assert(config.enabled.includes(config.defaultLanguage), 'defaultLanguage must be enabled');
  const codes = fs.readdirSync(path.join(ROOT,'Content'),{withFileTypes:true}).filter(e=>e.isDirectory() && /^[a-z][a-z0-9-]*$/.test(e.name)).map(e=>e.name).sort();
  assert(codes.includes('en'), 'English is required as the fallback language');
  assert(config.enabled.every(code=>codes.includes(code)), 'Enabled language is missing a Content/<code>/ directory');
  const english = parse('Content/en/ui.json');
  assert(object(english) && typeof english.langName==='string', 'English UI dictionary invalid');
  assert(!('aboutHtml' in english), 'Edit info.html for INFO, not ui.json');
  assert(english.months.length===12 && Object.keys(english.days).length===7, 'English calendar needs 12 months and 7 days');
  const library = parse('Content/exercise-library.json');
  assert(Array.isArray(library) && library.length>0 && library.every(v=>typeof v==='string' && v.trim()), 'Exercise library must contain nonempty names');
  assert(new Set(library).size===library.length, 'Duplicate exercise names');
  const packs = {};
  for (const code of codes) {
    const ui = parse(`Content/${code}/ui.json`);
    compareShape(english,ui,`${code}/ui.json`);
    const exercises = parse(`Content/${code}/exercises.json`);
    assert(object(exercises) && Object.values(exercises).every(v=>typeof v==='string'), `${code}/exercises.json must map names to strings`);
    assert(Object.keys(exercises).every(key=>library.includes(key)), `${code}/exercises.json: unknown canonical exercise name`);
    const info = read(`Content/${code}/info.html`);
    assert(info.trim().length>0 && !/<script\b/i.test(info), `${code}/info.html: missing text or prohibited script`);
    packs[code] = {code,ui:{...ui,aboutHtml:info},exercises};
    outputs.set(`Publish/info/${code}.html`,info);
  }
  const assets = {};
  for (const [key,file] of Object.entries(parse('Config/report-assets.json'))) {
    assert(/^[A-Z_]+$/.test(key) && typeof file==='string' && !file.includes('..') && !path.isAbsolute(file), 'Invalid report asset entry');
    const bytes=fs.readFileSync(path.join(ROOT,file));
    assert(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])), `${file}: expected PNG`);
    assets[key]='data:image/png;base64,'+bytes.toString('base64');
  }
  for (const key of ['REPORT_LOGO_DATA','MAX_EVER_ICON_DATA','MAX_TODAY_ICON_DATA']) assert(assets[key],`Missing ${key}`);
  const generated = '// GENERATED. Edit Content/ and run BUILD-CONTENT. Do not edit this file.\n'+
    `window.EASY_GYM_LANGUAGE_CONFIG = ${JSON.stringify({...config,version:'v317X'})};\n`+
    `window.EASY_GYM_LANGUAGE_PACKS = ${JSON.stringify(packs)};\n`+
    `window.EASY_GYM_EXERCISE_LIBRARY = ${JSON.stringify(library)};\n`+
    `window.EASY_GYM_REPORT_ASSETS = ${JSON.stringify(assets)};\n`;
  new vm.Script(generated,{filename:'generated/content.js'});
  outputs.set('Publish/generated/content.js',generated);
  for (const file of walk(WEB).filter(f=>f.endsWith('.js') && !f.startsWith('generated/'))) new vm.Script(fs.readFileSync(path.join(WEB,file),'utf8'),{filename:file});
  const files = new Set(walk(WEB).filter(f=>f!=='service-worker.js'));
  for (const name of outputs.keys()) files.add(name.replace('Publish/',''));
  const html = read('Source/index.html');
  const urls = new Set(['./', ...[...files].map(f=>'./'+f)]);
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const url=match[1];
    if (/^(?:[a-z]+:|#)/i.test(url)) continue;
    const relative=url.replace(/^\.\//,'').split('?')[0];
    assert(files.has(relative),`index.html: missing local resource ${url}`);
    urls.add('./'+url.replace(/^\.\//,''));
  }
  for(const code of codes)urls.add(`./info/${code}.html?v=317X`);
  const manifest=parse('Source/manifest.json');
  for(const icon of manifest.icons || []){
    assert(files.has(icon.src.replace(/^\.\//,'').split('?')[0]),`Manifest icon missing: ${icon.src}`);
    urls.add('./'+icon.src.replace(/^\.\//,''));
  }
  const revision = sha([...files].sort().map(f=>f+'\0'+sha(outputs.get('Publish/'+f) ?? fs.readFileSync(path.join(WEB,f)))).join('\n')).slice(0,16);
  let sw=read('tools/service-worker.template.js');
  sw=sw.replace('__CACHE_NAME__',JSON.stringify('v317x-'+revision)).replace('__ASSET_LIST__',JSON.stringify([...urls].sort(),null,2));
  new vm.Script(sw,{filename:'service-worker.js'});
  outputs.set('Publish/service-worker.js',sw);
  // All input validation finishes before generated output is written.
  const outdated=[];
  for(const [name,content]of outputs){
    const file=path.join(ROOT,name);
    if(!fs.existsSync(file) || !fs.readFileSync(file).equals(Buffer.from(content)))outdated.push(name);
  }
  if(checkOnly){
    assert(outdated.length===0, 'Generated files are outdated. Run BUILD-CONTENT:\n'+outdated.join('\n'));
    const lines=read('CHECKSUMS.sha256').trim().split('\n');
    const recorded=new Set();
    for(const line of lines){
      const match=line.match(/^([a-f0-9]{64})  (.+)$/);assert(match,'Malformed CHECKSUMS.sha256');
      assert(sha(fs.readFileSync(path.join(ROOT,match[2])))===match[1],`Checksum mismatch: ${match[2]}`);recorded.add(match[2]);
    }
    assert(walk(ROOT).filter(f=>f!=='CHECKSUMS.sha256').every(f=>recorded.has(f)), 'Untracked file in package; run build');
  }else{
    for(const [name,content]of outputs){const file=path.join(ROOT,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content);}
    const sums=walk(ROOT).filter(f=>f!=='CHECKSUMS.sha256').map(f=>sha(fs.readFileSync(path.join(ROOT,f)))+'  '+f).join('\n')+'\n';
    fs.writeFileSync(path.join(ROOT,'CHECKSUMS.sha256'),sums);
  }
  console.log(`${checkOnly?'CHECK':'BUILD'} OK: ${codes.length} languages, ${Object.keys(english).length} UI keys per language. Upload the contents of Publish/. PWA user-data keys preserved.`);
}
try { build(); } catch(error) { console.error('ERROR: '+error.message); process.exitCode=1; }
