(() => {
  'use strict';
  const DAYS = ['mon','tue','wed','thu','fri','sat','sun'];
  const DAY_SHORT = {mon:'Mon',tue:'Tue',wed:'Wed',thu:'Thu',fri:'Fri',sat:'Sat',sun:'Sun'};
  const DEFAULT_LIBRARY = window.EASY_GYM_EXERCISE_LIBRARY;
  let EXERCISE_TRANSLATIONS = {};

  const EXERCISE_TO_EN = {};
  function rebuildExerciseIndex(){
    Object.keys(EXERCISE_TO_EN).forEach(k=>delete EXERCISE_TO_EN[k]);
    Object.values(EXERCISE_TRANSLATIONS).forEach(map=>Object.entries(map||{}).forEach(([en,local])=>{ EXERCISE_TO_EN[local]=en; }));
  }
  let I18N = {};

  const LANGUAGE_CONFIG = window.EASY_GYM_LANGUAGE_CONFIG || {};
  let LANGS = Array.isArray(window.EASY_GYM_ENABLED_LANGUAGES)
    ? [...window.EASY_GYM_ENABLED_LANGUAGES]
    : ['en'];
  const DEFAULT_LANGUAGE = String(LANGUAGE_CONFIG.defaultLanguage || LANGS[0] || 'en').toLowerCase();
  const LANG_PACK_BASE = './lang/';
  const LANG_PACK_VERSION = 'v317X';
  const EMBEDDED_LANGUAGE_PACKS = window.EASY_GYM_LANGUAGE_PACKS;
  function applyLanguagePacks(loaded){
    const packMap = Object.fromEntries(loaded.filter(([,pack])=>pack).map(([lang,pack])=>[lang,pack]));
    const englishPack = packMap.en || EMBEDDED_LANGUAGE_PACKS.en;
    const englishUi = (englishPack && englishPack.ui) || {};
    I18N = {en: englishUi};
    EXERCISE_TRANSLATIONS = {en: (englishPack && englishPack.exercises) || {}};

    LANGS.forEach(lang=>{
      const pack = packMap[lang];
      if(!pack) return;
      const ui = pack.ui || {};
      I18N[lang] = {
        ...englishUi,
        ...ui,
        days: {...(englishUi.days||{}), ...(ui.days||{})},
        months: Array.isArray(ui.months) && ui.months.length===12 ? ui.months : (englishUi.months||[])
      };
      EXERCISE_TRANSLATIONS[lang] = pack.exercises || {};
    });
    rebuildExerciseIndex();
  }
  function loadLanguagePacks(){
    const external = window.EASY_GYM_LANGUAGE_PACKS || {};
    const configured = [...LANGS];
    const available = configured.filter(lang=>external[lang] || EMBEDDED_LANGUAGE_PACKS[lang]);
    LANGS = available.length ? available : ['en'];
    const loaded = LANGS.map(lang=>[lang, external[lang] || EMBEDDED_LANGUAGE_PACKS[lang]]);
    if(!loaded.some(([lang])=>lang==='en')) loaded.unshift(['en', external.en || EMBEDDED_LANGUAGE_PACKS.en]);
    applyLanguagePacks(loaded);
  }
  const PLAN_LINK_MAX_LENGTH = 8000;
  const APP_PLAN_LINK_BASE = 'https://easygym.ch/p';
  function normalizeLang(lang){ return LANGS.includes(lang) ? lang : (LANGS.includes(DEFAULT_LANGUAGE) ? DEFAULT_LANGUAGE : (LANGS[0] || 'en')); }
  const PACKAGE_PREFIX = 'easyGym.pwaTest.' + encodeURIComponent(new URL('./', window.location.href).pathname) + '.';
  const KEYS = {
    week:PACKAGE_PREFIX+'weekPlans.v1', train:PACKAGE_PREFIX+'trainSessions.v1', saved:PACKAGE_PREFIX+'savedPlans.v1', journal:PACKAGE_PREFIX+'journal.v1',
    library:PACKAGE_PREFIX+'exerciseLibrary.v1', start:PACKAGE_PREFIX+'trainStartTimes.v1', backup:PACKAGE_PREFIX+'backupReady.v1', theme:PACKAGE_PREFIX+'theme.v1',
    datePlans:PACKAGE_PREFIX+'datePlans.v1', savedDatePlans:PACKAGE_PREFIX+'savedDatePlans.v1', activeDatePlans:PACKAGE_PREFIX+'activeDatePlans.v1', lang:PACKAGE_PREFIX+'lang.v1'
  };
  const LEGACY_KEYS = [];
  const DEV_BUILD = 'v317X-PWA-maintainable-test';
  const DEV_BUILD_KEY = PACKAGE_PREFIX+'devBuild.v1';
  // Production data preservation: an app update must never erase plans, active
  // workouts, LOG history, the exercise library, or user preferences. The build
  // marker is informational only. Delete Data remains the sole automatic purge.
  try{
    localStorage.setItem(DEV_BUILD_KEY, DEV_BUILD);
  }catch(e){
    console.warn('Easy Gym: build marker could not be stored.', e);
  }
  let weekPlans = load(KEYS.week, emptyDays());
  let trainSessions = load(KEYS.train, emptyDays());
  let savedPlanDays = load(KEYS.saved, {});
  let journal = load(KEYS.journal, load('fitnessEasy.journal.v4', []));
  let exerciseLibrary = load(KEYS.library, DEFAULT_LIBRARY).filter(Boolean);
  let trainStartTimes = load(KEYS.start, {});
  let backupReady = !!load(KEYS.backup, false);
  let datePlans = load(KEYS.datePlans, {});
  let savedDatePlans = load(KEYS.savedDatePlans, {});
  let activeDatePlans = load(KEYS.activeDatePlans, {});
  let selectedPlanDay = null;
  let selectedTrainDay = null;
  let planWeekOffset = 0;
  let selectedPlanDate = null;
  let selectedTrainDate = null;
  let activeTab = 'plan';
  let timerInterval = null;
  let savedWorkout = null; // {day,durationMs}
  let expandedLogId = (journal[0] && journal[0].id) || null;
  const infoHtmlCache = Object.create(null);
  let saveTrainingConfirmArmed = false;
  let saveTrainingConfirmTimer = null;
  let modalTarget = null;
  let modalSessionId = null;
  let editMode = false;
  let libraryDraft = [];
  let libraryDirty = false;
  let selectedLibraryDelete = new Set();
  let deletedLibraryNames = new Set();
  let copiedPlan = null;
  let easyGymDialogState = null;
  let currentLang = load(KEYS.lang, 'en');
  const $ = (id) => document.getElementById(id);
  const els = {};
  function cacheEls(){ ['planDayButtons','planChooseHint','planActionRow','savePlanRow','trainDayButtons','planList','trainList','planTitle','trainControls','savePlanBtn','removeSelectedBtn','copyPlanBtn','activatePlanBtn','planShareLinkBtn','saveTrainingBtn','startTrainingBtn','timerText','addExerciseModal','libraryList','customExerciseName','addCustomExerciseBtn','editExercisesBtn','saveLibraryBtn','deleteLibraryBtn','customRow','exerciseModalHelp','journalList','downloadWordBtn','downloadPdfBtn','sharePlanBtn','sharePlanLinkBtn','manageSavePlanBtn','manageSaveAllPlansBtn','printPlanBtn','insertPlanBtn','addLanguageBtn','insertPlanInput','manageSaveReportBtn','shareReportBtn','printReportBtn','saveAllDataBtn','restoreAllDataBtn','restoreAllDataInput','deleteDataBtn','easyGymDialog','easyGymDialogCard','easyGymDialogTitle','easyGymDialogMessage','easyGymDialogCancel','easyGymDialogConfirm','toast','homeTodayCard','homeStartBtn','homeGreeting','aboutContent','languageSelect','languageSwitch','languageMenu'].forEach(id=>els[id]=$(id)); }
  function uid(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4)}
  function emptyDays(){return Object.fromEntries(DAYS.map(d=>[d,[]]));}
  function load(key, fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function save(key, val){
    try{
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    }catch(error){
      console.error('Easy Gym: local data could not be saved.', error);
      return false;
    }
  }
  function saveAll(){
    return [
      save(KEYS.week, weekPlans),
      save(KEYS.train, trainSessions),
      save(KEYS.saved, savedPlanDays),
      save(KEYS.journal, journal),
      save(KEYS.library, exerciseLibrary),
      save(KEYS.start, trainStartTimes),
      save(KEYS.backup, backupReady),
      save(KEYS.datePlans, datePlans),
      save(KEYS.savedDatePlans, savedDatePlans),
      save(KEYS.activeDatePlans, activeDatePlans)
    ].every(Boolean);
  }
  function flushLocalState(){ saveAll(); }
  window.addEventListener('pagehide', flushLocalState);
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='hidden') flushLocalState();
  });
  function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function t(key){ return (I18N[currentLang]&&I18N[currentLang][key]) || I18N.en[key] || key; }
  function dayShort(day){ return ((I18N[currentLang]&&I18N[currentLang].days)||I18N.en.days)[day] || day; }
  function monthName(i){ return ((I18N[currentLang]&&I18N[currentLang].months)||I18N.en.months)[i] || ''; }
  function closeEasyGymDialog(result){
    const state=easyGymDialogState;
    if(!state) return;
    easyGymDialogState=null;
    if(els.easyGymDialog){
      els.easyGymDialog.classList.add('hidden');
      els.easyGymDialog.setAttribute('aria-hidden','true');
      els.easyGymDialog.classList.remove('tone-danger','tone-gold','notice-only');
    }
    document.body.classList.remove('eg-dialog-open');
    if(state.lastFocus && typeof state.lastFocus.focus==='function'){
      try{ state.lastFocus.focus({preventScroll:true}); }catch(e){ try{ state.lastFocus.focus(); }catch(ignore){} }
    }
    state.resolve(!!result);
  }
  function showEasyGymDialog(options={}){
    if(!els.easyGymDialog || !els.easyGymDialogTitle || !els.easyGymDialogMessage || !els.easyGymDialogConfirm){
      return Promise.resolve(false);
    }
    if(easyGymDialogState) closeEasyGymDialog(false);
    const title=String(options.title||'Easy Gym');
    const message=String(options.message||'');
    const confirmLabel=String(options.confirmLabel||t('dialogOk'));
    const cancelLabel=String(options.cancelLabel||t('dialogCancel'));
    const tone=options.tone==='danger'?'danger':'gold';
    const notice=!!options.notice;
    const hideTitle=options.hideTitle===true;
    els.easyGymDialogTitle.textContent=title;
    els.easyGymDialogTitle.hidden=hideTitle;
    if(hideTitle){
      els.easyGymDialog.removeAttribute('aria-labelledby');
      els.easyGymDialog.setAttribute('aria-label',confirmLabel);
    }else{
      els.easyGymDialog.setAttribute('aria-labelledby','easyGymDialogTitle');
      els.easyGymDialog.removeAttribute('aria-label');
    }
    els.easyGymDialogMessage.textContent=message;
    els.easyGymDialogConfirm.textContent=confirmLabel;
    els.easyGymDialogCancel.textContent=cancelLabel;
    els.easyGymDialogCancel.hidden=notice;
    els.easyGymDialog.classList.remove('hidden','tone-danger','tone-gold','notice-only');
    els.easyGymDialog.classList.add(`tone-${tone}`);
    if(notice) els.easyGymDialog.classList.add('notice-only');
    els.easyGymDialog.setAttribute('aria-hidden','false');
    document.body.classList.add('eg-dialog-open');
    return new Promise(resolve=>{
      easyGymDialogState={resolve,lastFocus:document.activeElement};
      requestAnimationFrame(()=>{
        const target=notice?els.easyGymDialogConfirm:els.easyGymDialogCancel;
        if(target){ try{ target.focus({preventScroll:true}); }catch(e){ target.focus(); } }
      });
    });
  }
  function handleEasyGymDialogKeydown(event){
    if(!easyGymDialogState || !els.easyGymDialog || els.easyGymDialog.classList.contains('hidden')) return;
    if(event.key==='Escape'){
      event.preventDefault();
      closeEasyGymDialog(false);
      return;
    }
    if(event.key!=='Tab') return;
    const controls=[els.easyGymDialogCancel,els.easyGymDialogConfirm].filter(el=>el && !el.hidden && !el.disabled);
    if(!controls.length) return;
    const first=controls[0], last=controls[controls.length-1];
    if(event.shiftKey && document.activeElement===first){ event.preventDefault(); last.focus(); }
    else if(!event.shiftKey && document.activeElement===last){ event.preventDefault(); first.focus(); }
  }
  function showAppStoreShareNotice(){
    return showEasyGymDialog({title:'',hideTitle:true,message:'SHARE available in App-Store Version',confirmLabel:t('dialogOk'),tone:'gold',notice:true});
  }
  function showAddLanguageSoon(){
    return showEasyGymDialog({title:'',hideTitle:true,message:t('addLanguageSoonMessage'),confirmLabel:t('dialogClose'),tone:'gold',notice:true});
  }
  function showSharePlanUnsupported(){
    return showEasyGymDialog({
      title:t('sharePlanUnsupportedTitle'),
      message:t('sharePlanUnsupportedMessage'),
      confirmLabel:t('dialogOk'),
      tone:'gold',
      notice:true
    });
  }
  function numVal(v){if(v===''||v===null||v===undefined)return ''; const n=Number(v); return Number.isFinite(n)?String(Math.max(0,Math.floor(n))):'';}
  function isPositive(v){return Number.isFinite(Number(v)) && Number(v)>0;}
  function normalExercise(name){return String(name||'').trim().replace(/\s+/g,' ');}
  function canonicalExerciseName(name){ const n=normalExercise(name); return EXERCISE_TO_EN[n] || n; }
  function displayExerciseName(name){ const n=normalExercise(name); if(!n) return ''; const map=EXERCISE_TRANSLATIONS[currentLang]; return map && Object.prototype.hasOwnProperty.call(map,n) ? map[n] : n; }
  function makeLine(src={}){ return {id:src.id||uid(),kg:src.kg??1,reps:src.reps??1,sets:src.sets??1}; }
  function ensureLines(item){ if(!item)return[]; if(!Array.isArray(item.lines)||!item.lines.length){ item.lines=[makeLine({kg:item.kg,reps:item.reps,sets:item.sets})]; } item.lines=item.lines.map(line=>makeLine(line)); syncFirstLine(item); return item.lines; }
  function syncFirstLine(item){ const first=(item.lines&&item.lines[0])||{}; item.kg=first.kg??1; item.reps=first.reps??1; item.sets=first.sets??1; return item; }
  function metricLineSummary(line){ return `${esc(numVal(line.kg))}&nbsp;${esc(t('kg'))} · ${esc(numVal(line.reps))}&nbsp;${esc(t('reps'))} · ${esc(numVal(line.sets))}&nbsp;${esc(t('sets'))}`; }
  function dayName(day){return dayShort(day);}
  function formatDuration(ms){ms=Math.max(0,Number(ms)||0); const total=Math.floor(ms/1000); const m=Math.floor(total/60); const s=total%60; const h=Math.floor(m/60); const mm=m%60; return h>0?`${h}:${String(mm).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${mm}:${String(s).padStart(2,'0')}`;}
  function formatGoDuration(ms){ms=Math.max(0,Number(ms)||0); const total=Math.floor(ms/1000); const h=Math.floor(total/3600); const m=Math.floor((total%3600)/60); const sec=total%60; return `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;}
  function formatStartTime(value){ const d=value?new Date(value):null; if(!d || Number.isNaN(d.getTime())) return ''; return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; }
  function weightText(value){ const n=Number(value)||0; return Number.isInteger(n)?String(n):String(Math.round(n*100)/100); }
  function dateDisplay(iso){ if(!iso) return ''; const [y,m,d]=iso.split('-'); return `${d}.${m}.${String(y).slice(2)}`; }
  function formatLongDate(dt){ return `${dt.getDate()} ${monthName(dt.getMonth())} ${dt.getFullYear()}`; }
  function weekDates(){ const now=new Date(); const idx=(now.getDay()+6)%7; const monday=new Date(now.getFullYear(),now.getMonth(),now.getDate()-idx); const out={}; DAYS.forEach((d,i)=>{ out[d]=new Date(monday.getFullYear(),monday.getMonth(),monday.getDate()+i); }); return out; }
  function shortDayDate(dt){ return `${dt.getDate()}.${dt.getMonth()+1}`; }
  function isoOf(dt){ return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0'); }
  function todayISO(){ return isoOf(new Date()); }
  function mondayOfWeek(offset){ const now=new Date(); const idx=(now.getDay()+6)%7; return new Date(now.getFullYear(),now.getMonth(),now.getDate()-idx+offset*7); }
  function weekDatesFor(offset){ const m=mondayOfWeek(offset); return DAYS.map((d,i)=>new Date(m.getFullYear(),m.getMonth(),m.getDate()+i)); }
  function weekLabel(offset){ const ds=weekDatesFor(offset); const a=ds[0],b=ds[6]; const mA=monthName(a.getMonth()).slice(0,3), mB=monthName(b.getMonth()).slice(0,3); if(a.getFullYear()!==b.getFullYear()) return `${a.getDate()} ${mA} ${a.getFullYear()} – ${b.getDate()} ${mB} ${b.getFullYear()}`; if(a.getMonth()!==b.getMonth()) return `${a.getDate()} ${mA} – ${b.getDate()} ${mB} ${b.getFullYear()}`; return `${a.getDate()} – ${b.getDate()} ${mB} ${b.getFullYear()}`; }
  function isoLong(iso){ if(!iso) return ''; const [y,m,d]=iso.split('-').map(Number); return `${d} ${monthName(m-1)} ${y}`; }
  function isDatePlanValid(iso){ const list=datePlans[iso]||[]; return list.length>0 && list.every(x=>normalExercise(x.name)&&ensureLines(x).length>0&&ensureLines(x).every(line=>isPositive(line.sets)&&isPositive(line.kg)&&isPositive(line.reps))); }
  function hasDatePlan(iso){ return !!savedDatePlans[iso] && (datePlans[iso]||[]).length>0 && isDatePlanValid(iso); }
  function journalForDate(iso){ return (journal||[]).find(e=>e.date===iso) || null; }
  function isDoneDate(iso){ return !!journalForDate(iso) && !activeDatePlans[iso]; }
  function markDatePlanDirty(iso){ savedDatePlans[iso]=false; saveAll(); }
  function planListHtml(plan){ return `<ul class="home-plan-list">`+plan.map(e=>{ const lines=ensureLines(e); return `<li><span class="hp-name">${esc(displayExerciseName(e.name))}</span><span class="hp-meta">${lines.map(metricLineSummary).join('<br>')}</span></li>`; }).join('')+`</ul>`; }
  function completedListHtml(entry){ const rows=[]; (entry.exercises||[]).forEach(ex=>(ex.sets||[]).forEach(s=>rows.push({name:ex.name,sets:s.sets,kg:s.kg,reps:s.reps}))); return `<ul class="home-plan-list">`+rows.map(r=>`<li><span class="hp-name">${esc(displayExerciseName(r.name))}</span><span class="hp-meta">${esc(numVal(r.sets))}&nbsp;×&nbsp;${esc(numVal(r.kg))}&nbsp;KG&nbsp;×&nbsp;${esc(numVal(r.reps))}</span></li>`).join('')+`</ul>`; }
  function readOnlyMetricBox(label,value){
    return `<label class="x-data-field value-box disabled"><input class="set-input-field uniform-digit" type="text" value="${esc(numVal(value))}" aria-label="${esc(label)}" readonly disabled></label>`;
  }
  function completedExerciseCardsHtml(entry){
    const exercises=(entry?.exercises||[]).map(ex=>({name:normalExercise(ex.name)||'Exercise', sets:(ex.sets||[]).filter(s=>isPositive(s.sets)&&isPositive(s.kg)&&isPositive(s.reps))})).filter(ex=>ex.sets.length);
    if(!exercises.length)return `<div class="empty">${esc(t('noCompletedExercises'))}</div>`;
    return exercises.map((ex,i)=>`<div class="exercise-card x-exercise-card x-go-card x-saved-card" data-mode="saved">
      <div class="card-header-row exercise-card-header-stacked">
        <div class="title-area x-exercise-title"><span class="exercise-num x-exercise-index">${i+1}.</span><span>${esc(displayExerciseName(ex.name))}</span></div>
          <div class="right-aligned-labels-subgrid" aria-hidden="true"><span class="header-right-label">${esc(t('kg'))}</span><span class="header-right-label">${esc(t('reps'))}</span><span class="header-right-label">${esc(t('sets'))}</span></div>
        <div class="control-box header-actions"><span class="go-saved-spacer" aria-hidden="true"></span></div>
      </div>
      <div class="x-set-list">${ex.sets.map(s=>`<div class="card-values-row metric-line">
        ${readOnlyMetricBox(t('kg'),s.kg)}
        ${readOnlyMetricBox(t('reps'),s.reps)}
        ${readOnlyMetricBox(t('sets'),s.sets)}
        <div class="control-box cell-interactive row-interactive-cell"><span class="saved-status-badge" aria-label="${esc(t('saved'))}">${icon('copied')}</span></div>
      </div>`).join('')}</div>
    </div>`).join('');
  }
  function readOnlyPlanExerciseCardsHtml(plan){
    const exercises=(plan||[]).map(item=>({name:normalExercise(item.name)||'Exercise', lines:ensureLines(item).filter(line=>isPositive(line.sets)&&isPositive(line.kg)&&isPositive(line.reps))})).filter(ex=>ex.lines.length);
    if(!exercises.length)return `<div class="empty">${esc(t('noSavedPlan'))}</div>`;
    return exercises.map((ex,i)=>`<div class="exercise-card x-exercise-card x-plan-card x-saved-card" data-mode="saved">
      <div class="card-header-row exercise-card-header-stacked">
        <div class="title-area x-exercise-title"><span class="exercise-num x-exercise-index">${i+1}.</span><span>${esc(displayExerciseName(ex.name))}</span></div>
          <div class="right-aligned-labels-subgrid" aria-hidden="true"><span class="header-right-label">${esc(t('kg'))}</span><span class="header-right-label">${esc(t('reps'))}</span><span class="header-right-label">${esc(t('sets'))}</span></div>
        <div class="control-box header-actions"><span class="go-saved-spacer" aria-hidden="true"></span></div>
      </div>
      <div class="x-set-list">${ex.lines.map(line=>`<div class="card-values-row metric-line">
        ${readOnlyMetricBox(t('kg'),line.kg)}
        ${readOnlyMetricBox(t('reps'),line.reps)}
        ${readOnlyMetricBox(t('sets'),line.sets)}
        <div class="control-box cell-interactive row-interactive-cell"><span class="saved-status-badge" aria-label="${esc(t('saved'))}">${icon('copied')}</span></div>
      </div>`).join('')}</div>
    </div>`).join('');
  }
  function doneRowHtml(activateIso=null){
    return activateIso ? `<div class="home-row done-action-row"><button class="action small" type="button" data-activate-date="${esc(activateIso)}">${buttonHtml('start',t('activateTraining'))}</button></div>` : '';
  }
  function toast(msg){ return; }


  function setText(id,key){ const el=$(id); if(el) el.textContent=t(key); }
  function setHtml(id,html){ const el=$(id); if(el) el.innerHTML=html; }
  const ICON_PATHS = {
    plan:'<rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M8 3v4M16 3v4M4 10h16"></path>',
    train:'<path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"></path>',
    report:'<path d="M5 20V10M12 20V4M19 20v-7"></path><path d="M3 20h18"></path>',
    manage:'<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z"></path>',
    donate:'<path d="M20.8 8.7c0 5.2-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6z"></path>',
    about:'<circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path>',
    add:'<circle cx="12" cy="12" r="9"></circle><path d="M12 8v8M8 12h8"></path>',
    remove:'<path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13M10 11v5M14 11v5"></path>',
    copy:'<rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"></path>',
    paste:'<path d="M9 4h6l1 2h3v15H5V6h3z"></path><path d="M9 4h6M8 10h8M8 14h6"></path>',
    copied:'<circle cx="12" cy="12" r="9"></circle><path d="M8 12.5l2.5 2.5L16 9"></path>',
    save:'<path d="M5 4h12l2 2v14H5z"></path><path d="M8 4v6h8V4M8 20v-6h8v6"></path>',
    start:'<circle cx="12" cy="12" r="9"></circle><path d="M10 8l6 4-6 4z"></path>',
    stop:'<rect x="6" y="6" width="12" height="12" rx="2"></rect>',
    share:'<path d="M7 12l10-6v12z"></path><circle cx="5" cy="12" r="2"></circle><circle cx="19" cy="5" r="2"></circle><circle cx="19" cy="19" r="2"></circle>',
    shareplan:'<path d="M12 15.5V3"></path><path d="m7.5 7.5 4.5-4.5 4.5 4.5"></path><path d="M8 9.5H6.5A2.5 2.5 0 0 0 4 12v6.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V12a2.5 2.5 0 0 0-2.5-2.5H16"></path>',
    insert:'<path d="M12 3v12"></path><path d="M8 11l4 4 4-4"></path><path d="M5 19h14"></path>',
    restore:'<path d="M4 12a8 8 0 1 0 2.3-5.7"></path><path d="M4 4v5h5"></path><path d="M12 8v5l3 2"></path>',
    delete:'<path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13M10 11v5M14 11v5"></path>',
    word:'<path d="M6 3h8l4 4v14H6z"></path><path d="M14 3v5h4M8 12l1.2 5 1.8-5 1.8 5L15 12"></path>',
    pdf:'<path d="M6 3h8l4 4v14H6z"></path><path d="M14 3v5h4M8 17v-5h2a1.5 1.5 0 0 1 0 3H8M13 17v-5h2M13 14h2M17 17v-5h1.5"></path>',
    download:'<path d="M12 3v12"></path><path d="M8 11l4 4 4-4"></path><path d="M5 20h14"></path>',
    edit:'<path d="M4 20h4l11-11a2.1 2.1 0 0 0-3-3L5 17z"></path><path d="M14 6l4 4"></path>'
  };
  const TAB_ICONS = {plan:'plan',train:'train',progress:'report',explanations:'manage',donate:'donate',about:'about'};
  function icon(name){ const path=ICON_PATHS[name]||''; return `<svg class="ui-icon ui-icon-${esc(name)}" aria-hidden="true" viewBox="0 0 24 24">${path}</svg>`; }
  function buttonHtml(iconName,text){ return `${icon(iconName)}<span class="btn-text">${esc(text)}</span>`; }
  function textOnlyButtonHtml(text){ return `<span class="btn-text">${esc(text)}</span>`; }
  function setButtonLabel(el,iconName,text){ if(!el)return; el.innerHTML=buttonHtml(iconName,text); el.setAttribute('aria-label',text); el.title=text; }
  function setNavButtonLabel(el,iconName,text){
    if(!el)return;
    el.classList.remove('nav-icon-only','nav-text-only');
    el.classList.add('x-bottom-nav-item');
    el.innerHTML=buttonHtml(iconName,text);
    el.setAttribute('aria-label',text);
    el.title=text;
  }
  function setIconText(id,key,iconName){ const el=$(id); if(el) setButtonLabel(el,iconName,t(key)); }
  function setMgmtRowText(id,key){ const el=$(id); if(!el)return; const text=t(key); const label=el.querySelector('.mgmt-row-title'); if(label) label.textContent=text; else el.textContent=text; el.setAttribute('aria-label',text); el.title=text; }
  function buildLanguageMenu(){
    if(!els.languageMenu) return;
    els.languageMenu.replaceChildren();
    LANGS.forEach(lang=>{
      const button=document.createElement('button');
      button.type='button';
      button.setAttribute('role','option');
      button.dataset.langOption=lang;
      button.textContent=lang.toUpperCase();
      els.languageMenu.appendChild(button);
    });
  }

  async function loadInfoContainer(lang=currentLang){
    const code=normalizeLang(lang);
    if(infoHtmlCache[code]){
      if(code===currentLang && els.aboutContent) els.aboutContent.innerHTML=infoHtmlCache[code];
      return;
    }
    try{
      const response=await fetch(`./info/${code}.html?v=317X`,{cache:'no-store'});
      if(!response.ok) throw new Error(`INFO_${response.status}`);
      const html=await response.text();
      infoHtmlCache[code]=html;
      if(code===currentLang && els.aboutContent) els.aboutContent.innerHTML=html;
    }catch(error){
      if(code===currentLang && els.aboutContent) els.aboutContent.innerHTML=t('aboutHtml');
    }
  }
  function applyLanguageUi(){
    currentLang=normalizeLang(currentLang);
    document.documentElement.lang=currentLang;
    if(els.languageSelect){ els.languageSelect.value=currentLang; els.languageSelect.textContent=currentLang.toUpperCase(); els.languageSelect.setAttribute('aria-expanded','false'); }
    if(els.languageSwitch) els.languageSwitch.classList.remove('open');
    document.querySelectorAll('[data-lang-option]').forEach(b=>{ const active=b.dataset.langOption===currentLang; b.classList.toggle('active',active); b.hidden=active; b.setAttribute('aria-selected', active?'true':'false'); });
    const navKeys={plan:'plan',train:'do',progress:'report',explanations:'manage',donate:'donate',about:'about'};
    document.querySelectorAll('[data-tab]').forEach(b=>{ const k=navKeys[b.dataset.tab]; if(k) setNavButtonLabel(b,TAB_ICONS[b.dataset.tab]||'about',t(k)); });
    setText('planChooseHint','selectDay'); setIconText('addExerciseBtn','addExercise','add'); setIconText('removeSelectedBtn','remove','remove'); setIconText('planShareLinkBtn','sharePlan','shareplan');
    setIconText('downloadWordBtn','word','word'); setIconText('downloadPdfBtn','pdf','pdf');
    setMgmtRowText('sharePlanBtn','sharePlan'); setMgmtRowText('manageSavePlanBtn','savePlan'); setMgmtRowText('insertPlanBtn','insertPlan'); setMgmtRowText('addLanguageBtn','addLanguage'); setMgmtRowText('saveAllDataBtn','saveAllData'); setMgmtRowText('restoreAllDataBtn','restoreAllData'); setMgmtRowText('deleteDataBtn','deleteData');
    setText('mgmtShareSaveTitle','mgmtShareSaveTitle'); setText('mgmtDataTitle','mgmtDataTitle'); setText('mgmtDangerTitle','mgmtDangerTitle');
    setText('supportPageTitle','supportTitle'); setText('supportPageIntro','supportIntro');
    setText('supportShareTitle','supportShareTitle'); setText('supportShareText','supportShareText');
    setText('supportRateTitle','supportRateTitle'); setText('supportRateText','supportRateText');
    setText('supportFeedbackTitle','supportFeedbackTitle'); setText('supportFeedbackText','supportFeedbackText');
    setText('supportContactTitle','supportContactTitle'); setText('supportContactText','supportContactText');
    setText('supportDonateGroupTitle','supportDonateGroupTitle'); setText('supportDonateTitle','supportDonateTitle'); setText('supportDonateText','supportDonateText');
    setText('supportDonateQrTitle','supportDonateQrTitle'); setText('supportDonateQrText','supportDonateQrText'); setText('supportDonateAmount','supportDonateAmount'); setText('supportDonateMessage','supportDonateMessage');
    setText('supportAccountHolderLabel','supportAccountHolder'); setText('supportIbanLabel','supportIban'); setText('supportSwiftLabel','supportSwift'); setText('supportAccountNumberLabel','supportAccountNumber'); setText('supportClearingNumberLabel','supportClearingNumber'); setText('supportBankLabel','supportBank');
    const supportDonationQr=$('supportDonationQr'); if(supportDonationQr) supportDonationQr.alt=t('supportDonateAlt');
    setText('modalTitle','chooseExercise'); setIconText('editExercisesBtn','editExercises','edit'); setIconText('saveLibraryBtn','modalSave','save'); setIconText('deleteLibraryBtn','delete','delete');
    setIconText('homeStartBtn','startTraining','start');
    const custom=$('customExerciseName'); if(custom) custom.placeholder=t('writeOwnExercise');
    const close=$('closeModalBtn'); if(close) close.setAttribute('aria-label','Close');
    if(els.aboutContent){ els.aboutContent.innerHTML=infoHtmlCache[currentLang]||t('aboutHtml'); loadInfoContainer(currentLang); }
  }
  function changeLanguage(lang){ currentLang=normalizeLang(lang); save(KEYS.lang,currentLang); renderAll(); }


  function shareSupportApp(){
    const text=t('supportShareMessage');
    if(navigator.share){ navigator.share({title:'Easy Gym',text}).catch(()=>{}); return; }
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).catch(()=>{}); }
    }catch(e){}
  }
  function rateSupportApp(){
    try{
      if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.rateApp){
        window.webkit.messageHandlers.rateApp.postMessage({});
        return;
      }
    }catch(e){}
    const url='https://apps.apple.com/ch/search?term='+encodeURIComponent('Easy Gym Arthur Stivenson');
    const opened=window.open(url,'_blank','noopener');
    if(!opened) window.location.href=url;
  }
  function sendSupportFeedback(){
    const subject=encodeURIComponent(t('feedbackSubject'));
    window.location.href='mailto:arthur.stivenson@gmail.com?subject='+subject;
  }
  function contactSupportEmail(){
    window.location.href='mailto:arthur.stivenson@gmail.com';
  }

  function downloadSupportQr(){
    const img=$('supportDonationQr');
    const src=img&&String(img.src||'');
    const marker='base64,';
    const pos=src.indexOf(marker);
    if(pos<0)return;
    try{
      const raw=atob(src.slice(pos+marker.length));
      const bytes=new Uint8Array(raw.length);
      for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
      downloadFile('Easy-Gym-Swiss-QR.png','image/png',bytes,true);
    }catch(e){}
  }

  function applyTheme(){
    document.documentElement.setAttribute('data-theme','dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', '#000000');
  }

  function init(){ currentLang=normalizeLang(load(KEYS.lang,DEFAULT_LANGUAGE)); applyTheme(); cacheEls(); buildLanguageMenu(); wire(); normalizeData(); if(!selectedPlanDate) selectedPlanDate=todayISO(); renderAll(); updateTimerLoop(); handleIncomingPlanLink();}
  function normalizeData(){
    for(const d of DAYS){ if(!Array.isArray(weekPlans[d])) weekPlans[d]=[]; if(!Array.isArray(trainSessions[d])) trainSessions[d]=[]; }
    if(!datePlans || typeof datePlans!=='object' || Array.isArray(datePlans)) datePlans={};
    if(!savedDatePlans || typeof savedDatePlans!=='object' || Array.isArray(savedDatePlans)) savedDatePlans={};
    if(!activeDatePlans || typeof activeDatePlans!=='object' || Array.isArray(activeDatePlans)) activeDatePlans={};
    migrateWeekToDates();
    Object.keys(datePlans||{}).forEach(iso=>{ if(Array.isArray(datePlans[iso])) datePlans[iso].forEach(ensureLines); });
    DAYS.forEach(d=>{ if(Array.isArray(weekPlans[d])) weekPlans[d].forEach(ensureLines); });
    exerciseLibrary = [...new Set((Array.isArray(exerciseLibrary)?exerciseLibrary:DEFAULT_LIBRARY).map(normalExercise).filter(Boolean))];
    if(!exerciseLibrary.length) exerciseLibrary=[...DEFAULT_LIBRARY];
    saveAll();
  }
  function migrateWeekToDates(){
    // One-time seed: if there are no date-plans yet, copy this week's saved weekday plans onto their dates.
    if(Object.keys(datePlans).length) return;
    const ds=weekDatesFor(0);
    DAYS.forEach((d,i)=>{ const list=weekPlans[d]||[]; if(savedPlanDays[d] && list.length){ const iso=isoOf(ds[i]); datePlans[iso]=list.map(x=>{ const item={id:uid(),name:x.name,sets:x.sets,kg:x.kg,reps:x.reps}; ensureLines(item); return item; }); savedDatePlans[iso]=true; } });
  }

  function hasAnyData(){
    const planData = DAYS.some(d => (weekPlans[d]||[]).length>0 || (trainSessions[d]||[]).length>0 || !!savedPlanDays[d] || !!trainStartTimes[d]);
    const dateData = Object.keys(datePlans||{}).some(iso => (datePlans[iso]||[]).length>0);
    const progressData = Array.isArray(journal) && journal.length>0;
    const libraryData = JSON.stringify(exerciseLibrary) !== JSON.stringify(DEFAULT_LIBRARY);
    return !!(planData || dateData || progressData || libraryData);
  }

  function wire(){
    if(els.languageSelect) els.languageSelect.addEventListener('click',(e)=>{ e.stopPropagation(); if(els.languageSwitch){ const open=!els.languageSwitch.classList.contains('open'); els.languageSwitch.classList.toggle('open',open); els.languageSelect.setAttribute('aria-expanded',open?'true':'false'); } });
    document.querySelectorAll('[data-lang-option]').forEach(btn=>btn.addEventListener('click',(e)=>{ e.stopPropagation(); changeLanguage(btn.dataset.langOption); }));
    document.addEventListener('click',()=>{ if(els.languageSwitch) els.languageSwitch.classList.remove('open'); if(els.languageSelect) els.languageSelect.setAttribute('aria-expanded','false'); });
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ if(els.languageSwitch) els.languageSwitch.classList.remove('open'); if(els.languageSelect) els.languageSelect.setAttribute('aria-expanded','false'); } });
    document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{activeTab=btn.dataset.tab; if(activeTab==='train'){savedWorkout=null; if(selectedPlanDate) selectedTrainDate=selectedPlanDate;} if(activeTab==='plan' && selectedTrainDate){selectedPlanDate=selectedTrainDate;} renderAll();}));
    els.addExerciseModal.addEventListener('click',e=>{if(e.target===els.addExerciseModal)closeExerciseModal();});
    if(els.easyGymDialog){
      els.easyGymDialog.addEventListener('click',event=>{ if(event.target===els.easyGymDialog) closeEasyGymDialog(false); });
      els.easyGymDialog.addEventListener('keydown',handleEasyGymDialogKeydown);
    }
    if(els.easyGymDialogCancel) els.easyGymDialogCancel.addEventListener('click',()=>closeEasyGymDialog(false));
    if(els.easyGymDialogConfirm) els.easyGymDialogConfirm.addEventListener('click',()=>closeEasyGymDialog(true));
    $('closeModalBtn').addEventListener('click', closeExerciseModal);
    $('addExerciseBtn').addEventListener('click',()=>{ if(selectedPlanDate) openExerciseModal('date-add'); });
    els.removeSelectedBtn.addEventListener('click', removeSelectedDatePlan);
    if(els.copyPlanBtn) els.copyPlanBtn.addEventListener('click', handlePlanCopyPaste);
    if(els.planShareLinkBtn) els.planShareLinkBtn.addEventListener('click', sharePlanLink);
    els.savePlanBtn.addEventListener('click', ()=>saveCurrentDatePlan());
    if(els.startTrainingBtn) els.startTrainingBtn.addEventListener('click', startTraining);
    els.saveTrainingBtn.addEventListener('click', saveTraining);
    els.editExercisesBtn.addEventListener('click',()=>{editMode=true;libraryDraft=[...exerciseLibrary];libraryDirty=false;selectedLibraryDelete.clear();renderLibrary();});
    els.saveLibraryBtn.addEventListener('click', saveLibrary);
    els.deleteLibraryBtn.addEventListener('click', deleteCheckedLibrary);
    els.customExerciseName.addEventListener('input',()=>{ updateCustomAdd(); if(!editMode) renderLibrary(); });
    els.addCustomExerciseBtn.addEventListener('click',()=>addCustomFromModal());
    els.customExerciseName.addEventListener('keydown',e=>{if(e.key==='Enter'){ if(editMode) saveLibrary(); else addCustomFromModal(); }});
    els.downloadWordBtn.addEventListener('click', downloadWord);
    els.downloadPdfBtn.addEventListener('click', downloadPdf);
    if(els.sharePlanBtn) els.sharePlanBtn.addEventListener('click', showAppStoreShareNotice);
    if(els.manageSavePlanBtn) els.manageSavePlanBtn.addEventListener('click', savePlanFile);
    if(els.manageSaveAllPlansBtn) els.manageSaveAllPlansBtn.addEventListener('click', saveAllPlansFile);
    if(els.printPlanBtn) els.printPlanBtn.addEventListener('click', executePrintPlan);
    if(els.insertPlanBtn) els.insertPlanBtn.addEventListener('click',()=>els.insertPlanInput.click());
    if(els.addLanguageBtn) els.addLanguageBtn.addEventListener('click', showAddLanguageSoon);
    if(els.insertPlanInput) els.insertPlanInput.addEventListener('change', insertPlanFile);
    if(els.manageSaveReportBtn) els.manageSaveReportBtn.addEventListener('click', saveReportFile);
    if(els.shareReportBtn) els.shareReportBtn.addEventListener('click', shareReport);
    if(els.printReportBtn) els.printReportBtn.addEventListener('click', executeNativePrintExport);
    if(els.saveAllDataBtn) els.saveAllDataBtn.addEventListener('click', saveAllDataFile);
    if(els.restoreAllDataBtn) els.restoreAllDataBtn.addEventListener('click',()=>els.restoreAllDataInput.click());
    if(els.restoreAllDataInput) els.restoreAllDataInput.addEventListener('change', restoreAllDataFile);
    if(els.deleteDataBtn) els.deleteDataBtn.addEventListener('click', deleteAllData);
    const shareAppBtn=$('shareAppBtn'); if(shareAppBtn) shareAppBtn.addEventListener('click',shareSupportApp);
    const rateAppBtn=$('rateAppBtn'); if(rateAppBtn) rateAppBtn.addEventListener('click',rateSupportApp);
    const sendFeedbackBtn=$('sendFeedbackBtn'); if(sendFeedbackBtn) sendFeedbackBtn.addEventListener('click',sendSupportFeedback);
    const contactSupportBtn=$('contactSupportBtn'); if(contactSupportBtn) contactSupportBtn.addEventListener('click',contactSupportEmail);
  }

  function todayKey(){ const idx=(new Date().getDay()+6)%7; return DAYS[idx]; }
  function goTab(tab){ activeTab=tab; renderAll(); window.scrollTo(0,0); }
  function renderHome(){
    if(!els.homeTodayCard) return;
    const iso = todayISO();
    // Heading: the actual date (e.g. "25 June 2026")
    if(els.homeGreeting) els.homeGreeting.textContent = formatLongDate(new Date());
    const card = els.homeTodayCard;
    const done = journalForDate(iso);
    if(isDoneDate(iso)){
      // Already trained today — show the completed session (read-only)
      card.classList.remove('home-editor');
      card.onclick = ()=>{ selectedPlanDate=iso; planWeekOffset=0; goTab('plan'); };
      card.innerHTML = `<div class="home-row"><span class="home-sub">${esc(formatDuration(done.durationMs))}</span></div>`+ completedListHtml(done);
    } else if(hasDatePlan(iso)){
      // Planned training exists for today — show it (read-only)
      card.classList.remove('home-editor');
      card.onclick = ()=>{ selectedPlanDate=iso; planWeekOffset=0; goTab('plan'); };
      card.innerHTML = `<div class="home-row"><span class="home-label">${esc(t('startTraining'))}</span></div>`+ planListHtml(datePlans[iso]||[]);
    } else {
      // No planned training — create one inline (date-keyed)
      const list = datePlans[iso]||[];
      card.classList.add('home-editor');
      card.onclick = null;
      card.innerHTML = `<div class="home-row"><span class="home-label">${esc(t('startTraining'))}</span><button class="action small" id="homeAddExerciseBtn">${buttonHtml('add',t('addExercise'))}</button></div>`+
        (list.length
          ? `<div id="homePlanList">`+list.map((item,i)=>exerciseCard(item,i,'plan')).join('')+`</div>`+
            `<div class="action-row home-save-row"><button class="action danger small disabled" id="homeRemoveBtn" disabled>${buttonHtml('remove',t('remove'))}</button><button class="action" id="homeSaveBtn">${buttonHtml('save',t('saveTraining'))}</button></div>`
          : `<div class="empty">${esc(t('noExercisesYet'))}</div>`);
      wireDateEditorHome(iso);
    }
    // Start/resume button — actually start the training and jump to Do-it
    const openStart = !!trainStartTimes[todayISO()];
    els.homeStartBtn.style.display = done ? 'none' : '';
    setButtonLabel(els.homeStartBtn, openStart?'start':'start', openStart ? t('resumeTraining') : t('startTraining'));
    els.homeStartBtn.onclick = ()=>startToday();
  }
  function seedTrainFromDate(iso){ trainSessions[iso]=[]; (datePlans[iso]||[]).forEach(p=>{ ensureLines(p).forEach(line=>trainSessions[iso].push({sessionId:uid(),exerciseId:p.id,lineId:line.id,name:p.name,sets:line.sets,kg:line.kg,reps:line.reps,checked:0,trainAdded:false,addedStarted:false})); }); }
  function startToday(){
    const iso=todayISO();
    if(isDoneDate(iso)){ selectedTrainDate=iso; goTab('train'); return; }
    if(!trainStartTimes[iso] && !isDatePlanValid(iso)){ toast(t('addFirst')); return; }
    activeTab='train';
    savedDatePlans[iso]=true;
    selectedTrainDate=iso; savedWorkout=null;
    if(!trainStartTimes[iso]){
      seedTrainFromDate(iso);
      trainStartTimes[iso]=Date.now();
    }
    saveAll(); renderAll(); updateTimerLoop();
    window.scrollTo(0,0);
  }
  // Shared date-plan card wiring (name picker + metric inputs) for a given ISO date + container
  function wireDateCards(iso, container){
    container.querySelectorAll('[data-plan-name]').forEach(box=>box.addEventListener('click',()=>{ selectedPlanDate=iso; openExerciseModal('date-replace', box.dataset.planName); }));
    container.querySelectorAll('[data-plan-line-plus]').forEach(btn=>btn.addEventListener('click',()=>{
      const it=(datePlans[iso]||[]).find(x=>x.id===btn.dataset.planLinePlus); if(!it)return;
      const lines=ensureLines(it); const last=lines[lines.length-1]||{}; lines.push(makeLine({kg:last.kg??1,reps:last.reps??1,sets:last.sets??1})); syncFirstLine(it); markDatePlanDirty(iso); renderAll();
    }));
    container.querySelectorAll('[data-x-plan-delete-line]').forEach(btn=>btn.addEventListener('click',()=>{
      const list=datePlans[iso]||[]; const item=list.find(x=>x.id===btn.dataset.xPlanDeleteLine); if(!item)return;
      const lines=ensureLines(item); const lineId=btn.dataset.xLineId;
      if(lines.length<=1){ datePlans[iso]=list.filter(x=>x.id!==item.id); }
      else { item.lines=lines.filter(x=>x.id!==lineId); syncFirstLine(item); }
      markDatePlanDirty(iso); saveAll(); renderAll();
    }));
    const syncCardTrash=(card)=>{ if(!card)return; const trash=card.querySelector('[data-x-plan-delete-selected]'); if(!trash)return; const any=!!card.querySelector('[data-plan-line-check]:checked'); trash.disabled=!any; };
    container.querySelectorAll('[data-plan-line-check]').forEach(cb=>cb.addEventListener('change',()=>{ const row=cb.closest('.metric-line'); if(row) row.classList.toggle('line-selected', cb.checked); syncCardTrash(cb.closest('.x-plan-card')); }));
    container.querySelectorAll('[data-x-plan-delete-selected]').forEach(btn=>{
      syncCardTrash(btn.closest('.x-plan-card'));
      btn.addEventListener('click',()=>{
        const card=btn.closest('.x-plan-card'); if(!card)return;
        const itemId=btn.dataset.xPlanDeleteSelected;
        const selected=[...card.querySelectorAll('[data-plan-line-check]:checked')].map(cb=>cb.dataset.lineId).filter(Boolean);
        if(!selected.length)return;
        const list=datePlans[iso]||[]; const item=list.find(x=>x.id===itemId); if(!item)return;
        const lines=ensureLines(item); const selectedSet=new Set(selected);
        if(lines.length<=1 || selectedSet.size>=lines.length){ datePlans[iso]=list.filter(x=>x.id!==itemId); }
        else { item.lines=lines.filter(line=>!selectedSet.has(line.id)); syncFirstLine(item); }
        markDatePlanDirty(iso); saveAll(); renderAll();
      });
    });
    container.querySelectorAll('[data-metric-mode="plan"]').forEach(inp=>{
      inp.addEventListener('input',()=>{
        const it=(datePlans[iso]||[]).find(x=>x.id===inp.dataset.metricId); if(!it)return;
        const lines=ensureLines(it); const line=lines.find(x=>x.id===inp.dataset.lineId)||lines[0]; if(!line)return;
        const cleaned=cleanMetricText(inp.value); if(inp.value!==cleaned) inp.value=cleaned;
        line[inp.dataset.field]=cleaned; syncFirstLine(it); markDatePlanDirty(iso); saveAll();
        const v=isDatePlanValid(iso);
        const hb=$('homeSaveBtn'); if(hb){ hb.disabled=!v; hb.classList.toggle('disabled',!v); }
        if(activeTab==='plan' && selectedPlanDate===iso){ setButtonLabel(els.savePlanBtn,'save',t('saveTraining')); els.savePlanBtn.classList.remove('saved'); els.savePlanBtn.disabled=!v; els.savePlanBtn.classList.toggle('disabled',!v); updatePlanCopyState(); }
      });
    });
  }
  function wireDateEditorHome(iso){
    const c = els.homeTodayCard;
    wireDateCards(iso, c);
    const addBtn=$('homeAddExerciseBtn'); if(addBtn) addBtn.addEventListener('click',()=>{ selectedPlanDate=iso; openExerciseModal('date-add'); });
    const saveBtn=$('homeSaveBtn');
    if(saveBtn){ const v=isDatePlanValid(iso); saveBtn.disabled=!v; saveBtn.classList.toggle('disabled',!v); saveBtn.addEventListener('click',()=>{ selectedPlanDate=iso; saveCurrentDatePlan(); }); }
    const removeBtn=$('homeRemoveBtn');
    const updRemove=()=>{ const any=hasDateRemoveSelection(c); if(removeBtn){ removeBtn.disabled=!any; removeBtn.classList.toggle('disabled',!any); } };
    if(removeBtn) removeBtn.addEventListener('click',()=>removeSelectedFromDatePlan(iso,c));
    c.querySelectorAll('[data-remove-check],[data-plan-line-check]').forEach(cb=>cb.addEventListener('change',updRemove));
    updRemove();
  }
  function addDatePlanExercise(name){ const iso=selectedPlanDate; if(!iso)return; const item={id:uid(),name,sets:1,kg:1,reps:1,lines:[makeLine({kg:1,reps:1,sets:1})]}; (datePlans[iso]=datePlans[iso]||[]).push(item); markDatePlanDirty(iso); closeExerciseModal(); renderAll(); }
  function replaceDatePlanExercise(id,name){ const iso=selectedPlanDate; if(!iso)return; const it=(datePlans[iso]||[]).find(x=>x.id===id); if(!it)return; it.name=name; markDatePlanDirty(iso); closeExerciseModal(); renderAll(); }
  function saveCurrentDatePlan(){
    const iso=selectedPlanDate;
    if(!iso||!isDatePlanValid(iso))return;
    savedDatePlans[iso]=true;
    if(activeDatePlans[iso] || !trainStartTimes[iso]){
      seedTrainFromDate(iso);
      if(selectedTrainDate===iso) savedWorkout=null;
    }
    saveAll();
    renderAll();
  }
  function hasDateRemoveSelection(root){ return !!root.querySelector('[data-remove-check]:checked,[data-plan-line-check]:checked'); }
  function removeSelectedFromDatePlan(iso, root){
    if(!iso||!root)return;
    const exerciseIds=[...root.querySelectorAll('[data-remove-check]:checked')].map(x=>x.value);
    const lineChecks=[...root.querySelectorAll('[data-plan-line-check]:checked')].map(x=>({exerciseId:x.dataset.planLineCheck,lineId:x.dataset.lineId}));
    if(!exerciseIds.length && !lineChecks.length)return;
    const removeExercise=new Set(exerciseIds);
    const removeLinesByExercise={};
    lineChecks.forEach(x=>{ if(!x.exerciseId||!x.lineId||removeExercise.has(x.exerciseId))return; (removeLinesByExercise[x.exerciseId]=removeLinesByExercise[x.exerciseId]||new Set()).add(x.lineId); });
    datePlans[iso]=(datePlans[iso]||[]).filter(item=>{
      if(removeExercise.has(item.id)) return false;
      const ids=removeLinesByExercise[item.id];
      if(ids){
        const lines=ensureLines(item);
        if(lines.length>1){ item.lines=lines.filter(line=>!ids.has(line.id)); syncFirstLine(item); }
      }
      return true;
    });
    markDatePlanDirty(iso); renderAll();
  }
  function removeSelectedDatePlan(){ const iso=selectedPlanDate; if(!iso)return; removeSelectedFromDatePlan(iso,els.planList); }

  function trainMassForDate(iso=selectedTrainDate){
    if(!iso) return 0;
    const list=(trainSessions[iso]||[]);
    if(list.length){
      return list.reduce((sum,it)=>{
        const total=Math.max(0,Math.floor(Number(it.sets)||0));
        const completed=Math.min(total,Math.max(0,Math.floor(Number(it.checked)||0)));
        const kg=Math.max(0,Number(it.kg)||0);
        const reps=Math.max(0,Number(it.reps)||0);
        return sum+(kg*reps*completed);
      },0);
    }
    const saved=journalForDate(iso);
    return (saved&&saved.exercises||[]).reduce((sum,exercise)=>sum+(exercise.sets||[]).reduce((rowSum,row)=>{
      const completed=Math.max(0,Number(row.sets)||0);
      const kg=Math.max(0,Number(row.kg)||0);
      const reps=Math.max(0,Number(row.reps)||0);
      return rowSum+(kg*reps*completed);
    },0),0);
  }
  function formatTrainMass(value){
    const rounded=Math.round((Number(value)||0)*100)/100;
    return String(rounded);
  }
  function updateTrainMassDisplay(iso=selectedTrainDate){
    const value=$('trainMassValue');
    const wrap=$('trainMass');
    if(!value) return;
    const formatted=formatTrainMass(trainMassForDate(iso));
    value.textContent=formatted+' KG';
    if(wrap) wrap.setAttribute('aria-label',t('total')+': '+formatted+' KG');
  }

  function tickLiveTimer(){
    const live=$('liveTimer');
    const iso=selectedTrainDate;
    if(live && iso && trainStartTimes[iso]){
      live.textContent = formatGoDuration(Date.now() - Number(trainStartTimes[iso]));
    }
  }
  function updateTimerLoop(){
    if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
    tickLiveTimer();
    const hasOpenTraining = Object.keys(trainStartTimes||{}).some(iso=>!!trainStartTimes[iso]);
    if(hasOpenTraining){
      timerInterval = setInterval(tickLiveTimer, 1000);
    }
  }

  function renderAll(){
    applyLanguageUi();
    document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active', b.dataset.tab===activeTab));
    document.querySelectorAll('.section').forEach(s=>s.classList.toggle('active', s.id===activeTab));
    renderHome(); renderDays(); renderPlan(); renderTrain(); renderProgress(); renderExplanations(); updateTimerLoop();
  }
  // ---- Swipeable date strip (drag/finger), shared by Plan and Do-it ----
  function stripSets(){ return { planned:new Set(Object.keys(datePlans||{}).filter(iso=>hasDatePlan(iso))) }; }
  function centerStrip(el, dataAttr, iso){ const b=el.querySelector('['+dataAttr+'="'+iso+'"]'); if(b){ el.scrollLeft = b.offsetLeft - el.clientWidth/2 + b.offsetWidth/2; } }
  function buildDateStrip(el, selectedIso, dataAttr){
    const today=todayISO(); const sets=stripSets();
    const sig=['v314X',currentLang, today, [...sets.planned].sort().join(',')].join('|');
    if(el.dataset.sig!==sig){
      const prev = el.children.length ? el.scrollLeft : null;
      const N=365; const base=new Date(); base.setHours(0,0,0,0);
      let html='';
      for(let off=-N; off<=N; off++){
        const dt=new Date(base.getFullYear(),base.getMonth(),base.getDate()+off); const iso=isoOf(dt);
        const planned=sets.planned.has(iso);
        const cls=['day-link','with-date','calendar-day',iso===today?'is-today':'',planned?'planned':''].filter(Boolean).join(' ');
        const ddmm=`${String(dt.getDate()).padStart(2,'0')}.${String(dt.getMonth()+1).padStart(2,'0')}.`;
        html+=`<button class="${cls}" ${dataAttr}="${iso}" type="button"><span class="dl-day day-name">${dayShort(DAYS[(dt.getDay()+6)%7]).toUpperCase()}</span><span class="dl-date day-date">${ddmm}</span></button>`;
      }
      el.innerHTML=html; el.dataset.sig=sig;
      if(prev!=null) el.scrollLeft=prev;
    }
    const centerIso=selectedIso||today;
    if(el.clientWidth>0 && el.children.length && !el.dataset.initialCentered){ centerStrip(el, dataAttr, centerIso); el.dataset.initialCentered='1'; }
    el.querySelectorAll('.day-link.active').forEach(b=>b.classList.remove('active'));
    if(selectedIso){ const sb=el.querySelector('['+dataAttr+'="'+selectedIso+'"]'); if(sb) sb.classList.add('active'); }
  }
  function ensureStripBehavior(el, dataAttr, onSelect){
    if(el.dataset.wired) return; el.dataset.wired='1';
    el.addEventListener('click', e=>{ if(el._dragMoved) return; const b=e.target.closest('['+dataAttr+']'); if(b) onSelect(b.getAttribute(dataAttr)); });
    let down=false,sx=0,ss=0;
    el.addEventListener('pointerdown', e=>{ if(e.pointerType!=='mouse')return; down=true; el._dragMoved=false; sx=e.clientX; ss=el.scrollLeft; });
    el.addEventListener('pointermove', e=>{ if(!down)return; const dx=e.clientX-sx; if(Math.abs(dx)>4) el._dragMoved=true; el.scrollLeft=ss-dx; });
    const up=()=>{ down=false; };
    el.addEventListener('pointerup',up); el.addEventListener('pointercancel',up); el.addEventListener('pointerleave',up);
  }
  function renderDays(){
    buildDateStrip(els.planDayButtons, selectedPlanDate, 'data-plan-iso');
    ensureStripBehavior(els.planDayButtons, 'data-plan-iso', iso=>{ selectedPlanDate=iso; renderAll(); });
  }
  function hasSavedPlan(day){return !!savedPlanDays[day] && (weekPlans[day]||[]).length>0 && isPlanValid(day);}
  function isPlanSaved(day){return hasSavedPlan(day);}
  function currentPlan(){return weekPlans[selectedPlanDay]||[];}
  function isPlanValid(day){const list=weekPlans[day]||[]; return list.length>0 && list.every(x=>normalExercise(x.name)&&isPositive(x.sets)&&isPositive(x.kg)&&isPositive(x.reps));}
  function markPlanDirty(day){savedPlanDays[day]=false; if(selectedTrainDay===day){selectedTrainDay=null;savedWorkout=null;} delete trainStartTimes[day]; saveAll();}

  function updatePlanShareState(){
    const btn=els.planShareLinkBtn;
    if(!btn) return;
    setButtonLabel(btn,'shareplan',t('sharePlan'));
    const can=!!(selectedPlanDate && hasDatePlan(selectedPlanDate));
    btn.disabled=!can;
    btn.setAttribute('aria-disabled',can?'false':'true');
    btn.classList.toggle('disabled',!can);
    btn.onclick=null;
  }
  function updatePlanActivateState(iso){
    const btn=els.activatePlanBtn;
    if(!btn) return;
    setButtonLabel(btn,'start',t('activateTraining'));
    const can=!!(iso && journalForDate(iso) && !activeDatePlans[iso]);
    btn.disabled=!can;
    btn.classList.toggle('disabled',!can);
    btn.onclick = can ? (()=>activateTraining(iso)) : null;
  }
  function renderPlan(){
    const iso=selectedPlanDate; const has=!!iso;
    els.planChooseHint.style.display = has ? 'none' : '';
    els.planTitle.style.display = 'none'; els.planTitle.textContent='';
    els.planList.style.display = has ? '' : 'none';
    if(!has){
      els.planActionRow.style.display='none';
      els.savePlanRow.style.display='none';
      els.savePlanRow.classList.add('is-hidden');
      setButtonLabel(els.savePlanBtn,'save',t('saveTraining'));
      els.savePlanBtn.disabled=true;
      els.savePlanBtn.classList.remove('saved');
      els.savePlanBtn.classList.add('disabled');
      els.planList.innerHTML='';
      updatePlanCopyState();
      updatePlanActivateState(null);
      updatePlanShareState();
      return;
    }

    // PLAN controls stay visible for every selected day. App logic only enables/disables them.
    els.planActionRow.style.display='';
    els.savePlanRow.classList.remove('is-hidden');
    els.savePlanRow.style.display='flex';
    const setDisabled=(btn,disabled)=>{ if(!btn)return; btn.disabled=!!disabled; btn.classList.toggle('disabled',!!disabled); };
    const done=journalForDate(iso);
    updatePlanActivateState(iso);
    updatePlanShareState();

    if(done && !activeDatePlans[iso]){
      // Completed date: keep PLAN read-only, show SAVED, and keep all controls visible.
      setDisabled($('addExerciseBtn'), true);
      setDisabled(els.removeSelectedBtn, true);
      updatePlanCopyState();
      setButtonLabel(els.savePlanBtn,'copied',t('saved'));
      els.savePlanBtn.disabled = true;
      els.savePlanBtn.classList.add('saved');
      els.savePlanBtn.classList.remove('disabled');
      const originalPlan = (datePlans[iso]||[]);
      els.planList.innerHTML = originalPlan.length ? readOnlyPlanExerciseCardsHtml(originalPlan) : completedExerciseCardsHtml(done);
      return;
    }

    // Any unfinished selected date — past, present or future — remains editable.
    setDisabled($('addExerciseBtn'), false);
    const list=datePlans[iso]||[]; const saved=hasDatePlan(iso);
    updatePlanCopyState();
    setButtonLabel(els.savePlanBtn, saved?'copied':'save', saved ? t('saved') : t('saveTraining'));
    els.savePlanBtn.disabled = saved || !isDatePlanValid(iso);
    els.savePlanBtn.classList.toggle('saved', saved);
    els.savePlanBtn.classList.toggle('disabled', !saved && els.savePlanBtn.disabled);
    els.planList.innerHTML = list.length ? list.map((item,i)=>exerciseCard(item,i,'plan')).join('') : `<div class="empty exercise-typography-empty">${esc(t('tapAddExercise'))}</div>`;
    wireDateCards(iso, els.planList);
    els.planList.querySelectorAll('[data-remove-check],[data-plan-line-check]').forEach(cb=>cb.addEventListener('change',updatePlanRemoveState));
    updatePlanRemoveState();
  }
  function xRowMetric(unit,value,mode,item,field,disabled,lineId=null){
    const id=mode==='plan'?item.id:item.sessionId;
    return `<label class="x-data-field value-box x-field-${field} ${disabled?'disabled':''}"><input class="set-input-field uniform-digit" inputmode="numeric" pattern="[0-9]*" type="text" value="${esc(numVal(value))}" aria-label="${esc(unit)}" data-metric-mode="${mode}" data-metric-id="${esc(id)}" ${lineId?`data-line-id="${esc(lineId)}"`:''} data-field="${field}" ${disabled?'disabled':''}></label>`;
  }
  function exerciseCard(item,i,mode){
    const disabled = mode==='train' && savedWorkout?.date===selectedTrainDate;
    if(mode==='plan'){
      const lines=ensureLines(item);
      return `<div class="exercise-card x-exercise-card x-plan-card" data-card-id="${esc(item.id)}" data-mode="plan">
        <div class="card-header-row exercise-card-header-stacked">
          <button class="title-area x-exercise-title" type="button" data-plan-name="${esc(item.id)}"><span class="exercise-num x-exercise-index">${i+1}.</span><span>${esc(displayExerciseName(item.name)||t('chooseExercise'))}</span></button>
          <div class="right-aligned-labels-subgrid" aria-hidden="true"><span class="header-right-label">${esc(t('kg'))}</span><span class="header-right-label">${esc(t('reps'))}</span><span class="header-right-label">${esc(t('sets'))}</span></div>
          <div class="control-box header-actions x-card-tools card-action-group">
            <button class="x-delete-group-btn x-plan-trash btn-action btn-trash" type="button" data-x-plan-delete-selected="${esc(item.id)}" aria-label="${esc(t('remove'))}" disabled>${icon('remove')}</button>
            <button class="add-set-btn btn-action btn-add" type="button" data-plan-line-plus="${esc(item.id)}" aria-label="Add KG Reps Sets line">${icon('add')}</button>
          </div>
        </div>
        <div class="x-set-list">${lines.map((line,idx)=>`<div class="card-values-row metric-line" data-line-id="${esc(line.id)}">
          ${xRowMetric(t('kg'),line.kg,'plan',item,'kg',false,line.id)}
          ${xRowMetric(t('reps'),line.reps,'plan',item,'reps',false,line.id)}
          ${xRowMetric(t('sets'),line.sets,'plan',item,'sets',false,line.id)}
          <label class="control-box cell-interactive x-row-check-wrap row-interactive-cell"><input class="x-row-check" type="checkbox" data-plan-line-check="${esc(item.id)}" data-line-id="${esc(line.id)}" aria-label="${esc(t('remove'))}"></label>
        </div>`).join('')}</div>
      </div>`;
    }
    return '';
  }
  function metricBox(label,value,mode,item,field,disabled,lineId=null){const id=mode==='plan'?item.id:item.sessionId;return `<label class="metric-wrap ${disabled?'disabled':''}"><span class="metric-label-top">${label}</span><span class="metric-input-box ${disabled?'disabled':''}"><input inputmode="numeric" pattern="[0-9]*" type="text" value="${esc(numVal(value))}" data-metric-mode="${mode}" data-metric-id="${esc(id)}" ${lineId?`data-line-id="${esc(lineId)}"`:''} data-field="${field}" ${disabled?'disabled':''}></span></label>`;}
  function setButtons(item,disabled){ const total=Math.max(0,Math.floor(Number(item.sets)||0)); if(!total) return ''; const checked=Number(item.checked||0); let html='<div class="set-buttons">'; for(let n=1;n<=total;n++){html+=`<button class="set-btn ${checked>=n?'checked':''}" data-set-n="${n}" ${disabled?'disabled':''}>${n}</button>`;} return html+'</div>'; }
  function trainGroupKey(it){ return it.exerciseId?('exercise:'+it.exerciseId):('manual:'+(it.manualGroupId||it.sessionId)); }
  function trainGroups(list){ const out=[]; (list||[]).forEach(it=>{ const key=trainGroupKey(it); let g=out.find(x=>x.key===key); if(!g){ g={key,first:it,items:[]}; out.push(g); } g.items.push(it); }); return out; }
  function trainGroupCard(group,i){
    const disabled = savedWorkout?.date===selectedTrainDate;
    const progressDisabled = disabled || !trainStartTimes[selectedTrainDate];
    const first = group.first || group.items[0];
    return `<div class="exercise-card x-exercise-card x-go-card" data-train-group="${esc(group.key)}" data-mode="go">
      <div class="card-header-row exercise-card-header-stacked">
        <button class="title-area x-exercise-title" type="button" ${disabled?'disabled':`data-train-name="${esc(first.sessionId)}"`}><span class="exercise-num x-exercise-index">${i+1}.</span><span>${esc(displayExerciseName(first.name)||t('chooseExercise'))}</span></button>
          <div class="right-aligned-labels-subgrid" aria-hidden="true"><span class="header-right-label">${esc(t('kg'))}</span><span class="header-right-label">${esc(t('reps'))}</span><span class="header-right-label">${esc(t('sets'))}</span></div>
        <div class="control-box header-actions x-card-tools card-action-group">
          ${!disabled?`<button class="add-set-btn btn-action btn-add" type="button" data-train-plus data-train-plus-session="${esc(first.sessionId)}" aria-label="Add KG Reps Sets line">${icon('add')}</button>`:`<span class="go-saved-spacer" aria-hidden="true"></span>`}
        </div>
      </div>
      <div class="x-set-list">${group.items.map((item,idx)=>{
        const total=Math.max(0,Math.floor(Number(item.sets)||0)); const checked=Math.min(total,Math.max(0,Number(item.checked)||0)); const complete=total>0&&checked>=total;
        const progress=`${checked}/${total}`;
        return `<div class="card-values-row metric-line" data-card-id="${esc(item.sessionId)}">
          ${xRowMetric(t('kg'),item.kg,'train',item,'kg',disabled)}
          ${xRowMetric(t('reps'),item.reps,'train',item,'reps',disabled)}
          ${xRowMetric(t('sets'),item.sets,'train',item,'sets',disabled)}
          <div class="control-box cell-interactive x-go-action-cell row-interactive-cell"><button class="x-check-btn uniform-digit ${complete?'completed':(checked>0?'partial':'')} ${progressDisabled?'disabled':''}" type="button" data-x-set-progress="${esc(item.sessionId)}" ${progressDisabled?'disabled':''} aria-disabled="${progressDisabled?'true':'false'}" aria-label="${esc(t('sets'))}: ${checked}/${total}"><span>${progress}</span></button></div>
        </div>`;
      }).join('')}</div>
    </div>`;
  }
  function clonePlanForCopy(list){
    return (list||[]).map(item=>{
      const lines=ensureLines(item).map(line=>makeLine({kg:line.kg,reps:line.reps,sets:line.sets}));
      return {id:uid(), name:normalExercise(item.name)||'Exercise', kg:lines[0]?.kg??1, reps:lines[0]?.reps??1, sets:lines[0]?.sets??1, lines};
    }).filter(item=>normalExercise(item.name)&&item.lines.length);
  }
  function updatePlanCopyState(){
    const btn=els.copyPlanBtn;
    if(!btn) return;
    const iso=selectedPlanDate;
    const hasCopied=!!(copiedPlan && copiedPlan.items && copiedPlan.items.length);
    btn.classList.remove('paste-ready','copied-state');
    if(hasCopied){
      if(iso && iso!==copiedPlan.sourceIso){
        setButtonLabel(btn,'paste',t('paste'));
        btn.disabled=false;
        btn.classList.add('paste-ready');
      }else{
        setButtonLabel(btn,'copied',t('copied'));
        btn.disabled=true;
        btn.classList.add('copied-state');
      }
    }else{
      const canCopy=!!iso && hasDatePlan(iso);
      setButtonLabel(btn,'copy',t('copy'));
      btn.disabled=!canCopy;
    }
    btn.classList.toggle('disabled', btn.disabled);
  }
  function handlePlanCopyPaste(){
    const iso=selectedPlanDate;
    if(!iso) return;
    if(copiedPlan && copiedPlan.items && copiedPlan.items.length){
      if(iso===copiedPlan.sourceIso) return;
      const pasted=clonePlanForCopy(copiedPlan.items);
      if(!pasted.length) return;
      const btn=els.copyPlanBtn;
      if(btn){ btn.disabled=true; btn.classList.add('disabled'); }
      datePlans[iso]=pasted;
      savedDatePlans[iso]=true;
      activeDatePlans[iso]=true;
      delete trainStartTimes[iso];
      if(selectedTrainDate===iso) savedWorkout=null;
      seedTrainFromDate(iso);
      copiedPlan=null;
      saveAll();
      renderAll();
      toast('Plan pasted');
      return;
    }
    const source=datePlans[iso]||[];
    const items=clonePlanForCopy(source);
    if(!items.length) return;
    copiedPlan={sourceIso:iso,items};
    updatePlanCopyState();
    toast('Plan copied');
  }
  function updatePlanRemoveState(){ const any=!!els.planList.querySelector('[data-remove-check]:checked,[data-plan-line-check]:checked'); els.removeSelectedBtn.disabled=!any; els.removeSelectedBtn.classList.toggle('disabled',!any); }
  function cleanMetricText(v){ return String(v||'').replace(/\D/g,''); }
  function updatePlanSaveState(){
    if(!selectedPlanDay) return;
    const saved=isPlanSaved(selectedPlanDay);
    setButtonLabel(els.savePlanBtn, saved?'copied':'save', saved ? t('saved') : `${t('save')} ${dayShort(selectedPlanDay)}-plan`);
    els.savePlanBtn.disabled = saved || !isPlanValid(selectedPlanDay);
    els.savePlanBtn.classList.toggle('saved', saved);
    els.savePlanBtn.classList.toggle('disabled', !saved && els.savePlanBtn.disabled);
  }
  function wirePlanCards(){
    els.planList.querySelectorAll('[data-remove-check]').forEach(c=>c.addEventListener('change',updatePlanRemoveState));
    els.planList.querySelectorAll('[data-plan-name]').forEach(box=>box.addEventListener('click',()=>openExerciseModal('plan-replace', box.dataset.planName)));
    els.planList.querySelectorAll('[data-metric-mode="plan"]').forEach(inp=>{
      inp.addEventListener('input',()=>{
        const it=currentPlan().find(x=>x.id===inp.dataset.metricId); if(!it)return;
        const cleaned=cleanMetricText(inp.value); if(inp.value!==cleaned) inp.value=cleaned;
        it[inp.dataset.field]=cleaned;
        markPlanDirty(selectedPlanDay);
        updatePlanSaveState();
      });
      inp.addEventListener('blur',()=>renderPlan());
    });
  }
  function removeSelectedPlan(){ if(!selectedPlanDay)return; const ids=[...els.planList.querySelectorAll('[data-remove-check]:checked')].map(x=>x.value); if(!ids.length)return; weekPlans[selectedPlanDay]=currentPlan().filter(x=>!ids.includes(x.id)); markPlanDirty(selectedPlanDay); renderAll(); }
  function saveCurrentPlan(){ if(!selectedPlanDay||!isPlanValid(selectedPlanDay))return; savedPlanDays[selectedPlanDay]=true; syncTrainFromPlan(selectedPlanDay); saveAll(); renderAll(); }
  function addPlanExercise(name){ if(!selectedPlanDay)return; weekPlans[selectedPlanDay].push({id:uid(),name,sets:1,kg:1,reps:1});markPlanDirty(selectedPlanDay);closeExerciseModal();renderAll();}
  function replacePlanExercise(id,name){ if(!selectedPlanDay)return; const it=currentPlan().find(x=>x.id===id); if(!it)return; it.name=name; markPlanDirty(selectedPlanDay); closeExerciseModal(); renderAll();}
  function syncTrainFromPlan(day){trainSessions[day]=(weekPlans[day]||[]).map(p=>({sessionId:uid(),exerciseId:p.id,name:p.name,sets:p.sets,kg:p.kg,reps:p.reps,checked:0,trainAdded:false,addedStarted:false}));}

  function selectTrainDay(day){ if(!hasSavedPlan(day)) return; selectedTrainDay=day; savedWorkout=null; syncTrainFromPlan(day); delete trainStartTimes[day]; saveAll(); renderAll(); }

  function placeSaveTrainingButtonInline(mode='open'){
    const row=$('saveTrainingRow');
    if(!row || !els.saveTrainingBtn) return;
    // Stop/Save belongs below exercise cards, same position logic as PLAN save.
    if(els.saveTrainingBtn.parentNode !== row){
      row.innerHTML='';
      row.appendChild(els.saveTrainingBtn);
    }
    els.saveTrainingBtn.classList.remove('train-save-inline');
    els.saveTrainingBtn.classList.add('train-save-bottom');
    els.saveTrainingBtn.style.display='';
  }


  function renderTrain(){
    // Do-it: swipeable date strip; train the selected date's planned session.
    buildDateStrip(els.trainDayButtons, selectedTrainDate, 'data-train-iso');
    ensureStripBehavior(els.trainDayButtons, 'data-train-iso', iso=>{ selectedTrainDate=iso; renderAll(); });
    const iso=selectedTrainDate;
    els.trainControls.classList.remove('done-state','saved-state','is-visible');
    els.trainControls.style.display = iso ? '' : 'none';

    const trainControlsHtml=({open=false, locked=false, hasList=false, activate=false, durationMs=null}={})=>{
      const addDisabled = locked || !hasList;
      const removeDisabled = true;
      const startDisabled = locked || open || !hasList;
      const startLabel = activate ? t('activateTraining') : (open ? t('started') : t('startTraining'));
      const startIcon = open ? 'copied' : 'start';
      const massText=formatTrainMass(trainMassForDate(iso));
      const timeText=open
        ? formatGoDuration(Date.now()-Number(trainStartTimes[iso]))
        : formatGoDuration(Math.max(0,Number(durationMs)||0));
      return `<button class="action small ${addDisabled?'disabled':''}" id="addTrainExerciseBtn" type="button" ${addDisabled?'disabled':''}>${buttonHtml('add',t('addExercise'))}</button>`+
        `<button class="action small ${startDisabled && !activate?'disabled':''}" id="startInlineBtn" type="button" ${startDisabled && !activate?'disabled':''}>${buttonHtml(startIcon,startLabel)}</button>`+
        `<span class="train-live-stats">`+
          `<span class="train-mass" id="trainMass" aria-label="${esc(t('total'))}: ${esc(massText)} KG"><span class="train-stat-label train-mass-label">${esc(t('total'))}:</span><strong id="trainMassValue">${esc(massText)} KG</strong></span>`+
          `<span class="train-time" id="trainTime" aria-label="${esc(t('time'))}: ${esc(timeText)}"><span class="train-stat-label train-time-label">${esc(t('time'))}:</span><strong class="timer" id="liveTimer">${esc(timeText)}</strong></span>`+
        `</span>`;
    };

    if(!iso){
      els.trainControls.innerHTML='';
      els.trainList.innerHTML=`<div class="empty exercise-typography-empty">${esc(t('selectDay'))}</div>`;
      setTrainSaveState();
      return;
    }

    const open=!!trainStartTimes[iso]; const finished=savedWorkout?.date===iso; const done=journalForDate(iso);
    if(done && !activeDatePlans[iso] && !open && !finished){
      els.trainControls.classList.add('saved-state','is-visible');
      els.trainControls.style.display='';
      els.trainControls.innerHTML=trainControlsHtml({locked:true, hasList:true, activate:false, durationMs:done?.durationMs});
      els.trainList.innerHTML=completedExerciseCardsHtml(done);
      placeSaveTrainingButtonInline('saved');
      setTrainSaveState();
      return;
    }
    if(finished){
      els.trainControls.classList.add('saved-state','is-visible');
      els.trainControls.style.display='';
      els.trainControls.innerHTML=trainControlsHtml({locked:true, hasList:true, activate:false, durationMs:savedWorkout?.durationMs ?? done?.durationMs});
      els.trainList.innerHTML=completedExerciseCardsHtml(done);
      placeSaveTrainingButtonInline('saved');
      setTrainSaveState();
      return;
    }

    if(!open && !finished && !(trainSessions[iso]||[]).length && isDatePlanValid(iso)){ seedTrainFromDate(iso); saveAll(); }
    const list=trainSessions[iso]||[];
    if(!list.length){
      els.trainControls.style.display='none';
      els.trainControls.innerHTML='';
      els.trainList.innerHTML=`<div class="empty exercise-typography-empty">${esc(t('noTrainingPlanned'))}</div>`;
      setTrainSaveState();
      return;
    }

    els.trainControls.classList.add('is-visible');
    els.trainControls.style.display='';
    els.trainControls.innerHTML=trainControlsHtml({open, locked:false, hasList:true});
    placeSaveTrainingButtonInline('open');
    const addBtn=$('addTrainExerciseBtn'); if(addBtn) addBtn.addEventListener('click',()=>openExerciseModal('train-add'));
    const startBtn=$('startInlineBtn'); if(startBtn) startBtn.addEventListener('click', startTraining);
    els.trainList.innerHTML = trainGroups(list).map((g,i)=>trainGroupCard(g,i)).join('');
    wireTrainCards();
    setTrainSaveState();
  }
  function wireTrainCards(){
    els.trainList.querySelectorAll('[data-train-name]').forEach(box=>box.addEventListener('click',()=>openExerciseModal('train-replace', box.dataset.trainName)));
    els.trainList.querySelectorAll('[data-train-plus]').forEach(btn=>btn.addEventListener('click',()=>addTrainLine(btn.dataset.trainPlusSession)));
    els.trainList.querySelectorAll('[data-metric-mode="train"]').forEach(inp=>{
      inp.addEventListener('input',()=>{
        const it=findTrain(inp.dataset.metricId); if(!it||isTrainLocked())return;
        const cleaned=cleanMetricText(inp.value); if(inp.value!==cleaned) inp.value=cleaned;
        it[inp.dataset.field]=cleaned;
        if(inp.dataset.field==='sets' && Number(it.checked)>Number(cleaned)) it.checked=Number(cleaned)||0;
        updateTrainItemPerformanceStatus(it);
        saveAll(); updateTrainMassDisplay(); setTrainSaveState();
      });
      inp.addEventListener('blur',()=>renderTrain());
    });
    els.trainList.querySelectorAll('[data-x-set-progress]').forEach(btn=>btn.addEventListener('click',()=>{
      if(isTrainLocked() || !trainStartTimes[selectedTrainDate])return; const it=findTrain(btn.dataset.xSetProgress); if(!it)return;
      const total=Math.max(0,Math.floor(Number(it.sets)||0)); if(!total)return;
      const checked=Math.max(0,Number(it.checked)||0); it.checked=checked>=total?0:checked+1;
      if(it.trainAdded && it.checked>0) it.addedStarted=true;
      updateTrainItemPerformanceStatus(it);
      saveAll(); renderTrain();
    }));
    els.trainList.querySelectorAll('[data-set-n]').forEach(btn=>btn.addEventListener('click',()=>{if(isTrainLocked() || !trainStartTimes[selectedTrainDate])return; const card=btn.closest('[data-card-id]'); const it=findTrain(card.dataset.cardId); if(!it)return; const n=Number(btn.dataset.setN); it.checked = Number(it.checked)>=n ? n-1 : n; if(it.trainAdded && it.checked>0){it.addedStarted=true;} updateTrainItemPerformanceStatus(it); saveAll(); renderTrain();}));
  }
  function findTrain(sessionId){return (trainSessions[selectedTrainDate]||[]).find(x=>x.sessionId===sessionId);}
  function isTrainSavedState(iso=selectedTrainDate){ return !!iso && ((savedWorkout?.date===iso) || (!!journalForDate(iso) && !activeDatePlans[iso] && !trainStartTimes[iso])); }
  function isTrainLocked(){return isTrainSavedState(selectedTrainDate);}
  function weekdayOf(iso){ return DAYS[(new Date(iso+'T00:00:00').getDay()+6)%7]; }
  function activateTraining(iso){
    if(!iso) return;
    const plan=datePlans[iso]||[];
    if(!plan.length){
      const done=journalForDate(iso);
      if(done){
        datePlans[iso]=(done.exercises||[]).map(ex=>({id:uid(),name:normalExercise(ex.name)||'Exercise',lines:(ex.sets||[]).map(s=>makeLine({kg:s.kg,reps:s.reps,sets:s.sets}))}));
        datePlans[iso].forEach(syncFirstLine);
      }
    }
    activeDatePlans[iso]=true;
    savedDatePlans[iso]=true;
    savedWorkout=null;
    delete trainStartTimes[iso];
    seedTrainFromDate(iso);
    selectedPlanDate=iso;
    selectedTrainDate=iso;
    saveAll();
    renderAll();
    
  }
  function startTraining(){ const iso=selectedTrainDate; if(!iso||isTrainLocked())return; if(!(trainSessions[iso]||[]).length){ if(!isDatePlanValid(iso))return; seedTrainFromDate(iso); } if(!trainStartTimes[iso]){ trainStartTimes[iso]=Date.now(); savedDatePlans[iso]=true; saveAll(); } renderTrain(); updateTimerLoop(); }
  function addTrainLine(sessionId){
    const iso=selectedTrainDate; if(!iso||isTrainLocked())return;
    const list=(trainSessions[iso]=trainSessions[iso]||[]);
    const first=sessionId?list.find(x=>x.sessionId===sessionId):null;
    if(!first){ list.push({sessionId:uid(),exerciseId:null,manualGroupId:uid(),name:'',sets:1,kg:1,reps:1,checked:0,trainAdded:true,addedStarted:false}); saveAll(); renderTrain(); return; }
    const groupKey=first.exerciseId || first.manualGroupId || first.sessionId;
    if(!first.exerciseId && !first.manualGroupId) first.manualGroupId=groupKey;
    const group=list.filter(x=>x.exerciseId ? x.exerciseId===first.exerciseId : (x.manualGroupId||x.sessionId)===groupKey);
    const last=group[group.length-1]||first;
    const lastIdx=list.lastIndexOf(last);
    const line={sessionId:uid(),exerciseId:first.exerciseId||null,manualGroupId:first.exerciseId?undefined:groupKey,lineId:uid(),name:first.name,sets:last.sets||1,kg:last.kg||1,reps:last.reps||1,checked:0,trainAdded:true,addedStarted:false};
    list.splice(lastIdx+1,0,line);
    saveAll(); renderTrain();
  }
  function addTrainExercise(name){
    const iso=selectedTrainDate; if(!iso||isTrainLocked())return;
    name=normalExercise(name);
    if(!name){ openExerciseModal('train-add'); return; }
    const list=(trainSessions[iso]=trainSessions[iso]||[]);
    list.push({sessionId:uid(),exerciseId:null,manualGroupId:uid(),name,sets:1,kg:1,reps:1,checked:0,trainAdded:true,addedStarted:false});
    closeExerciseModal();
    saveAll();
    renderTrain();
  }
  function replaceTrainExercise(sessionId,name){const it=findTrain(sessionId); if(!it)return; if(it.exerciseId){ (trainSessions[selectedTrainDate]||[]).forEach(x=>{if(x.exerciseId===it.exerciseId)x.name=name;}); } else if(it.manualGroupId){ (trainSessions[selectedTrainDate]||[]).forEach(x=>{if(x.manualGroupId===it.manualGroupId)x.name=name;}); } else { it.name=name; } closeExerciseModal(); saveAll(); renderTrain();}
  function renderRemoveLast(){}
  function resetSaveTrainingConfirm(updateLabel=false){
    saveTrainingConfirmArmed=false;
    if(saveTrainingConfirmTimer){ clearTimeout(saveTrainingConfirmTimer); saveTrainingConfirmTimer=null; }
    if(updateLabel) setTrainSaveState();
  }
  function armSaveTrainingConfirm(){
    saveTrainingConfirmArmed=true;
    if(saveTrainingConfirmTimer) clearTimeout(saveTrainingConfirmTimer);
    saveTrainingConfirmTimer=setTimeout(()=>resetSaveTrainingConfirm(true),4000);
    setTrainSaveState();
  }
  function setTrainSaveState(){
    const iso=selectedTrainDate;
    const row=$('saveTrainingRow');
    const hasSession=!!(iso && ((trainSessions[iso]||[]).length || journalForDate(iso)));
    const visible=!!iso && hasSession;
    if(row){ row.classList.toggle('is-visible',visible); row.style.display=visible?'flex':'none'; }
    if(els.saveTrainingBtn) els.saveTrainingBtn.style.display=visible?'':'none';
    if(!visible){ resetSaveTrainingConfirm(false); return; }
    placeSaveTrainingButtonInline(isTrainLocked() ? 'saved' : 'open');
    const locked=isTrainSavedState(iso);
    const can=canSaveTraining();
    if((locked||!can) && saveTrainingConfirmArmed) resetSaveTrainingConfirm(false);
    const confirmActive=!locked && can && saveTrainingConfirmArmed;
    setButtonLabel(els.saveTrainingBtn, locked?'copied':(confirmActive?'copied':'stop'), locked ? t('saved') : (confirmActive ? '✓ '+t('stopSaveTraining') : t('stopSaveTraining')));
    els.saveTrainingBtn.disabled = locked || !can;
    els.saveTrainingBtn.classList.toggle('saved',locked);
    els.saveTrainingBtn.classList.toggle('disabled',!locked&&!can);
    els.saveTrainingBtn.classList.toggle('confirming',confirmActive);
  }

  function canSaveTraining(){ const iso=selectedTrainDate; if(!iso||!trainStartTimes[iso])return false; const list=trainSessions[iso]||[]; if(!list.length)return false; if(!list.every(x=>normalExercise(x.name)&&isPositive(x.sets)&&isPositive(x.kg)&&isPositive(x.reps)))return false; return list.some(x=>Number(x.checked)>0); }
  function planSnapshotForDate(iso){
    return (datePlans[iso]||[]).map(ex=>{
      const rawLines=(Array.isArray(ex.lines)&&ex.lines.length)?ex.lines:[{id:'',kg:ex.kg,reps:ex.reps,sets:ex.sets}];
      return {
        id:ex.id||'',
        name:normalExercise(ex.name)||'Exercise',
        lines:rawLines.map(line=>({id:line.id||'',kg:Number(line.kg)||0,reps:Number(line.reps)||0,sets:Number(line.sets)||0}))
      };
    });
  }
  function planLookup(snapshot){
    const byLine={}; const byExercise={};
    (snapshot||[]).forEach(ex=>{
      (ex.lines||[]).forEach((line,idx)=>{
        const planned={name:ex.name,kg:Number(line.kg)||0,reps:Number(line.reps)||0,sets:Number(line.sets)||0};
        if(ex.id && line.id) byLine[ex.id+'|'+line.id]=planned;
        if(ex.id && idx===0) byExercise[ex.id]=planned;
      });
    });
    return {byLine,byExercise};
  }
  function plannedForTrainItem(it, lookup){
    if(!it||!it.exerciseId)return null;
    if(it.lineId){ return lookup.byLine[it.exerciseId+'|'+it.lineId] || null; }
    return lookup.byExercise[it.exerciseId] || null;
  }
  function performanceNumber(value){
    if(value===''||value===null||value===undefined) return null;
    const raw=String(value).trim();
    if(!raw) return null;
    const n=parseFloat(raw.replace(',', '.').replace(/[^0-9.\-]/g,''));
    return Number.isFinite(n)?n:null;
  }
  function normalizePerformanceStatus(value){
    const status=String(value||'').toLowerCase();
    return status==='hit'||status==='missed' ? status : '';
  }
  function evaluatePerformanceStatus(planned, done){
    const fields=['kg','reps','sets'];
    let hasPlannedTarget=false;
    for(const field of fields){
      const plannedValue=performanceNumber(planned&&planned[field]);
      if(plannedValue===null) continue;
      hasPlannedTarget=true;
      const doneValue=performanceNumber(done&&done[field]);
      if(doneValue===null || doneValue<plannedValue) return 'missed';
    }
    // Manually added GO rows have no PLAN target; preserve the existing logged-as-complete behavior.
    return 'hit';
  }
  function updateTrainItemPerformanceStatus(it, iso=selectedTrainDate, lookup=null){
    if(!it) return 'missed';
    const activeLookup=lookup||planLookup(planSnapshotForDate(iso));
    const planned=plannedForTrainItem(it,activeLookup);
    const total=Math.max(0,Math.floor(Number(it.sets)||0));
    const checked=Math.min(total,Math.max(0,Number(it.checked)||0));
    const status=evaluatePerformanceStatus(planned,{kg:it.kg,reps:it.reps,sets:checked});
    it.performanceStatus=status;
    return status;
  }
  function saveTraining(){
    if(!canSaveTraining()||isTrainLocked()){ resetSaveTrainingConfirm(false); return; }
    if(!saveTrainingConfirmArmed){ armSaveTrainingConfirm(); return; }
    resetSaveTrainingConfirm(false);
    const iso=selectedTrainDate;
    const start=Number(trainStartTimes[iso])||Date.now();
    const end=Date.now();
    const plannedExercises=planSnapshotForDate(iso);
    const exercises=collectCompleted(plannedExercises);
    if(!exercises.length)return;
    const savedEntry={id:uid(),date:iso,day:weekdayOf(iso),startedAt:new Date(start).toISOString(),endedAt:new Date(end).toISOString(),durationMs:end-start,plannedExercises,exercises};
    journal.unshift(savedEntry);
    expandedLogId=savedEntry.id;
    savedDatePlans[iso]=true; activeDatePlans[iso]=false; savedWorkout={date:iso,durationMs:end-start}; delete trainStartTimes[iso]; saveAll(); renderAll();
  }
  function collectCompleted(plannedExercises=null){
    const out=[];
    const lookup=planLookup(plannedExercises||planSnapshotForDate(selectedTrainDate));
    for(const it of trainSessions[selectedTrainDate]||[]){
      const checked=Math.min(Number(it.checked)||0, Number(it.sets)||0);
      const name=normalExercise(it.name);
      if(checked>0 && name){
        const key=it.exerciseId||('manual:'+name);
        let group=out.find(x=>x._key===key);
        if(!group){ group={_key:key,name,sets:[]}; out.push(group); }
        const planned=plannedForTrainItem(it, lookup);
        const done={sets:checked,kg:Number(it.kg),reps:Number(it.reps)};
        const performanceStatus=evaluatePerformanceStatus(planned,done);
        it.performanceStatus=performanceStatus;
        group.sets.push({...done,planned:planned?{kg:planned.kg,reps:planned.reps,sets:planned.sets}:null,performanceStatus});
      }
    }
    return out.map(({_key,...x})=>x);
  }
  function reportCell(v){ return v===''||v===null||v===undefined ? '-' : String(v); }
  function logRowTargetHit(row){
    return evaluatePerformanceStatus(
      {kg:row&&row.pKg,reps:row&&row.pReps,sets:row&&row.pSets},
      {kg:row&&row.dKg,reps:row&&row.dReps,sets:row&&row.dSets}
    )==='hit';
  }
  function ensureExpandedLogId(){
    if(!Array.isArray(journal) || !journal.length){ expandedLogId=null; return null; }
    if(expandedLogId && !journal.some(entry=>entry && entry.id===expandedLogId)) expandedLogId=journal[0].id;
    return expandedLogId;
  }
  function renderProgress(){
    const groups = progressGroups('all');
    const openId = ensureExpandedLogId();
    const hasProgress = groups.length>0;
    const hasOpenLog=!!openId;
    const actions=$('progressActions');
    if(actions) actions.classList.toggle('is-hidden', !hasProgress);
    els.downloadWordBtn.disabled=!hasOpenLog;
    els.downloadPdfBtn.disabled=!hasOpenLog;
    els.downloadWordBtn.classList.toggle('disabled',!hasOpenLog);
    els.downloadPdfBtn.classList.toggle('disabled',!hasOpenLog);
    if(!hasProgress){els.journalList.innerHTML=`<div class="empty exercise-typography-empty">${esc(t('noSavedReport'))}</div>`;return;}
    els.journalList.innerHTML = groups.map(g=>{
      const isOpen=g.id===openId;
      return `<section class="log-workout-group ${isOpen?'is-open':'is-collapsed'}" data-log-group="${esc(g.id)}">
      <button class="log-workout-meta log-summary-button" type="button" data-open-log="${esc(g.id)}" aria-expanded="${isOpen?'true':'false'}" aria-label="${esc(t('report'))}: ${esc(g.date)}">
        <span class="log-meta-cell"><span class="log-meta-label">${esc(t('date'))}</span><span class="log-meta-value">${esc(g.date)}</span></span>
        <span class="log-meta-cell"><span class="log-meta-label">${esc(t('startTime'))}</span><span class="log-meta-value">${esc(g.startTime)}</span></span>
        <span class="log-meta-cell"><span class="log-meta-label">${esc(t('duration'))}</span><span class="log-meta-value">${esc(g.duration)}</span></span>
        <span class="log-meta-cell"><span class="log-meta-label">${esc(t('total'))}</span><span class="log-meta-value">${esc(g.totalWeight)} KG</span></span>
      </button>
      ${isOpen ? `<div class="log-workout-details">${g.exercises.map((ex,exerciseIndex)=>`<article class="exercise-card log-history-card">
        <div class="exercise-card-header">
          <div class="log-title-stack">
            <h2 class="exercise-title"><span class="exercise-num">${exerciseIndex+1}.</span> ${esc(displayExerciseName(ex.name))}</h2>
            <div class="meta-subline lbl">
              <span>${esc(t('everMax'))} <strong class="gold-accent-text">${esc(ex.everMax)} KG</strong></span>
              <span class="log-record-separator" aria-hidden="true">•</span>
              <span>${esc(t('maxToday'))} <strong class="gold-accent-text">${esc(ex.todayMax)} KG</strong></span>
            </div>
          </div>
        </div>
        <div class="matrix-centered-box">
          <div class="matrix-unified-grid-layout matrix-header-grid" aria-hidden="true">
            <div class="header-right-label">${esc(t('kg'))}</div>
            <div class="header-right-label">${esc(t('reps'))}</div>
            <div class="header-right-label">${esc(t('sets'))}</div>
            <div></div>
          </div>
          <div class="matrix-grid-rows-wrapper">
            ${ex.rows.map(r=>{
              const targetHit=logRowTargetHit(r);
              return `<div class="matrix-unified-grid-layout log-matrix-data-row" data-set-row>
                <div class="horizontal-data-stream"><span class="val-p" data-plan="${esc(reportCell(r.pKg))}">${esc(reportCell(r.pKg))}</span><span class="data-divider-slash" aria-hidden="true">/</span><span class="val-d" data-done="${esc(reportCell(r.dKg))}">${esc(reportCell(r.dKg))}</span></div>
                <div class="horizontal-data-stream"><span class="val-p" data-plan="${esc(reportCell(r.pReps))}">${esc(reportCell(r.pReps))}</span><span class="data-divider-slash" aria-hidden="true">/</span><span class="val-d" data-done="${esc(reportCell(r.dReps))}">${esc(reportCell(r.dReps))}</span></div>
                <div class="horizontal-data-stream"><span class="val-p" data-plan="${esc(reportCell(r.pSets))}">${esc(reportCell(r.pSets))}</span><span class="data-divider-slash" aria-hidden="true">/</span><span class="val-d" data-done="${esc(reportCell(r.dSets))}">${esc(reportCell(r.dSets))}</span></div>
                <div class="action-status-cell"><span class="indicator-icon-clean ${targetHit?'state-hit':'state-missed'}" aria-label="${targetHit?'Target reached':'Target missed'}">${targetHit?'✓':'✕'}</span></div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </article>`).join('')}</div>` : ''}
    </section>`;
    }).join('');
    els.journalList.querySelectorAll('[data-open-log]').forEach(button=>button.addEventListener('click',()=>{
      expandedLogId=(expandedLogId===button.dataset.openLog)?null:button.dataset.openLog;
      renderProgress();
      renderExplanations();
    }));
  }
  function exerciseEverMaxMap(){
    const map={};
    (journal||[]).forEach(entry=>{
      (entry.exercises||[]).forEach(ex=>{
        const name=normalExercise(ex.name)||'Exercise';
        (ex.sets||[]).forEach(s=>{
          const kg=Number(s.kg)||0;
          if(kg>0) map[name]=Math.max(map[name]||0,kg);
        });
      });
    });
    return map;
  }
  function plannedValueText(planned, field){
    if(!planned)return '';
    const key=String(field||'').toLowerCase();
    const n=Number(planned[key])||0;
    return n>0 ? weightText(n) : '';
  }
  function progressGroups(scope='open'){
    const everMax=exerciseEverMaxMap();
    const openId=ensureExpandedLogId();
    const entries=scope==='all' ? journal : journal.filter(entry=>entry && entry.id===openId);
    return entries.map(entry=>{
      const byName=[]; let totalWeight=0;
      (entry.exercises||[]).forEach(ex=>{
        const name=normalExercise(ex.name)||'Exercise';
        let group=byName.find(item=>item.name===name);
        if(!group){ group={name,rows:[],todayMax:0,everMax:everMax[name]||0}; byName.push(group); }
        (ex.sets||[]).forEach(s=>{
          const sets=Number(s.sets)||0, kg=Number(s.kg)||0, reps=Number(s.reps)||0;
          if(sets>0 && kg>0 && reps>0) totalWeight+=sets*kg*reps;
          if(!(sets>0 && kg>0 && reps>0)) return;
          group.todayMax=Math.max(group.todayMax,kg);
          group.everMax=Math.max(group.everMax,kg);
          const planned=s.planned||null;
          group.rows.push({
            pKg:plannedValueText(planned,'KG'), dKg:weightText(kg),
            pReps:plannedValueText(planned,'reps'), dReps:weightText(reps),
            pSets:plannedValueText(planned,'sets'), dSets:weightText(sets),
            performanceStatus:normalizePerformanceStatus(s.performanceStatus)
          });
        });
      });
      const exercises=byName.filter(ex=>ex.rows.length).map(ex=>({
        name:ex.name,
        everMax:weightText(ex.everMax),
        todayMax:weightText(ex.todayMax),
        rows:ex.rows
      }));
      return {id:entry.id,date:dateDisplay(entry.date), startTime:formatStartTime(entry.startedAt), duration:formatDuration(entry.durationMs), totalWeight:weightText(totalWeight), exercises};
    });
  }
  function progressText(scope='open'){
    return progressGroups(scope).map(g=>{
      const lines=g.exercises.map(ex=>{
        const setLines=ex.rows.map(r=>`    ${reportCell(r.pKg)} / ${reportCell(r.dKg)} / ${reportCell(r.pReps)} / ${reportCell(r.dReps)} / ${reportCell(r.pSets)} / ${reportCell(r.dSets)}`).join('\n');
        return `  ${displayExerciseName(ex.name)}: ${t('everMax')} ${ex.everMax} KG, ${t('maxToday')} ${ex.todayMax} KG\n${setLines}`;
      }).join('\n');
      return `${g.date} - ${t('startTime')}: ${g.startTime} - ${t('duration')}: ${g.duration} - ${t('total')}: ${g.totalWeight} KG\n${t('reportHeader')}\n${lines}`;
    }).join('\n\n');
  }
  function reportLayoutLabels(){
    const byLang={
      en:{date:'Date',start:'Start Time',duration:'Duration',totalVolume:'Total',weight:'Weight',reps:'REPS',sets:'Sets',status:'Status',targetHit:'Target Hit',hitShort:'Hit',underWeight:'Under planned weight',underReps:'Under planned reps',underSets:'Under planned sets',overTarget:'Above PLAN',logged:'Logged',reportTitle:'Workout Report',formatNote:'(All values formatted as PLAN / Done)'},
      de:{date:'Datum',start:'Startzeit',duration:'Dauer',totalVolume:'Summe',weight:'Gewicht',reps:'WH.',sets:'Sätze',status:'Status',targetHit:'Ziel erreicht',hitShort:'Ziel',underWeight:'Unter geplantem Gewicht',underReps:'Unter geplanten WH.',underSets:'Unter geplanten Sätzen',overTarget:'Über PLAN',logged:'Erfasst',reportTitle:'Trainingsbericht',formatNote:'(Alle Werte als PLAN / Erledigt)'},
      fr:{date:'Date',start:'Heure de début',duration:'Durée',totalVolume:'Total',weight:'Poids',reps:'RÉP.',sets:'Séries',status:'Statut',targetHit:'Objectif atteint',hitShort:'Atteint',underWeight:'Poids sous le PLAN',underReps:'RÉP. sous le PLAN',underSets:'Séries sous le PLAN',overTarget:'Au-dessus du PLAN',logged:'Enregistré',reportTitle:'Rapport d’entraînement',formatNote:'(Toutes les valeurs : PLAN / Fait)'},
      it:{date:'Data',start:'Ora di inizio',duration:'Durata',totalVolume:'Totale',weight:'Peso',reps:'RIP.',sets:'Serie',status:'Stato',targetHit:'Obiettivo raggiunto',hitShort:'Raggiunto',underWeight:'Peso sotto il PLAN',underReps:'RIP. sotto il PLAN',underSets:'Serie sotto il PLAN',overTarget:'Sopra il PLAN',logged:'Registrato',reportTitle:'Rapporto di allenamento',formatNote:'(Tutti i valori: PLAN / Fatto)'},
      es:{date:'Fecha',start:'Hora de inicio',duration:'Duración',totalVolume:'Total',weight:'Peso',reps:'REPS',sets:'Series',status:'Estado',targetHit:'Objetivo alcanzado',hitShort:'Logrado',underWeight:'Peso por debajo del PLAN',underReps:'REPS por debajo del PLAN',underSets:'Series por debajo del PLAN',overTarget:'Por encima del PLAN',logged:'Registrado',reportTitle:'Informe de entrenamiento',formatNote:'(Todos los valores: PLAN / Hecho)'}
    };
    return byLang[currentLang] || byLang.en;
  }
  function reportDownloadHeaders(){
    const L=reportLayoutLabels();
    return [L.weight,L.reps,L.sets,''];
  }
  function reportNum(v){ return performanceNumber(v); }
  function reportPair(planned,done,suffix=''){
    const p=reportCell(planned), d=reportCell(done);
    const unit=suffix && (p!=='-' || d!=='-') ? ' '+suffix : '';
    return `${p} / ${d}${unit}`;
  }
  function reportFormatVolume(value){
    const n=reportNum(value);
    if(n===null) return reportCell(value);
    const rounded=Math.round(n*100)/100;
    const parts=String(rounded).split('.');
    parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,"'");
    return parts.join('.');
  }
  function reportStatusDisplay(status,L){
    const raw=String(status==null?'':status);
    const missed=raw.indexOf('⚠️')===0;
    return missed
      ? {text:'✕',color:'FF453A',bold:true,kind:'miss'}
      : {text:'✓',color:'34C759',bold:true,kind:'hit'};
  }
  function reportRowStatus(r){
    const L=reportLayoutLabels();
    const pKg=reportNum(r.pKg), dKg=reportNum(r.dKg), pReps=reportNum(r.pReps), dReps=reportNum(r.dReps), pSets=reportNum(r.pSets), dSets=reportNum(r.dSets);
    if(pKg===null && pReps===null && pSets===null) return L.logged;
    const performanceStatus=evaluatePerformanceStatus(
      {kg:pKg,reps:pReps,sets:pSets},
      {kg:dKg,reps:dReps,sets:dSets}
    );
    if(performanceStatus==='missed'){
      if(pKg!==null && (dKg===null || dKg<pKg)) return '⚠️ '+L.underWeight;
      if(pReps!==null && (dReps===null || dReps<pReps)) return '⚠️ '+L.underReps;
      if(pSets!==null && (dSets===null || dSets<pSets)) return '⚠️ '+L.underSets;
    }
    if((pKg!==null&&dKg!==null&&dKg>pKg)||(pReps!==null&&dReps!==null&&dReps>pReps)||(pSets!==null&&dSets!==null&&dSets>pSets)) return L.overTarget;
    return L.targetHit;
  }
  const REPORT_LOGO_DATA = window.EASY_GYM_REPORT_ASSETS.REPORT_LOGO_DATA;
  const MAX_EVER_ICON_DATA = window.EASY_GYM_REPORT_ASSETS.MAX_EVER_ICON_DATA;
  const MAX_TODAY_ICON_DATA = window.EASY_GYM_REPORT_ASSETS.MAX_TODAY_ICON_DATA;
  function reportDataUriBytes(uri){
    const b64=String(uri||'').split(',')[1]||'';
    const raw=atob(b64), out=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++) out[i]=raw.charCodeAt(i);
    return out;
  }
  function reportUtf8Bytes(value){ return new TextEncoder().encode(String(value==null?'':value)); }
  function reportConcatBytes(parts){
    const total=parts.reduce((n,p)=>n+p.length,0), out=new Uint8Array(total);
    let offset=0; parts.forEach(p=>{out.set(p,offset);offset+=p.length;});
    return out;
  }
  function reportU16(v){ return new Uint8Array([v&255,(v>>>8)&255]); }
  function reportU32(v){ return new Uint8Array([v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255]); }
  let reportCrcTable=null;
  function reportCrc32(bytes){
    if(!reportCrcTable){
      reportCrcTable=new Uint32Array(256);
      for(let n=0;n<256;n++){
        let c=n;
        for(let k=0;k<8;k++) c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);
        reportCrcTable[n]=c>>>0;
      }
    }
    let c=0xFFFFFFFF;
    for(let i=0;i<bytes.length;i++) c=reportCrcTable[(c^bytes[i])&255]^(c>>>8);
    return (c^0xFFFFFFFF)>>>0;
  }
  function reportZipStored(files){
    const now=new Date();
    const dosTime=((now.getHours()&31)<<11)|((now.getMinutes()&63)<<5)|((Math.floor(now.getSeconds()/2))&31);
    const dosDate=(((Math.max(1980,now.getFullYear())-1980)&127)<<9)|(((now.getMonth()+1)&15)<<5)|(now.getDate()&31);
    const locals=[], centrals=[]; let offset=0;
    files.forEach(file=>{
      const name=reportUtf8Bytes(file.name), data=file.data instanceof Uint8Array?file.data:reportUtf8Bytes(file.data);
      const crc=reportCrc32(data), flags=0x0800;
      const local=reportConcatBytes([
        reportU32(0x04034b50),reportU16(20),reportU16(flags),reportU16(0),reportU16(dosTime),reportU16(dosDate),
        reportU32(crc),reportU32(data.length),reportU32(data.length),reportU16(name.length),reportU16(0),name,data
      ]);
      locals.push(local);
      const central=reportConcatBytes([
        reportU32(0x02014b50),reportU16(20),reportU16(20),reportU16(flags),reportU16(0),reportU16(dosTime),reportU16(dosDate),
        reportU32(crc),reportU32(data.length),reportU32(data.length),reportU16(name.length),reportU16(0),reportU16(0),reportU16(0),
        reportU16(0),reportU32(0),reportU32(offset),name
      ]);
      centrals.push(central); offset+=local.length;
    });
    const centralBytes=reportConcatBytes(centrals);
    const end=reportConcatBytes([
      reportU32(0x06054b50),reportU16(0),reportU16(0),reportU16(files.length),reportU16(files.length),
      reportU32(centralBytes.length),reportU32(offset),reportU16(0)
    ]);
    return reportConcatBytes([...locals,centralBytes,end]);
  }
  function reportDocxEsc(value){
    return String(value==null?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function reportDocxRun(value,size=21,color='1E293B',bold=false,font='Arial',italic=false){
    return `<w:r><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:eastAsia="${font}" w:cs="${font}"/>${bold?'<w:b/><w:bCs/>':''}${italic?'<w:i/><w:iCs/>':''}<w:color w:val="${color}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr><w:t xml:space="preserve">${reportDocxEsc(value)}</w:t></w:r>`;
  }
  function reportDocxParagraph(runs,{line=220,after=0,before=0,keep=false,align='left'}={}){
    return `<w:p><w:pPr><w:jc w:val="${align}"/><w:spacing w:before="${before}" w:after="${after}" w:line="${line}" w:lineRule="exact"/>${keep?'<w:keepNext/>':''}</w:pPr>${runs}</w:p>`;
  }
  function reportDocxCell(content,width,{top=0,bottom=0,left=0,right=80,v='center',shade='FFFFFF',topBorder='',bottomBorder='',topBorderColor='CBD5E1',bottomBorderColor='CBD5E1'}={}){
    const borders=(topBorder||bottomBorder)?`<w:tcBorders>${topBorder?`<w:top w:val="single" w:sz="${topBorder}" w:space="0" w:color="${topBorderColor}"/>`:''}${bottomBorder?`<w:bottom w:val="single" w:sz="${bottomBorder}" w:space="0" w:color="${bottomBorderColor}"/>`:''}</w:tcBorders>`:'';
    return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/><w:vAlign w:val="${v}"/><w:shd w:val="clear" w:color="auto" w:fill="${shade}"/><w:tcMar><w:top w:w="${top}" w:type="dxa"/><w:left w:w="${left}" w:type="dxa"/><w:bottom w:w="${bottom}" w:type="dxa"/><w:right w:w="${right}" w:type="dxa"/></w:tcMar>${borders}</w:tcPr>${content}</w:tc>`;
  }
  function reportDocxImage(relId,name,cx,cy,id){
    return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="${id}" name="${reportDocxEsc(name)}" descr="${reportDocxEsc(name)}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="${reportDocxEsc(name)}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
  }
  function reportDocxSpacer(height=120){ return reportDocxParagraph('',{line:height,after:0,before:0}); }
  function makeReportDocx(){
    const groups=progressGroups(), L=reportLayoutLabels();
    let imageId=1;
    const brandingTable=()=>{
      const widths=[920,7080,2700], grid=widths.map(w=>`<w:gridCol w:w="${w}"/>`).join('');
      const logo=reportDocxCell(reportDocxParagraph(reportDocxImage('rId5','Easy Gym logo',342900,342900,imageId++),{line:620,keep:true,align:'center'}),widths[0],{top:35,bottom:45,right:90,bottomBorder:'18',bottomBorderColor:'1C1C1E'});
      const brandStack=
        reportDocxParagraph(reportDocxRun('EASY GYM',30,'1C1C1E',true),{line:330,keep:true})+
        reportDocxParagraph(reportDocxRun('© 2026 Arthur Stivenson . All rights reserved',14,'8E8E93',false),{line:190,keep:true});
      const brand=reportDocxCell(brandStack,widths[1],{top:35,bottom:45,left:15,right:90,bottomBorder:'18',bottomBorderColor:'1C1C1E'});
      const title=reportDocxCell(reportDocxParagraph(reportDocxRun(String(L.reportTitle).toUpperCase(),22,'1C1C1E',true),{line:620,keep:true,align:'right'}),widths[2],{top:35,bottom:45,left:0,right:40,bottomBorder:'18',bottomBorderColor:'1C1C1E'});
      return `<w:tbl><w:tblPr><w:tblW w:w="10700" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>${grid}</w:tblGrid><w:tr><w:trPr><w:cantSplit/><w:trHeight w:val="760" w:hRule="atLeast"/></w:trPr>${logo}${brand}${title}</w:tr></w:tbl>${reportDocxSpacer(130)}`;
    };
    const summaryTable=g=>{
      const widths=[2675,2675,2675,2675];
      const labels=[L.date,L.start,L.duration,L.totalVolume].map(v=>String(v).toUpperCase());
      const values=[g.date,g.startTime,g.duration,reportFormatVolume(g.totalWeight)+' KG'];
      const grid=widths.map(w=>`<w:gridCol w:w="${w}"/>`).join('');
      const summaryAlign=['left','center','center','right'];
      const row1=labels.map((v,i)=>reportDocxCell(reportDocxParagraph(reportDocxRun(v,16,'8E8E93',true),{line:180,keep:true,align:summaryAlign[i]}),widths[i],{top:20,bottom:35,left:i===0?0:40,right:i===3?50:(i===0?120:40),bottomBorder:'6',bottomBorderColor:'E5E5EA'})).join('');
      const row2=values.map((v,i)=>reportDocxCell(reportDocxParagraph(reportDocxRun(v,28,i===3?'000000':'1C1C1E',true),{line:290,keep:true,align:summaryAlign[i]}),widths[i],{top:45,bottom:35,left:i===0?0:40,right:i===3?50:(i===0?120:40)})).join('');
      return `<w:tbl><w:tblPr><w:tblW w:w="10700" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>${grid}</w:tblGrid><w:tr><w:trPr><w:cantSplit/></w:trPr>${row1}</w:tr><w:tr><w:trPr><w:cantSplit/></w:trPr>${row2}</w:tr></w:tbl>${reportDocxSpacer(230)}`;
    };
    const recordsTable=ex=>{
      const widths=[360,1250,720,420,360,1420,720,5450];
      const grid=widths.map(w=>`<w:gridCol w:w="${w}"/>`).join('');
      const cells=[
        reportDocxCell(reportDocxParagraph(reportDocxImage('rId3','Apex trophy',190500,228600,imageId++),{line:360,keep:true,align:'center'}),widths[0],{top:20,bottom:20,right:20}),
        reportDocxCell(reportDocxParagraph(reportDocxRun('Apex:',19,'3A3A3C',false),{line:210,keep:true}),widths[1],{left:25,right:10}),
        reportDocxCell(reportDocxParagraph(reportDocxRun(ex.everMax+' KG',19,'1C1C1E',true),{line:210,keep:true}),widths[2],{right:0}),
        reportDocxCell(reportDocxParagraph('',{line:210,keep:true}),widths[3],{right:0}),
        reportDocxCell(reportDocxParagraph(reportDocxImage('rId4','Max Today fire',182880,228600,imageId++),{line:360,keep:true,align:'center'}),widths[4],{top:20,bottom:20,right:20}),
        reportDocxCell(reportDocxParagraph(reportDocxRun(t('maxToday')+':',19,'3A3A3C',false),{line:210,keep:true}),widths[5],{left:25,right:10}),
        reportDocxCell(reportDocxParagraph(reportDocxRun(ex.todayMax+' KG',19,'34C759',true),{line:210,keep:true}),widths[6],{right:0}),
        reportDocxCell(reportDocxParagraph(reportDocxRun(L.formatNote,16,'8E8E93',false,'Arial',true),{line:210,keep:true,align:'right'}),widths[7],{right:0})
      ].join('');
      return `<w:tbl><w:tblPr><w:tblW w:w="10700" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>${grid}</w:tblGrid><w:tr><w:trPr><w:cantSplit/><w:trHeight w:val="390" w:hRule="atLeast"/></w:trPr>${cells}</w:tr></w:tbl>`;
    };
    const exerciseTable=ex=>{
      const widths=[2675,2675,2675,2675];
      const grid=widths.map(w=>`<w:gridCol w:w="${w}"/>`).join('');
      const heads=reportDownloadHeaders();
      const columnAlign=['left','center','center','center'];
      const headCells=heads.map((v,i)=>reportDocxCell(reportDocxParagraph(reportDocxRun(String(v).toUpperCase(),16,'8E8E93',true),{line:180,keep:true,align:columnAlign[i]}),widths[i],{top:45,bottom:45,left:i===0?0:50,right:i===0?80:50,bottomBorder:'6',bottomBorderColor:'E5E5EA'})).join('');
      const body=ex.rows.map(r=>{
        const info=reportStatusDisplay(reportRowStatus(r),L);
        const vals=[reportPair(r.pKg,r.dKg,'KG'),reportPair(r.pReps,r.dReps),reportPair(r.pSets,r.dSets),info.text];
        return `<w:tr><w:trPr><w:cantSplit/></w:trPr>${vals.map((v,i)=>reportDocxCell(reportDocxParagraph(reportDocxRun(v,i===3?18:20,i===3?info.color:'1C1C1E',i===3?info.bold:false,i===3?'Segoe UI Symbol':'Arial'),{line:220,align:columnAlign[i]}),widths[i],{top:75,bottom:75,left:i===0?0:50,right:i===0?80:50,bottomBorder:'4',bottomBorderColor:'F2F2F7'})).join('')}</w:tr>`;
      }).join('');
      return `<w:tbl><w:tblPr><w:tblW w:w="10700" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>${grid}</w:tblGrid><w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>${headCells}</w:tr>${body}</w:tbl>`;
    };
    const exerciseBlock=(ex,idx)=>`${reportDocxParagraph(reportDocxRun((idx+1)+'. '+displayExerciseName(ex.name),28,'1C1C1E',true),{line:290,after:25,keep:true})}${recordsTable(ex)}${reportDocxSpacer(45)}${exerciseTable(ex)}${reportDocxSpacer(220)}`;
    const body=brandingTable()+(groups.length?groups.map(g=>summaryTable(g)+g.exercises.map(exerciseBlock).join('')).join(''):reportDocxParagraph(reportDocxRun(t('noReport'),20,'8E8E93',true),{line:220}));
    const documentXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:background w:color="FFFFFF"/><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="560" w:right="620" w:bottom="560" w:left="620" w:header="0" w:footer="0" w:gutter="0"/><w:cols w:space="720"/><w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>`;
    const contentTypes=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`;
    const rootRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`;
    const docRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/max-ever.png"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/max-today.png"/><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/easy-gym-logo.png"/></Relationships>`;
    const stamp=new Date().toISOString();
    const core=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Easy Gym Workout Report</dc:title><dc:creator>Easy Gym</dc:creator><cp:lastModifiedBy>Easy Gym</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${stamp}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${stamp}</dcterms:modified></cp:coreProperties>`;
    const app=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Easy Gym</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><Company></Company><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>1.0</AppVersion></Properties>`;
    return reportZipStored([
      {name:'[Content_Types].xml',data:contentTypes},{name:'_rels/.rels',data:rootRels},{name:'word/document.xml',data:documentXml},
      {name:'word/_rels/document.xml.rels',data:docRels},{name:'word/media/max-ever.png',data:reportDataUriBytes(MAX_EVER_ICON_DATA)},
      {name:'word/media/max-today.png',data:reportDataUriBytes(MAX_TODAY_ICON_DATA)},{name:'word/media/easy-gym-logo.png',data:reportDataUriBytes(REPORT_LOGO_DATA)},
      {name:'docProps/core.xml',data:core},{name:'docProps/app.xml',data:app}
    ]);
  }
  function downloadWord(){ downloadFile('easy-gym-report.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document',makeReportDocx(),true); }
  let reportIconPromise=null;
  function reportLoadImage(src){ return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;}); }
  function reportLoadIcons(){ if(!reportIconPromise) reportIconPromise=Promise.all([reportLoadImage(REPORT_LOGO_DATA),reportLoadImage(MAX_EVER_ICON_DATA),reportLoadImage(MAX_TODAY_ICON_DATA)]); return reportIconPromise; }
  function reportFitCanvasText(ctx,value,maxWidth){
    let s=String(value==null?'':value);
    if(ctx.measureText(s).width<=maxWidth) return s;
    while(s.length>1 && ctx.measureText(s+'…').width>maxWidth) s=s.slice(0,-1);
    return s+'…';
  }
  function reportCanvasJpegBytes(canvas){
    const raw=atob(canvas.toDataURL('image/jpeg',0.96).split(',')[1]), out=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++) out[i]=raw.charCodeAt(i);
    return out;
  }
  function reportPdfAscii(value){ return new TextEncoder().encode(String(value)); }
  function reportBuildImagePdf(images,pdfW=595,pdfH=842){
    const n=images.length, maxId=2+n*3, objects=new Array(maxId+1);
    const pageIds=Array.from({length:n},(_,i)=>3+i);
    const contentIds=Array.from({length:n},(_,i)=>3+n+i);
    const imageIds=Array.from({length:n},(_,i)=>3+n*2+i);
    objects[1]=reportPdfAscii(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
    objects[2]=reportPdfAscii(`2 0 obj\n<< /Type /Pages /Kids [${pageIds.map(id=>id+' 0 R').join(' ')}] /Count ${n} >>\nendobj\n`);
    images.forEach((img,i)=>{
      const pageId=pageIds[i], contentId=contentIds[i], imageId=imageIds[i];
      objects[pageId]=reportPdfAscii(`${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfW} ${pdfH}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`);
      const stream=`q\n${pdfW} 0 0 ${pdfH} 0 0 cm\n/Im0 Do\nQ\n`, streamBytes=reportPdfAscii(stream);
      objects[contentId]=reportConcatBytes([reportPdfAscii(`${contentId} 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n`),streamBytes,reportPdfAscii(`endstream\nendobj\n`)]);
      objects[imageId]=reportConcatBytes([reportPdfAscii(`${imageId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.bytes.length} >>\nstream\n`),img.bytes,reportPdfAscii(`\nendstream\nendobj\n`)]);
    });
    const header=new Uint8Array([37,80,68,70,45,49,46,52,10,37,255,255,255,255,10]);
    const parts=[header], offsets=new Array(maxId+1).fill(0); let pos=header.length;
    for(let id=1;id<=maxId;id++){ offsets[id]=pos; parts.push(objects[id]); pos+=objects[id].length; }
    const xrefPos=pos;
    let xref=`xref\n0 ${maxId+1}\n0000000000 65535 f \n`;
    for(let id=1;id<=maxId;id++) xref+=String(offsets[id]).padStart(10,'0')+' 00000 n \n';
    xref+=`trailer\n<< /Size ${maxId+1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
    parts.push(reportPdfAscii(xref));
    return reportConcatBytes(parts);
  }
  async function makeReportTablePdf(){
    const groups=progressGroups();
    if(!groups.length) return makeSimplePdf(t('noReport'));
    const L=reportLayoutLabels();
    const [brandLogo,trophyIcon,fireIcon]=await reportLoadIcons();
    const W=1190,H=1684,M=68,contentW=W-M*2,rowH=50;
    const colors={bg:'#ffffff',primary:'#1c1c1e',black:'#000000',secondary:'#8e8e93',body:'#3a3a3c',success:'#34c759',warning:'#b45309',border:'#e5e5ea',soft:'#f2f2f7'};
    const pages=[];
    let canvas,ctx,y;
    const font=(size,bold=false,italic=false)=>`${italic?'italic ':''}${bold?'700':'400'} ${size}px Arial, "Segoe UI", sans-serif`;
    const line=(x1,y1,x2,y2,color=colors.border,width=2)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};
    const drawText=(value,x,base,size,bold=false,color=colors.primary,maxWidth=null,italic=false)=>{ctx.font=font(size,bold,italic);ctx.fillStyle=color;const shown=maxWidth?reportFitCanvasText(ctx,value,maxWidth):String(value);ctx.fillText(shown,x,base);return ctx.measureText(shown).width;};
    const drawTextRight=(value,right,base,size,bold=false,color=colors.primary,maxWidth=null,italic=false)=>{ctx.font=font(size,bold,italic);const shown=maxWidth?reportFitCanvasText(ctx,value,maxWidth):String(value);ctx.fillStyle=color;ctx.fillText(shown,right-ctx.measureText(shown).width,base);};
    const drawTextCenter=(value,center,base,size,bold=false,color=colors.primary,maxWidth=null,italic=false)=>{ctx.font=font(size,bold,italic);const shown=maxWidth?reportFitCanvasText(ctx,value,maxWidth):String(value);ctx.fillStyle=color;ctx.fillText(shown,center-ctx.measureText(shown).width/2,base);};
    const drawBranding=()=>{
      const top=y;
      ctx.drawImage(brandLogo,M,top,64,64);
      const brandX=M+82;
      drawText('EASY GYM',brandX,top+29,30,true,colors.primary,360);
      drawText('© 2026 Arthur Stivenson . All rights reserved',brandX,top+55,14,false,colors.secondary,510);
      drawTextRight(String(L.reportTitle).toUpperCase(),W-M-4,top+38,18,true,colors.primary,330);
      line(M,top+80,W-M,top+80,colors.primary,3);
      y=top+106;
    };
    const newPage=()=>{
      canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;ctx=canvas.getContext('2d');
      ctx.fillStyle=colors.bg;ctx.fillRect(0,0,W,H);ctx.textBaseline='alphabetic';ctx.lineCap='butt';y=M;drawBranding();
    };
    const finishPage=()=>{ if(canvas) pages.push({bytes:reportCanvasJpegBytes(canvas),width:W,height:H}); };
    const ensure=h=>{ if(y+h>H-M){finishPage();newPage();} };
    const drawOverview=g=>{
      ensure(96);
      const labels=[L.date,L.start,L.duration,L.totalVolume], vals=[g.date,g.startTime,g.duration,reportFormatVolume(g.totalWeight)+' KG'], colW=contentW/4;
      labels.forEach((v,i)=>{
        const value=String(v).toUpperCase(), left=M+i*colW, center=left+colW/2, right=left+colW;
        if(i===0) drawText(value,left,y+18,16,true,colors.secondary,colW-22);
        else if(i===3) drawTextRight(value,right,y+18,16,true,colors.secondary,colW-22);
        else drawTextCenter(value,center,y+18,16,true,colors.secondary,colW-22);
      });
      line(M,y+29,W-M,y+29,colors.border,2);
      vals.forEach((v,i)=>{
        const left=M+i*colW, center=left+colW/2, right=left+colW;
        if(i===0) drawText(v,left,y+62,28,true,colors.primary,colW-22);
        else if(i===3) drawTextRight(v,right,y+62,28,true,colors.black,colW-22);
        else drawTextCenter(v,center,y+62,28,true,colors.primary,colW-22);
      });
      y+=96;
    };
    const drawExerciseHeader=(ex,idx,continued=false)=>{
      drawText((idx+1)+'. '+displayExerciseName(ex.name)+(continued?' (cont.)':''),M,y+29,28,true,colors.primary,contentW); y+=39;
      const recordsBase=y+27;
      const everIconX=M, everLabelX=everIconX+31;
      const todayIconX=M+310, todayLabelX=todayIconX+31;
      ctx.drawImage(trophyIcon,everIconX,y+1,22,26);
      ctx.drawImage(fireIcon,todayIconX,y+1,21,26);
      const everLabelW=drawText('Apex:',everLabelX,recordsBase,19,false,colors.body);
      drawText(ex.everMax+' KG',everLabelX+everLabelW+8,recordsBase,19,true,colors.primary);
      const todayLabelW=drawText(t('maxToday')+':',todayLabelX,recordsBase,19,false,colors.body);
      drawText(ex.todayMax+' KG',todayLabelX+todayLabelW+8,recordsBase,19,true,colors.success);
      drawTextRight(L.formatNote,W-M,recordsBase,16,false,colors.secondary,390,true);
      y+=43;
      const colW=contentW/4, heads=reportDownloadHeaders();
      heads.forEach((v,i)=>{
        const value=String(v).toUpperCase(), left=M+i*colW, center=left+colW/2;
        if(i===0) drawText(value,left+4,y+18,16,true,colors.secondary,colW-18);
        else drawTextCenter(value,center,y+18,16,true,colors.secondary,colW-18);
      });
      line(M,y+28,W-M,y+28,colors.border,2); y+=40;
      return colW;
    };
    newPage();
    groups.forEach((g,gi)=>{
      drawOverview(g);
      g.exercises.forEach((ex,idx)=>{
        let rowIndex=0, continued=false;
        while(rowIndex<ex.rows.length){
          ensure(39+43+40+rowH+34);
          const colW=drawExerciseHeader(ex,idx,continued); continued=true;
          while(rowIndex<ex.rows.length && y+rowH+34<=H-M){
            const r=ex.rows[rowIndex], info=reportStatusDisplay(reportRowStatus(r),L);
            const vals=[reportPair(r.pKg,r.dKg,'KG'),reportPair(r.pReps,r.dReps),reportPair(r.pSets,r.dSets)];
            vals.forEach((v,i)=>{
              const left=M+i*colW, center=left+colW/2;
              if(i===0) drawText(v,left+4,y+30,20,false,colors.primary,colW-18);
              else drawTextCenter(v,center,y+30,20,false,colors.primary,colW-18);
            });
            drawTextCenter(info.text,M+3.5*colW,y+30,18,info.bold,'#'+info.color,colW-18);
            line(M,y+43,W-M,y+43,colors.soft,1.5); y+=rowH; rowIndex++;
          }
          y+=28;
          if(rowIndex<ex.rows.length){finishPage();newPage();}
        }
      });
      if(gi<groups.length-1) y+=8;
    });
    finishPage();
    return reportBuildImagePdf(pages,595,842);
  }
  async function downloadPdf(){
    try{ downloadFile('easy-gym-report.pdf','application/pdf',await makeReportTablePdf(),true); }
    catch(e){ console.error(e); toast(t('saveFailed')||'PDF could not be created'); }
  }
  function pdfSafeText(value){
    return String(value==null?'':value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7E]/g,'?');
  }
  function pdfEsc(value){ return pdfSafeText(value).replace(/[\\()]/g,'\\$&'); }
    function makeSimplePdf(text){
    const W=595,H=842; const lines=String(text||'').split('\n').slice(0,80); const escPdf=s=>pdfEsc(s); let y=810; let stream='BT /F1 12 Tf 40 '+y+' Td '; lines.forEach((line,i)=>{ if(i){stream+='0 -16 Td ';} stream+='('+escPdf(line)+') Tj ';}); stream+='ET'; return buildPdfDocument([stream],W,H);
  }
  function buildPdfDocument(streams,W,H){
    const objs=[];
    const pageCount=streams.length;
    const kids=[];
    objs.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj');
    for(let i=0;i<pageCount;i++) kids.push((3+i)+' 0 R');
    objs.push('2 0 obj << /Type /Pages /Kids ['+kids.join(' ')+'] /Count '+pageCount+' >> endobj');
    const font1=3+pageCount, font2=4+pageCount;
    streams.forEach((stream,i)=>{
      const pageObj=3+i, contentObj=5+pageCount+i;
      objs.push(pageObj+' 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 '+W+' '+H+'] /Resources << /Font << /F1 '+font1+' 0 R /F2 '+font2+' 0 R >> >> /Contents '+contentObj+' 0 R >> endobj');
    });
    objs.push(font1+' 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj');
    objs.push(font2+' 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj');
    streams.forEach((stream,i)=>{ objs.push((5+pageCount+i)+' 0 obj << /Length '+stream.length+' >> stream\n'+stream+'\nendstream endobj'); });
    let out='%PDF-1.4\n'; const offsets=[0]; objs.forEach(o=>{offsets.push(out.length); out+=o+'\n';}); const xref=out.length;
    out+='xref\n0 '+(objs.length+1)+'\n0000000000 65535 f \n'+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n ').join('\n')+'\ntrailer << /Size '+(objs.length+1)+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF';
    return out;
  }
  function reportBytesToBase64(bytes){
    let binary=''; const chunk=0x8000;
    for(let i=0;i<bytes.length;i+=chunk) binary+=String.fromCharCode(...bytes.subarray(i,Math.min(i+chunk,bytes.length)));
    return btoa(binary);
  }
  function downloadFile(name,mime,content,binary=false){
    const bytes=content instanceof Uint8Array?content:null;
    if(window.AndroidDownload&&typeof window.AndroidDownload.saveFile==='function'){
      const b64=bytes?reportBytesToBase64(bytes):btoa(unescape(encodeURIComponent(String(content))));
      window.AndroidDownload.saveFile(name,mime,b64); return;
    }
    const blob=new Blob([bytes||content],{type:mime}); const a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},200);
  }
  function openExerciseModal(target, sessionId=null){ modalTarget=target; modalSessionId=sessionId; editMode=false; selectedLibraryDelete.clear(); deletedLibraryNames.clear(); libraryDraft=[...exerciseLibrary]; libraryDirty=false; els.addExerciseModal.classList.remove('hidden'); els.customExerciseName.value=''; renderLibrary(); }
  function closeExerciseModal(){els.addExerciseModal.classList.add('hidden'); modalTarget=null; modalSessionId=null;}
  function setLibraryDeleteState(){
    const enabled=editMode && selectedLibraryDelete.size>0;
    els.deleteLibraryBtn.style.display=editMode?'inline-flex':'none';
    els.deleteLibraryBtn.hidden=!editMode;
    els.deleteLibraryBtn.disabled=!enabled;
    els.deleteLibraryBtn.classList.toggle('disabled',!enabled);
  }
  function renderLibrary(){
    $('modalTitle').textContent=t('chooseExercise');
    els.editExercisesBtn.style.display=editMode?'none':'inline-flex';
    els.saveLibraryBtn.style.display=editMode?'inline-flex':'none';
    setLibraryDeleteState();
    els.exerciseModalHelp.textContent='';
    els.customRow.style.display='';
    if(editMode){
      els.libraryList.innerHTML = libraryDraft.map((name,i)=>`<div class="library-edit-row x-library-edit-row"><input class="library-checkbox" type="checkbox" data-lib-check="${i}" ${selectedLibraryDelete.has(i)?'checked':''}><input data-lib-name="${i}" value="${esc(displayExerciseName(name))}"><span></span></div>`).join('');
      els.libraryList.querySelectorAll('[data-lib-check]').forEach(c=>c.addEventListener('change',()=>{const i=Number(c.dataset.libCheck); c.checked?selectedLibraryDelete.add(i):selectedLibraryDelete.delete(i); renderLibrary();}));
      els.libraryList.querySelectorAll('[data-lib-name]').forEach(inp=>inp.addEventListener('input',()=>{libraryDraft[Number(inp.dataset.libName)]=canonicalExerciseName(inp.value);libraryDirty=true;renderLibrarySaveOnly();}));
    } else {
      const query=normalExercise(els.customExerciseName.value).toLocaleLowerCase(currentLang);
      const filtered=exerciseLibrary.filter(name=>!query || displayExerciseName(name).toLocaleLowerCase(currentLang).includes(query));
      els.libraryList.innerHTML = filtered.map(name=>`<button type="button" class="exercise-select-row" data-choice="${esc(name)}"><span class="exercise-item-name">${esc(displayExerciseName(name))}</span>${icon('add')}</button>`).join('');
      els.libraryList.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>chooseExercise(b.dataset.choice)));
    }
    updateCustomAdd();
  }
  function renderLibrarySaveOnly(){ updateCustomAdd(); }
  function updateCustomAdd(){
    const has=!!normalExercise(els.customExerciseName.value);
    els.addCustomExerciseBtn.style.display=(!editMode&&has)?'inline-flex':'none';
    const enabled=editMode?(libraryDirty||has):false;
    els.saveLibraryBtn.disabled=!enabled;
    els.saveLibraryBtn.classList.toggle('disabled',!enabled);
  }
  function addCustomFromModal(){ const name=normalExercise(els.customExerciseName.value); if(name) chooseExercise(name); }
  function chooseExercise(name){ name=normalExercise(name); if(!name)return; if(!exerciseLibrary.includes(name)){exerciseLibrary.push(name); save(KEYS.library, exerciseLibrary);} if(modalTarget==='date-add') addDatePlanExercise(name); else if(modalTarget==='date-replace') replaceDatePlanExercise(modalSessionId,name); else if(modalTarget==='plan-add') addPlanExercise(name); else if(modalTarget==='plan-replace') replacePlanExercise(modalSessionId,name); else if(modalTarget==='train-add') addTrainExercise(name); else if(modalTarget==='train-replace') replaceTrainExercise(modalSessionId,name); }
  function removeExerciseNamesFromPlans(names){
    const removeSet = new Set([...names].map(normalExercise).filter(Boolean));
    if(!removeSet.size) return false;
    let changed = false;
    const keep = item => !removeSet.has(normalExercise(item && item.name));
    Object.keys(datePlans||{}).forEach(iso=>{
      const before = Array.isArray(datePlans[iso]) ? datePlans[iso] : [];
      const after = before.filter(keep);
      if(after.length !== before.length){
        changed = true;
        if(after.length){ datePlans[iso] = after; }
        else { delete datePlans[iso]; delete savedDatePlans[iso]; delete activeDatePlans[iso]; }
      }
    });
    DAYS.forEach(day=>{
      const before = Array.isArray(weekPlans[day]) ? weekPlans[day] : [];
      const after = before.filter(keep);
      if(after.length !== before.length){ weekPlans[day] = after; savedPlanDays[day] = false; changed = true; }
    });
    Object.keys(trainSessions||{}).forEach(iso=>{
      const before = Array.isArray(trainSessions[iso]) ? trainSessions[iso] : [];
      const after = before.filter(keep);
      if(after.length !== before.length){ trainSessions[iso] = after; changed = true; }
    });
    return changed;
  }
  function saveLibrary(){
    const custom=normalExercise(els.customExerciseName.value);
    if(!editMode){ if(custom) addCustomFromModal(); return; }
    if(custom){ libraryDraft.push(custom); els.customExerciseName.value=''; libraryDirty=true; }
    if(!libraryDirty)return;
    const newLibrary=[...new Set(libraryDraft.map(normalExercise).filter(Boolean))];
    const effectiveLibrary = newLibrary.length ? newLibrary : [...DEFAULT_LIBRARY];
    const deletedStillMissing = [...deletedLibraryNames].map(normalExercise).filter(name=>name && !effectiveLibrary.includes(name));
    exerciseLibrary=effectiveLibrary;
    const planChanged = removeExerciseNamesFromPlans(deletedStillMissing);
    saveAll();
    editMode=false;
    libraryDirty=false;
    selectedLibraryDelete.clear();
    deletedLibraryNames.clear();
    renderLibrary();
    renderAll();
    toast(planChanged ? t('exerciseRemovedPlan') : t('exerciseListSaved'));
  }
  function deleteCheckedLibrary(){
    if(!editMode || !selectedLibraryDelete.size)return;
    selectedLibraryDelete.forEach(i=>{ const name=normalExercise(libraryDraft[i]); if(name) deletedLibraryNames.add(name); });
    libraryDraft=libraryDraft.filter((_,i)=>!selectedLibraryDelete.has(i));
    selectedLibraryDelete.clear();
    libraryDirty=true;
    renderLibrary();
  }

  function hasPlanData(){
    return Object.keys(datePlans||{}).some(iso => (datePlans[iso]||[]).length>0) || DAYS.some(d => (weekPlans[d]||[]).length>0);
  }
  function renderExplanations(){
    const hasData=hasAnyData();
    const hasPlan=hasPlanData();
    const hasReport=Array.isArray(journal) && journal.length>0;
    const hasSelectedPlan=!!(planForSingleAction() && planForSingleAction().items && planForSingleAction().items.length);
    const hasOpenReport=!!ensureExpandedLogId();
    [['sharePlanBtn',!!(selectedPlanDate && hasDatePlan(selectedPlanDate))],['manageSavePlanBtn',hasPlan],['saveAllDataBtn',hasData],['deleteDataBtn',hasData]].forEach(([id,on])=>{
      const b=els[id]; if(!b)return; b.disabled=!on; b.classList.toggle('disabled',!on);
    });
  }
  function allDataPayload(){
    return {type:'easy-gym-backup',version:143,exportedAt:new Date().toISOString(),weekPlans,savedPlanDays,trainSessions,journal,exerciseLibrary,datePlans,savedDatePlans,activeDatePlans};
  }
  function sharedPlanSource(){
    const today=todayISO();
    const dateKeys=Object.keys(datePlans||{}).filter(iso=>Array.isArray(datePlans[iso])&&datePlans[iso].length).sort();
    let iso='';
    if(selectedPlanDate && Array.isArray(datePlans[selectedPlanDate]) && datePlans[selectedPlanDate].length) iso=selectedPlanDate;
    else if(Array.isArray(datePlans[today]) && datePlans[today].length) iso=today;
    else if(dateKeys.length){
      const todayNum=isoDayNumber(today);
      iso=dateKeys.slice().sort((a,b)=>Math.abs(isoDayNumber(a)-todayNum)-Math.abs(isoDayNumber(b)-todayNum) || a.localeCompare(b))[0];
    }
    if(iso) return {iso,items:datePlans[iso]};
    const todayDay=weekdayOf(today);
    if(Array.isArray(weekPlans[todayDay]) && weekPlans[todayDay].length) return {iso:today,items:weekPlans[todayDay]};
    const fallbackDay=DAYS.find(day=>Array.isArray(weekPlans[day])&&weekPlans[day].length);
    return fallbackDay ? {iso:today,items:weekPlans[fallbackDay]} : null;
  }
  function planPayload(){
    const source=sharedPlanSource();
    const sourceIso=source?.iso||todayISO();
    const sourceItems=source?JSON.parse(JSON.stringify(source.items||[])):[];
    const exportDatePlans=sourceItems.length?{[sourceIso]:sourceItems}:{};
    return {
      type:'easy-gym-plan',
      version:143,
      exportedAt:new Date().toISOString(),
      sourceDate:sourceIso,
      sharedPlan:sourceItems,
      weekPlans:emptyDays(),
      savedPlanDays:{},
      exerciseLibrary,
      datePlans:exportDatePlans,
      savedDatePlans:sourceItems.length?{[sourceIso]:true}:{},
      activeDatePlans:sourceItems.length?{[sourceIso]:true}:{}
    };
  }
  function reportPayload(){
    const openId=ensureExpandedLogId();
    return {type:'easy-gym-report',version:300,exportedAt:new Date().toISOString(),text:progressText('open'),journal:journal.filter(entry=>entry && entry.id===openId)};
  }
  function allPlansPayload(){
    return {type:'easy-gym-plans',version:300,exportedAt:new Date().toISOString(),weekPlans,savedPlanDays,datePlans,savedDatePlans,activeDatePlans,exerciseLibrary};
  }
  function allLogsPayload(){
    return {type:'easy-gym-logs',version:300,exportedAt:new Date().toISOString(),text:progressText('all'),journal};
  }
  function savePlanFile(){ downloadFile(`easy-gym-plan-${todayISO()}.json`,'application/json',JSON.stringify(planPayload(),null,2)); toast(t('planSaved')); }
  function saveReportFile(){ downloadFile(`easy-gym-report-${todayISO()}.txt`,'text/plain',progressText('open')||t('noReport')); toast(t('reportSaved')); }
  function saveAllPlansFile(){ downloadFile(`easy-gym-all-plans-${todayISO()}.json`,'application/json',JSON.stringify(allPlansPayload(),null,2)); toast(t('fileSaved')); }
  function saveAllLogsFile(){ downloadFile(`easy-gym-all-logs-${todayISO()}.json`,'application/json',JSON.stringify(allLogsPayload(),null,2)); toast(t('fileSaved')); }
  function saveAllDataFile(){ downloadFile(`easy-gym-backup-${todayISO()}.json`,'application/json',JSON.stringify(allDataPayload(),null,2)); backupReady=true; save(KEYS.backup,true); renderExplanations(); toast(t('allDataSaved')); }
  async function shareFile(name,mime,content){
    const canNativeShare=typeof navigator!=='undefined' && typeof navigator.share==='function';
    if(canNativeShare){
      try{
        let fileType=mime;
        let file=new File([content],name,{type:fileType});
        if(typeof navigator.canShare==='function' && !navigator.canShare({files:[file]}) && mime==='application/json'){
          fileType='text/plain';
          file=new File([content],name,{type:fileType});
        }
        const canShareFiles=typeof navigator.canShare!=='function' || navigator.canShare({files:[file]});
        if(canShareFiles){
          await navigator.share({files:[file],title:'Easy Gym',text:name});
          toast(t('shared'));
          return;
        }
        if(mime==='text/plain'){
          await navigator.share({title:'Easy Gym',text:content});
          toast(t('shared'));
          return;
        }
      }catch(e){
        if(e && e.name==='AbortError') return;
      }
    }
    downloadFile(name,mime,content);
    toast(t('fileSaved'));
  }
  async function sharePlan(){
    const content=JSON.stringify(planPayload(),null,2);
    if(typeof navigator==='undefined' || typeof navigator.share!=='function'){
      await showSharePlanUnsupported();
      return;
    }

    // iOS opens the native activity sheet directly when a shareable File is
    // passed from the original tap. Use the same plain-file route that already
    // works for Share LOG, while keeping the required .json filename.
    const planFile=new File([content],'Plan.json',{
      type:'text/plain',
      lastModified:Date.now()
    });

    try{
      // Do not navigate to a Blob URL, create a download link, or add a text
      // fallback. This call is intentionally the first asynchronous operation
      // so the browser retains the tap's transient user activation.
      await navigator.share({files:[planFile]});
      toast(t('shared'));
    }catch(error){
      if(error && error.name==='AbortError') return;
      console.error('Easy Gym: native Plan.json sharing could not be started.',error);
      await showSharePlanUnsupported();
    }
  }
  function base64UrlEncodeBytes(bytes){
    let bin='';
    for(let i=0;i<bytes.length;i+=0x8000){ bin+=String.fromCharCode(...bytes.subarray(i,i+0x8000)); }
    return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }
  function base64UrlDecodeBytes(str){
    const clean=String(str||'').replace(/-/g,'+').replace(/_/g,'/');
    const pad=clean.length%4 ? '='.repeat(4-clean.length%4) : '';
    const bin=atob(clean+pad);
    const bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
    return bytes;
  }
  function base64UrlEncodeUnicode(str){ return base64UrlEncodeBytes(new TextEncoder().encode(str)); }
  function base64UrlDecodeUnicode(str){ return new TextDecoder().decode(base64UrlDecodeBytes(str)); }
  function timeoutValue(promise, ms, fallback=null){
    let timer;
    return Promise.race([
      promise.finally(()=>clearTimeout(timer)),
      new Promise(resolve=>{ timer=setTimeout(()=>resolve(fallback),ms); })
    ]);
  }
  async function gzipBase64UrlEncode(str){
    if(typeof CompressionStream==='undefined') return null;
    try{
      const input=new Blob([new TextEncoder().encode(str)]).stream();
      const compressedStream=input.pipeThrough(new CompressionStream('gzip'));
      const buffer=await timeoutValue(new Response(compressedStream).arrayBuffer(),2500,null);
      if(!buffer) return null;
      return base64UrlEncodeBytes(new Uint8Array(buffer));
    }catch(e){
      return null;
    }
  }
  async function gzipBase64UrlDecode(str){
    if(typeof DecompressionStream==='undefined') throw new Error('compression not supported');
    const bytes=base64UrlDecodeBytes(str);
    const input=new Blob([bytes]).stream();
    const decompressedStream=input.pipeThrough(new DecompressionStream('gzip'));
    const buffer=await timeoutValue(new Response(decompressedStream).arrayBuffer(),3500,null);
    if(!buffer) throw new Error('compression timeout');
    return new TextDecoder().decode(buffer);
  }
  function isoDayNumber(iso){
    const parts=String(iso||'').split('-').map(Number);
    if(parts.length!==3 || parts.some(n=>!Number.isFinite(n))) return null;
    return Math.floor(Date.UTC(parts[0],parts[1]-1,parts[2])/86400000);
  }
  function isoFromDayNumber(num){ return new Date(num*86400000).toISOString().slice(0,10); }
  function compactValue(value){
    const s=String(value ?? 1).trim();
    if(/^-?\d+(?:\.\d+)?$/.test(s)){ const n=Number(s); if(Number.isFinite(n)) return n; }
    return s || 1;
  }
  function knownExerciseCode(name){
    const clean=String(name||'').trim();
    const canonical=canonicalExerciseName(clean);
    const idx=DEFAULT_LIBRARY.indexOf(canonical);
    return idx>=0 ? idx : null;
  }
  function ultraCompactPlanPayload(){
    const customNames=[];
    const customMap=new Map();
    const exerciseCode=name=>{
      const clean=String(name||'').trim();
      if(!clean) return null;
      const known=knownExerciseCode(clean);
      if(known!==null) return known;
      if(!customMap.has(clean)){ customMap.set(clean,customNames.length); customNames.push(clean); }
      return -(customMap.get(clean)+1);
    };
    const packList=list=>(Array.isArray(list)?list:[]).filter(item=>item&&item.name).map(item=>{
      const code=exerciseCode(item.name);
      if(code===null) return null;
      const sourceLines=(Array.isArray(item.lines)&&item.lines.length)?item.lines:[item];
      const flat=[];
      sourceLines.forEach(line=>{ flat.push(compactValue(line&&line.kg),compactValue(line&&line.reps),compactValue(line&&line.sets)); });
      return [code,flat];
    }).filter(row=>row&&row[1]&&row[1].length);
    const source=sharedPlanSource();
    const sourceIso=source?.iso||todayISO();
    const baseNum=isoDayNumber(sourceIso)||isoDayNumber(todayISO())||0;
    const packed=source?packList(source.items):[];
    const dateEntries=packed.length?[[0,packed]]:[];
    return ['egp5',baseNum,customNames,dateEntries,[]];
  }
  function expandUltraCompactPlanPayload(data){
    if(!Array.isArray(data)) return data;
    const version=data[0];
    if(version!=='egp5') return data;
    const baseNum=Number(data[1]||0);
    const names=Array.isArray(data[2])?data[2]:[];
    const nameFromCode=code=>{
      const n=Number(code);
      if(Number.isInteger(n) && n>=0 && DEFAULT_LIBRARY[n]) return DEFAULT_LIBRARY[n];
      if(Number.isInteger(n) && n<0) return String(names[-n-1]||'').trim();
      return '';
    };
    const makeList=rows=>(Array.isArray(rows)?rows:[]).map(row=>{
      const name=nameFromCode(row&&row[0]);
      if(!name) return null;
      const flat=Array.isArray(row&&row[1])?row[1]:[];
      const lines=[];
      for(let i=0;i<flat.length;i+=3){
        lines.push({id:uid(),kg:String(flat[i]!==undefined?flat[i]:1),reps:String(flat[i+1]!==undefined?flat[i+1]:1),sets:String(flat[i+2]!==undefined?flat[i+2]:1)});
      }
      if(!lines.length) lines.push({id:uid(),kg:'1',reps:'1',sets:'1'});
      const first=lines[0];
      return {id:uid(),name,kg:first.kg,reps:first.reps,sets:first.sets,lines};
    }).filter(Boolean);
    const expanded={type:'easy-gym-plan',version:143,weekPlans:emptyDays(),savedPlanDays:{},datePlans:{},savedDatePlans:{},activeDatePlans:{}};
    (Array.isArray(data[4])?data[4]:[]).forEach(entry=>{
      const idx=Number(entry&&entry[0]);
      const list=makeList(entry&&entry[1]);
      if(Number.isInteger(idx)&&DAYS[idx]&&list.length){ expanded.weekPlans[DAYS[idx]]=list; expanded.savedPlanDays[DAYS[idx]]=true; }
    });
    (Array.isArray(data[3])?data[3]:[]).forEach(entry=>{
      const offset=Number(entry&&entry[0]);
      const list=makeList(entry&&entry[1]);
      if(Number.isFinite(offset)&&list.length){ const iso=isoFromDayNumber(baseNum+offset); expanded.datePlans[iso]=list; expanded.savedDatePlans[iso]=true; expanded.activeDatePlans[iso]=true; }
    });
    return expanded;
  }
  function collectPlanExerciseNames(data){
    const names=[];
    const addList=list=>(Array.isArray(list)?list:[]).forEach(item=>{ if(item&&item.name) names.push(String(item.name)); });
    if(data&&data.weekPlans){ DAYS.forEach(day=>addList(data.weekPlans[day])); }
    if(data&&data.datePlans){ Object.keys(data.datePlans||{}).forEach(iso=>addList(data.datePlans[iso])); }
    return names;
  }
  let cachedPlanLink='';
  let cachedPlanLinkSignature='';
  let cachedPlanLinkPromise=null;
  function currentPlanLinkSignature(){
    try{ return JSON.stringify(ultraCompactPlanPayload()); }catch(e){ return ''; }
  }
  function cleanAppPath(){ return location.href.split('#')[0].split('?')[0].replace(/\/index\.html$/,'/'); }
  function planLinkBase(){ return APP_PLAN_LINK_BASE || cleanAppPath(); }
  async function buildPlanLinkFromSignature(signature){
    const encoded=await gzipBase64UrlEncode(signature);
    if(!encoded) throw new Error('PLAN_LINK_COMPRESSION_UNAVAILABLE');
    const link=`${planLinkBase()}?p5=${encoded}`;
    if(link.length > PLAN_LINK_MAX_LENGTH){
      const err=new Error('PLAN_LINK_TOO_LARGE');
      err.linkLength=link.length;
      throw err;
    }
    return link;
  }
  async function planShareLink(){
    const signature=currentPlanLinkSignature();
    if(cachedPlanLink && cachedPlanLinkSignature===signature) return cachedPlanLink;
    const link=await buildPlanLinkFromSignature(signature);
    cachedPlanLinkSignature=signature;
    cachedPlanLink=link;
    return link;
  }
  function preparePlanLinkCache(){
    if(!hasPlanData()) return;
    const signature=currentPlanLinkSignature();
    if(!signature || (cachedPlanLink && cachedPlanLinkSignature===signature) || cachedPlanLinkPromise) return;
    cachedPlanLinkPromise=buildPlanLinkFromSignature(signature)
      .then(link=>{ cachedPlanLinkSignature=signature; cachedPlanLink=link; return link; })
      .catch(err=>{ cachedPlanLink=''; cachedPlanLinkSignature=''; return null; })
      .finally(()=>{ cachedPlanLinkPromise=null; });
  }
  async function copyOrShowPlanLink(link){
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){
        await navigator.clipboard.writeText(link);
        toast(t('planLinkCopied'));
        return;
      }
    }catch(e){}
    try{
      const copied=window.prompt(t('copyPlanLinkPrompt'),link);
      if(copied!==null){ toast(t('planLinkReady')); return; }
    }catch(e){}
    downloadFile(`easy-gym-plan-link-${todayISO()}.txt`,'text/plain',link);
    toast(t('fileSaved'));
  }
  function shareReadyPlanLink(link){
    if(!link){ toast(t('planLinkTooLarge')); return; }
    if(navigator.share){
      try{
        navigator.share({title:'Easy Gym Plan',text:link})
          .then(()=>toast(t('shared')))
          .catch(()=>copyOrShowPlanLink(link));
        return;
      }catch(e){}
    }
    copyOrShowPlanLink(link);
  }
  async function sharePlanLink(){ return showAppStoreShareNotice(); }
  function planLinkParam(source,key){
    const re=new RegExp('[?#&]'+key+'=([^&#]+)');
    const m=String(source||'').match(re);
    return m ? decodeURIComponent(m[1]) : '';
  }
  async function processIncomingPlanLink(source, cleanUrl){
    const text=String(source||'');
    const p5=planLinkParam(text,'p5');
    if(!p5) return false;
    let data=null;
    try{
      data=JSON.parse(await gzipBase64UrlDecode(p5));
      data=expandUltraCompactPlanPayload(data);
    }catch(e){
      if(cleanUrl) history.replaceState(null,'',location.pathname);
      toast(t('importFailed'));
      return true;
    }
    const confirmed=await showEasyGymDialog({
      title:'',
      hideTitle:true,
      message:t('confirmInsertMessage'),
      confirmLabel:t('confirmInsertAction'),
      cancelLabel:t('dialogCancel'),
      tone:'gold'
    });
    if(confirmed){
      try{ importPlanData(data); }catch(e){ toast(t('insertFailed')); }
    }
    if(cleanUrl) history.replaceState(null,'',location.pathname);
    return true;
  }
  async function handleIncomingPlanLink(){
    const source=location.href;
    await processIncomingPlanLink(source,true);
  }
  window.easyGymHandlePlanLink=function(url){ return processIncomingPlanLink(url,false); };


  function planForSingleAction(){
    if(selectedPlanDate && Array.isArray(datePlans[selectedPlanDate]) && datePlans[selectedPlanDate].length){
      return {iso:selectedPlanDate,items:datePlans[selectedPlanDate]};
    }
    return sharedPlanSource();
  }
  function buildPrintPlanHtml(){
    const source=planForSingleAction();
    if(!source || !Array.isArray(source.items) || !source.items.length) return '';
    const e=esc;
    const rows=source.items.map((item,index)=>{
      const lines=ensureLines(item).map(line=>`<tr><td>${e(weightText(line.kg))} KG</td><td>${e(weightText(line.reps))}</td><td>${e(weightText(line.sets))}</td></tr>`).join('');
      return `<section class="eg-plan-exercise"><h2>${index+1}. ${e(displayExerciseName(item.name))}</h2><table><thead><tr><th>${e(t('kg'))}</th><th>${e(t('reps'))}</th><th>${e(t('sets'))}</th></tr></thead><tbody>${lines}</tbody></table></section>`;
    }).join('');
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(t('printPlan'))}</title><style>@page{size:A4 portrait;margin:14mm}*{box-sizing:border-box}body{margin:0;color:#1c1c1e;font-family:Arial,Helvetica,sans-serif}.eg-plan{max-width:800px;margin:0 auto}.eg-head{display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #1c1c1e;padding-bottom:10px;margin-bottom:20px}.eg-brand{font-size:22px;font-weight:800}.eg-date{font-size:16px;font-weight:700}.eg-plan-exercise{margin:0 0 24px;break-inside:avoid}.eg-plan-exercise h2{font-size:18px;margin:0 0 8px}table{width:100%;border-collapse:collapse;table-layout:fixed}th,td{padding:8px 12px;border-bottom:1px solid #e5e5ea;text-align:center}th{font-size:11px;color:#8e8e93;text-transform:uppercase;letter-spacing:.5px}td{font-size:16px}</style></head><body><main class="eg-plan"><header class="eg-head"><span class="eg-brand">EASY GYM · PLAN</span><span class="eg-date">${e(dateDisplay(source.iso))}</span></header>${rows}</main></body></html>`;
  }
  function executePrintPlan(){
    const html=buildPrintPlanHtml();
    if(!html){ toast(t('savePlanFirst')); return; }
    try{
      const handler=window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.printLog;
      if(handler){ handler.postMessage({html,jobName:`Easy Gym - ${t('printPlan')}`}); return; }
      printReportInBrowser(html);
    }catch(error){ console.error(error); toast(t('printFailed')); }
  }
  function buildPrintReportHtml(){
    const groups=progressGroups();
    if(!groups.length) return '';
    const L=reportLayoutLabels();
    const e=esc;
    const summaryTable=g=>`<table class="eg-summary"><colgroup><col><col><col><col></colgroup><thead><tr><th>${e(L.date)}</th><th>${e(L.start)}</th><th>${e(L.duration)}</th><th>${e(L.totalVolume)}</th></tr></thead><tbody><tr><td>${e(g.date)}</td><td>${e(g.startTime)}</td><td>${e(g.duration)}</td><td>${e(reportFormatVolume(g.totalWeight))} KG</td></tr></tbody></table>`;
    const exerciseTable=(ex,idx)=>{
      const rows=ex.rows.map(r=>{
        const info=reportStatusDisplay(reportRowStatus(r),L);
        return `<tr><td>${e(reportPair(r.pKg,r.dKg,'KG'))}</td><td>${e(reportPair(r.pReps,r.dReps))}</td><td>${e(reportPair(r.pSets,r.dSets))}</td><td class="eg-status ${info.kind==='miss'?'miss':'hit'}">${e(info.text)}</td></tr>`;
      }).join('');
      return `<section class="eg-exercise"><div class="eg-exercise-heading"><h2>${idx+1}. ${e(displayExerciseName(ex.name))}</h2><div class="eg-records"><span>${e(t('everMax'))}: <strong>${e(ex.everMax)} KG</strong></span><span>·</span><span>${e(t('maxToday'))}: <strong>${e(ex.todayMax)} KG</strong></span><span class="eg-note">${e(L.formatNote)}</span></div></div><table class="eg-data"><colgroup><col><col><col><col></colgroup><thead><tr><th>${e(L.weight)}</th><th>${e(L.reps)}</th><th>${e(L.sets)}</th><th></th></tr></thead><tbody>${rows}</tbody></table></section>`;
    };
    const sessions=groups.map(g=>`<section class="eg-session">${summaryTable(g)}${g.exercises.map(exerciseTable).join('')}</section>`).join('');
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(L.reportTitle)}</title><style>
      @page{size:A4 portrait;margin:14mm}
      *{box-sizing:border-box}
      html,body{margin:0;padding:0;background:#fff;color:#1c1c1e;font-family:Arial,Helvetica,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
      .eg-report{width:100%;max-width:800px;margin:0 auto}
      .eg-brand{width:100%;border-collapse:collapse;border-bottom:2px solid #1c1c1e;margin-bottom:22px}
      .eg-brand td{padding:0 0 10px;vertical-align:middle}
      .eg-brand-left{width:72%}.eg-brand-right{width:28%;text-align:right;font-size:13px;font-weight:700;letter-spacing:.8px;color:#636366}
      .eg-logo{width:28px;height:28px;vertical-align:middle;margin-right:8px}.eg-name{font-size:20px;font-weight:800;vertical-align:middle}.eg-copy{font-size:10px;color:#8e8e93;margin-left:10px;vertical-align:middle}
      table{width:100%;border-collapse:collapse;table-layout:fixed}
      thead{display:table-header-group}tr{page-break-inside:avoid;break-inside:avoid}
      .eg-session{page-break-before:auto}.eg-session+.eg-session{margin-top:28px}
      .eg-summary{margin-bottom:26px}.eg-summary th{font-size:10px;color:#8e8e93;text-transform:uppercase;letter-spacing:.5px;text-align:left;padding:0 6px 4px;border-bottom:1px solid #e5e5ea}.eg-summary td{font-size:16px;font-weight:700;padding:6px 6px 0}.eg-summary th:last-child,.eg-summary td:last-child{text-align:right}
      .eg-exercise{margin-bottom:24px;page-break-inside:auto;break-inside:auto}.eg-exercise-heading{page-break-after:avoid;break-after:avoid}.eg-exercise h2{font-size:18px;margin:0 0 4px}.eg-records{font-size:12px;color:#636366;margin-bottom:8px;white-space:normal}.eg-records span{margin-right:7px}.eg-records strong{color:#1c1c1e}.eg-note{float:right;font-size:10px;color:#8e8e93;font-style:italic}
      .eg-data th,.eg-data td{width:25%;padding:8px 10px;border-bottom:1px solid #f2f2f7;font-size:13px;text-align:right;vertical-align:middle}.eg-data th{font-size:10px;color:#8e8e93;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid #e5e5ea}.eg-data th:first-child,.eg-data td:first-child{text-align:left}.eg-status{font-size:16px!important;font-weight:800!important}.eg-status.hit{color:#248a3d}.eg-status.miss{color:#d70015}
      @media print{.eg-report{max-width:none}.eg-note{float:right}}
    </style></head><body><main class="eg-report"><table class="eg-brand"><tr><td class="eg-brand-left"><img class="eg-logo" src="${REPORT_LOGO_DATA}" alt="G"><span class="eg-name">EASY GYM</span><span class="eg-copy">© 2026 Arthur Stivenson</span></td><td class="eg-brand-right">${e(String(L.reportTitle).toUpperCase())}</td></tr></table>${sessions}</main></body></html>`;
  }
  function printReportInBrowser(html){
    const frame=document.createElement('iframe');
    frame.setAttribute('aria-hidden','true');
    frame.style.position='fixed'; frame.style.right='0'; frame.style.bottom='0'; frame.style.width='0'; frame.style.height='0'; frame.style.border='0';
    frame.onload=()=>{ setTimeout(()=>{ try{ frame.contentWindow.focus(); frame.contentWindow.print(); }catch(error){ console.error(error); toast(t('printFailed')); } setTimeout(()=>frame.remove(),1500); },180); };
    frame.srcdoc=html;
    document.body.appendChild(frame);
  }
  function executeNativePrintExport(){
    const html=buildPrintReportHtml();
    if(!html){ toast(t('noSavedReport')); return; }
    try{
      const handler=window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.printLog;
      if(handler){ handler.postMessage({html,jobName:`Easy Gym - ${reportLayoutLabels().reportTitle}`}); return; }
      printReportInBrowser(html);
    }catch(error){ console.error(error); toast(t('printFailed')); }
  }

  function shareReport(){ shareFile(`easy-gym-report-${todayISO()}.txt`,'text/plain',progressText('open')||t('noReport')); }
  function readJsonFile(file, done, failMsg){
    const reader=new FileReader();
    reader.onload=()=>{ try{ done(JSON.parse(reader.result)); }catch(e){ toast(failMsg||t('importFailed')); } };
    reader.readAsText(file);
  }
  function importedSharedPlanItems(data){
    if(!data || typeof data!=='object') return [];
    if(Array.isArray(data.sharedPlan) && data.sharedPlan.length) return data.sharedPlan;
    const importedDates=(data.datePlans&&typeof data.datePlans==='object'&&!Array.isArray(data.datePlans))?data.datePlans:{};
    const sourceDate=String(data.sourceDate||'').slice(0,10);
    if(sourceDate && Array.isArray(importedDates[sourceDate]) && importedDates[sourceDate].length) return importedDates[sourceDate];
    const exportedDate=String(data.exportedAt||'').slice(0,10);
    if(exportedDate && Array.isArray(importedDates[exportedDate]) && importedDates[exportedDate].length) return importedDates[exportedDate];
    const dateKeys=Object.keys(importedDates).filter(iso=>Array.isArray(importedDates[iso])&&importedDates[iso].length).sort();
    if(dateKeys.length){
      const ref=isoDayNumber(sourceDate||exportedDate||todayISO());
      const best=dateKeys.slice().sort((a,b)=>Math.abs(isoDayNumber(a)-ref)-Math.abs(isoDayNumber(b)-ref) || b.localeCompare(a))[0];
      return importedDates[best];
    }
    const importedWeek=(data.weekPlans&&typeof data.weekPlans==='object'&&!Array.isArray(data.weekPlans))?data.weekPlans:{};
    const sourceDay=sourceDate?weekdayOf(sourceDate):weekdayOf(todayISO());
    if(Array.isArray(importedWeek[sourceDay]) && importedWeek[sourceDay].length) return importedWeek[sourceDay];
    const fallbackDay=DAYS.find(day=>Array.isArray(importedWeek[day])&&importedWeek[day].length);
    return fallbackDay?importedWeek[fallbackDay]:[];
  }
  function importPlanData(data){
    if(!data || typeof data!=='object') throw new Error('invalid plan');
    const imported=clonePlanForCopy(importedSharedPlanItems(data));
    if(!imported.length) throw new Error('empty plan');
    const targetIso=todayISO();
    datePlans[targetIso]=imported;
    savedDatePlans[targetIso]=true;
    activeDatePlans[targetIso]=true;
    const importedPlanNames=imported.map(item=>normalExercise(item.name)).filter(Boolean);
    if(Array.isArray(data.exerciseLibrary)){
      data.exerciseLibrary.forEach(name=>{ const clean=normalExercise(name); if(clean&&!exerciseLibrary.includes(clean)) exerciseLibrary.push(clean); });
    }
    importedPlanNames.forEach(name=>{ if(name&&!exerciseLibrary.includes(name)) exerciseLibrary.push(name); });
    delete trainStartTimes[targetIso];
    seedTrainFromDate(targetIso);
    selectedPlanDate=targetIso;
    selectedTrainDate=targetIso;
    selectedPlanDay=null;
    selectedTrainDay=null;
    savedWorkout=null;
    copiedPlan=null;
    saveAll();
    renderAll();
    toast(t('planInserted'));
  }
  async function insertPlanFile(e){
    const file=e.target.files&&e.target.files[0]; if(!file)return;
    const confirmed=await showEasyGymDialog({
      title:'',
      hideTitle:true,
      message:t('confirmInsertMessage'),
      confirmLabel:t('confirmInsertAction'),
      cancelLabel:t('dialogCancel'),
      tone:'gold'
    });
    if(!confirmed){ e.target.value=''; return; }
    readJsonFile(file, data=>{
      try{ importPlanData(data); }catch(err){ toast(t('insertFailed')); }
      e.target.value='';
    },t('insertFailed'));
  }
  async function restoreAllDataFile(e){
    const file=e.target.files&&e.target.files[0]; if(!file)return;
    const confirmed=await showEasyGymDialog({
      title:t('confirmRestoreTitle'),
      message:t('confirmRestoreMessage'),
      confirmLabel:t('confirmRestoreAction'),
      cancelLabel:t('dialogCancel'),
      tone:'gold'
    });
    if(!confirmed){ e.target.value=''; return; }
    readJsonFile(file, data=>{
      weekPlans=data.weekPlans||emptyDays();
      savedPlanDays=data.savedPlanDays||{};
      trainSessions=data.trainSessions||emptyDays();
      journal=Array.isArray(data.journal)?data.journal:[];
      exerciseLibrary=Array.isArray(data.exerciseLibrary)?data.exerciseLibrary:DEFAULT_LIBRARY;
      datePlans=(data.datePlans&&typeof data.datePlans==='object'&&!Array.isArray(data.datePlans))?data.datePlans:{};
      savedDatePlans=(data.savedDatePlans&&typeof data.savedDatePlans==='object'&&!Array.isArray(data.savedDatePlans))?data.savedDatePlans:{};
      activeDatePlans=(data.activeDatePlans&&typeof data.activeDatePlans==='object'&&!Array.isArray(data.activeDatePlans))?data.activeDatePlans:{};
      trainStartTimes={}; backupReady=true; selectedPlanDate=null; selectedTrainDate=null; selectedPlanDay=null; selectedTrainDay=null; savedWorkout=null;
      normalizeData(); expandedLogId=(journal[0]&&journal[0].id)||null; renderAll(); toast(t('dataRestored')); e.target.value='';
    },t('restoreFailed'));
  }
  async function deleteAllData(){
    const confirmed=await showEasyGymDialog({
      title:'',
      hideTitle:true,
      message:t('confirmDeleteMessage'),
      confirmLabel:t('confirmDeleteAction'),
      cancelLabel:t('dialogCancel'),
      tone:'danger'
    });
    if(!confirmed)return;
    [...Object.keys(localStorage)].forEach(k=>{if(k.startsWith(PACKAGE_PREFIX))localStorage.removeItem(k);});
    weekPlans=emptyDays(); trainSessions=emptyDays(); savedPlanDays={}; journal=[]; exerciseLibrary=[...DEFAULT_LIBRARY]; trainStartTimes={}; datePlans={}; savedDatePlans={}; activeDatePlans={}; backupReady=false; selectedPlanDay=null; selectedTrainDay=null; selectedPlanDate=null; selectedTrainDate=null; savedWorkout=null; expandedLogId=null;
    saveAll(); renderAll(); toast(t('dataDeleted'));
  }

  async function boot(){
    try{
      await (window.EASY_GYM_LANGUAGE_READY || Promise.resolve());
      loadLanguagePacks();
      init();
    }catch(e){
      console.error(e);
      document.body.innerHTML = '<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;padding:24px;line-height:1.4"><h1>Easy Gym</h1><p>Language files could not be loaded. Please reinstall/update the app package.</p></div>';
    }
  }
  window.addEventListener('DOMContentLoaded', boot);
})();
