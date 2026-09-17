'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const ROOT=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(ROOT,file),'utf8');
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
function normalizedCore(source){
  return source.replace(/^\s*const (EMBEDDED_LANGUAGE_PACKS|DEFAULT_LIBRARY|REPORT_LOGO_DATA|MAX_EVER_ICON_DATA|MAX_TODAY_ICON_DATA|DEV_BUILD|LANG_PACK_VERSION) = .*;$/gm,(_,name)=>`const ${name} = EXTRACTED_DATA;`).replace(/html\?v=(313X|317X)/g,'html?v=CONTENT_VERSION').trim();
}
function normalizedBody(source){
  return source.slice(source.indexOf('<body>')).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<!--[\s\S]*?-->/g,'').replace(/src="(?:data:image\/png;base64,[^"]+|icons\/header-logo\.png\?v=317X)"/g,'src="APPROVED_HEADER_LOGO"').replace(/\s+/g,' ').trim();
}
function run(){
  execFileSync(process.execPath,[path.join(ROOT,'tools/build-content.cjs'),'--check'],{stdio:'inherit'});
  const context={};context.window=context;
  vm.runInNewContext(read('Publish/generated/content.js'),context);
  const packs=context.EASY_GYM_LANGUAGE_PACKS;
  const codes=Object.keys(packs);
  for(const code of codes){
    const expected=JSON.parse(read(`Content/${code}/ui.json`));
    const actual=JSON.parse(JSON.stringify(packs[code].ui));delete actual.aboutHtml;
    assert.deepEqual(actual,expected,code+' UI round trip');
    assert.equal(packs[code].ui.aboutHtml,read(`Content/${code}/info.html`),code+' bundled INFO');
    assert.equal(read(`Publish/info/${code}.html`),packs[code].ui.aboutHtml,code+' file/bundled INFO match');
    assert.deepEqual(JSON.parse(JSON.stringify(packs[code].exercises)),JSON.parse(read(`Content/${code}/exercises.json`)));
  }
  // Run the actual language-selection functions independently of browser layout.
  const core=read('Publish/js/app.js');
  const selection=core.slice(core.indexOf('  function applyLanguagePacks('),core.indexOf('  const PLAN_LINK_MAX_LENGTH'));
  for(const code of codes){
    const scope={window:context};
    vm.runInNewContext(`let I18N={},EXERCISE_TRANSLATIONS={},LANGS=${JSON.stringify([code])};const EMBEDDED_LANGUAGE_PACKS=window.EASY_GYM_LANGUAGE_PACKS;function rebuildExerciseIndex(){}\n${selection}\nloadLanguagePacks();globalThis.result={I18N,LANGS,EXERCISE_TRANSLATIONS};`,scope);
    assert.equal(scope.result.I18N[code].langName,packs[code].ui.langName,code+' active language');
    assert.equal(scope.result.I18N.en.langName,packs.en.ui.langName,'English fallback');
  }
  if(process.argv.includes('--baseline')){
    const baseline=JSON.parse(read('Tests/v316X-baseline.json'));
    assert.equal(sha(normalizedCore(core)),baseline.core,'Workout logic changed since v316X');
    assert.equal(sha(normalizedBody(read('Publish/index.html'))),baseline.body,'Body structure changed since v316X');
    for(const [file,hash]of Object.entries(baseline.files))assert.equal(sha(fs.readFileSync(path.join(ROOT,file))),hash,file+' changed');
    for(const [code,hash]of Object.entries(baseline.ui))assert.equal(sha(JSON.stringify(JSON.parse(read(`Content/${code}/ui.json`)))),hash,code+' copy changed');
    assert.equal(sha(JSON.stringify(context.EASY_GYM_EXERCISE_LIBRARY)),baseline.library,'Canonical exercise order changed');
    console.log('BASELINE PASS: executable workout logic, PWA sources, layout, styles, responsive behavior, icons and UI copy preserved.');
  }
  console.log(`TEST PASS: ${codes.length} language round trips, INFO fallback parity and language selection. No physical-device or Xcode test is claimed.`);
}
module.exports={normalizedCore,normalizedBody};
if(require.main===module){try{run();}catch(error){console.error(error.message);process.exitCode=1;}}
