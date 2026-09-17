'use strict';
// Test manual text edits and invalid input in an isolated copy, never the user's source.
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'easy-gym-editor-test-'));
const project=path.join(temporary,'project');
const writeJson=(file,value)=>fs.writeFileSync(path.join(project,file),JSON.stringify(value,null,2)+'\n');
const readJson=file=>JSON.parse(fs.readFileSync(path.join(project,file),'utf8'));
const run=()=>spawnSync(process.execPath,[path.join(project,'tools/build-content.cjs')],{encoding:'utf8'});
try{
  fs.cpSync(root,project,{recursive:true});
  const ui=readJson('Content/en/ui.json');
  ui.plan='PLAN "edited" — ✓';writeJson('Content/en/ui.json',ui);
  fs.appendFileSync(path.join(project,'Content/en/info.html'),'\n<p>Editor workflow test ✓</p>\n');
  let result=run();assert.equal(result.status,0,result.stderr);
  let context={};context.window=context;
  vm.runInNewContext(fs.readFileSync(path.join(project,'Publish/generated/content.js'),'utf8'),context);
  assert.equal(context.EASY_GYM_LANGUAGE_PACKS.en.ui.plan,ui.plan);
  assert(context.EASY_GYM_LANGUAGE_PACKS.en.ui.aboutHtml.includes('Editor workflow test ✓'));
  assert(fs.readFileSync(path.join(project,'Publish/info/en.html'),'utf8').includes('Editor workflow test ✓'));
  fs.cpSync(path.join(project,'Content/en'),path.join(project,'Content/pt'),{recursive:true});
  const pt=readJson('Content/pt/ui.json');pt.langName='Português';writeJson('Content/pt/ui.json',pt);
  const config=readJson('Content/languages.json');config.enabled.push('pt');config.defaultLanguage='pt';writeJson('Content/languages.json',config);
  result=run();assert.equal(result.status,0,result.stderr);
  context={};context.window=context;
  vm.runInNewContext(fs.readFileSync(path.join(project,'Publish/generated/content.js'),'utf8'),context);
  assert.equal(context.EASY_GYM_LANGUAGE_CONFIG.defaultLanguage,'pt');
  assert.equal(context.EASY_GYM_LANGUAGE_PACKS.pt.ui.langName,'Português');
  const generated=fs.readFileSync(path.join(project,'Publish/generated/content.js'));
  delete pt.plan;writeJson('Content/pt/ui.json',pt);
  result=run();assert.notEqual(result.status,0,'Missing translation key must fail');
  assert(result.stderr.includes('translation keys differ'));
  assert.deepEqual(fs.readFileSync(path.join(project,'Publish/generated/content.js')),generated,'Invalid inputs must not overwrite working output');
  fs.writeFileSync(path.join(project,'Content/pt/ui.json'),'{ invalid JSON');
  result=run();assert.notEqual(result.status,0,'Malformed JSON must fail');
  assert(result.stderr.includes('Content/pt/ui.json'));
  assert.deepEqual(fs.readFileSync(path.join(project,'Publish/generated/content.js')),generated);
  console.log('EDITOR WORKFLOW PASS: Unicode/quotes, UI and INFO edits, adding a language, default-language selection, missing keys and invalid JSON.');
}catch(error){console.error(error.message);process.exitCode=1;}
finally{
  // Only our exact mkdtemp directory is removed, never the source project.
  if(path.dirname(temporary)===os.tmpdir() && path.basename(temporary).startsWith('easy-gym-editor-test-'))fs.rmSync(temporary,{recursive:true,force:true});
}
