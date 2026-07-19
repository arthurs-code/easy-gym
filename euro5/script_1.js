(() => {
  'use strict';
  const DAYS = ['mon','tue','wed','thu','fri','sat','sun'];
  const DAY_SHORT = {mon:'Mon',tue:'Tue',wed:'Wed',thu:'Thu',fri:'Fri',sat:'Sat',sun:'Sun'};
  const DEFAULT_LIBRARY = ['Snatch','Clean and Jerk','Clean','Jerk','Power Snatch','Power Clean','Back Squat','Front Squat','Overhead Squat','Deadlift','Bench Press','Push Press','Strict Press','Barbell Row','Pull-up','Dip','Lunge','Romanian Deadlift'];
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
  const LANG_PACK_VERSION = 'v223-language-packages';
  const EMBEDDED_LANGUAGE_PACKS = {"en":{"code":"en","ui":{"langName":"English","days":{"mon":"Mon","tue":"Tue","wed":"Wed","thu":"Thu","fri":"Fri","sat":"Sat","sun":"Sun"},"months":["January","February","March","April","May","June","July","August","September","October","November","December"],"plan":"PLAN","do":"GO","report":"LOG","manage":"mgmt","donate":"heart","about":"info","selectDay":"Select the Day","addExercise":"EXERCISE","remove":"del","copy":"Copy","copied":"Copied","paste":"Paste","saveTraining":"Save training","saved":"Saved","startTraining":"Start Training","started":"Started","stopSaveTraining":"Stop and Save Training","done":"Done","activateTraining":"Activate Training","plannedNotTrained":"Planned · not trained","noTrainingDay":"No training on this day.","tapAddExercise":"Tap “+ EXERCISE” to build this day’s training.","noSavedPlan":"No saved plan for this day.","noCompletedExercises":"No completed exercises.","chooseExercise":"Choose exercise","editExercises":"Edit exercises","save":"Save","modalSave":"SAVE","delete":"del","writeOwnExercise":"Write your own exercise","kg":"KG","reps":"Reps","sets":"Sets","download":"Download","word":"Word","pdf":"PDF","noSavedReport":"No saved LOG yet.","noReport":"No LOG","date":"Date","startTime":"Start Time","duration":"Duration","total":"Total","exercise":"Exercise","everMax":"Ever Max","maxToday":"Max Today","sharePlan":"Share Plan","sharePlanLink":"Share Plan as Link","directLinkComingSoon":"PLAN-Link ready.","planLinkReady":"Plan link ready","planLinkCopied":"Plan link copied","planLinkTooLarge":"Plan too large for link - use Share Plan file","savePlanFirst":"Save a plan first","creatingPlanLink":"Creating plan link","copyPlanLinkPrompt":"Copy this plan link","savePlan":"Save Plan","insertPlan":"Insert Plan","saveReport":"Save LOG","shareReport":"Share LOG","saveAllData":"Backup","restoreAllData":"Restore","deleteData":"Delete Data","supportTitle":"Support Easy Gym","supportIntro":"Easy Gym is free and ad-free. If it helps your training, a small donation keeps it growing — thank you.","confirmInsert":"Insert will override Plans - confirm","confirmRestore":"Restore will replace All Data - confirm","confirmDelete":"Delete will erase All Data - confirm","theme":"Theme","themeToast":"Theme: ","planSaved":"Plan saved","reportSaved":"LOG saved","allDataSaved":"All data saved","shared":"Shared","fileSaved":"File saved","planInserted":"Plan inserted","dataRestored":"Data restored","dataDeleted":"Data deleted","insertFailed":"Insert failed","restoreFailed":"Restore failed","importFailed":"Import failed","trainingSaved":"Training saved","exerciseRemovedPlan":"Exercise removed from Plan","exerciseListSaved":"Exercise list saved","addFirst":"Add exercises to today’s training first","resumeTraining":"Resume training","noExercisesYet":"No exercises yet. Tap “+ EXERCISE” to build today’s training.","noTrainingPlanned":"No training planned for this day. Create it in Plan first.","reportHeader":"Exercise / P-KG / D-KG / P-Reps / D-Reps / P-Sets / D-Sets","aboutHtml":"<div class=\"card about-card\"><h2>Easy Gym — Plan, Go, Log</h2><p>A free, ad-free training tracker for serious training. Build your PLAN, start your workout in GO, and keep every result in LOG — all on your phone.</p></div><div class=\"card about-card\"><h2>Preface</h2><p>I created Easy Gym for my own training. It is free and has no ads. Like it? Support me with a donation. Want your own app? Write to: arthur.stivenson@gmail.com.</p></div><div class=\"card about-card\"><h2>PLAN</h2><p>Create a plan for any date. Use <strong>+ EXERCISE</strong> to add exercises with kg, reps, and sets. Use <strong>DEL</strong> to remove exercises. Save the plan when it is ready.</p></div><div class=\"card about-card\"><h2>GO</h2><p>Start from a saved PLAN. You can adjust kg, reps, and sets during the workout or add another <strong>+ EXERCISE</strong>. Your original PLAN stays unchanged for next time.</p></div><div class=\"card about-card\"><h2>LOG</h2><p>Compare planned targets with actual results. Completed sets are marked green. Save or share your final training log.</p></div><div class=\"card about-card\"><h2>MGMT &amp; share</h2><p><strong>Share Plan as Link</strong> — Plan-Link will be available in Easy Gym from App Store.</p><p><strong>Share Plan File or LOG</strong> — When you share a file, we create a secure link you can send via WhatsApp or other messengers.</p><p><strong>Save File or LOG</strong> — saves it locally.</p><p><strong>Insert Plan File</strong> — imports a received plan file into Easy Gym.</p></div><div class=\"card about-card\"><h2>Backup</h2><p>Backup saves a full copy. Restore recovers your data. Delete Data wipes everything after confirmation.</p></div><div class=\"card about-card\"><h2>Privacy</h2><p>Easy Gym works on your phone. Your plans and logs stay on your device unless you share them.</p></div>"},"exercises":{}}};
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
  const PACKAGE_PREFIX = 'easyGym.enDeFrItEs.appStore.';
  const KEYS = {
    week:PACKAGE_PREFIX+'weekPlans.v1', train:PACKAGE_PREFIX+'trainSessions.v1', saved:PACKAGE_PREFIX+'savedPlans.v1', journal:PACKAGE_PREFIX+'journal.v1',
    library:PACKAGE_PREFIX+'exerciseLibrary.v1', start:PACKAGE_PREFIX+'trainStartTimes.v1', backup:PACKAGE_PREFIX+'backupReady.v1', theme:PACKAGE_PREFIX+'theme.v1',
    datePlans:PACKAGE_PREFIX+'datePlans.v1', savedDatePlans:PACKAGE_PREFIX+'savedDatePlans.v1', activeDatePlans:PACKAGE_PREFIX+'activeDatePlans.v1', lang:PACKAGE_PREFIX+'lang.v1'
  };
  const LEGACY_KEYS = [];
  const DEV_BUILD = 'v209-5lang-pwa-embedded-plan-activate-row';
  const DEV_BUILD_KEY = PACKAGE_PREFIX+'devBuild.v1';
  // Development mode: whenever the build version changes, remove all app data
  // from localStorage so test plans/progress do not survive into the next change.
  // The visual theme is preserved because it is a UI preference, not workout data.
  try{
    const previousBuild = localStorage.getItem(DEV_BUILD_KEY);
    if(previousBuild !== DEV_BUILD){
      const theme = localStorage.getItem(KEYS.theme);
      let langPref = localStorage.getItem(KEYS.lang);
      try{ langPref = JSON.parse(langPref); }catch(e){}
      for(let i = localStorage.length - 1; i >= 0; i--){
        const k = localStorage.key(i);
        if(k && k.startsWith(PACKAGE_PREFIX)){ localStorage.removeItem(k); }
      }
      if(theme === 'light' || theme === 'dark'){ localStorage.setItem(KEYS.theme, theme); }
      if(LANGS.includes(langPref)){ localStorage.setItem(KEYS.lang, JSON.stringify(langPref)); }
      localStorage.setItem(DEV_BUILD_KEY, DEV_BUILD);
    }
  }catch(e){}
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
  let currentLang = load(KEYS.lang, 'en');
  const $ = (id) => document.getElementById(id);
  const els = {};
  function cacheEls(){ ['planDayButtons','planChooseHint','planActionRow','savePlanRow','trainDayButtons','planList','trainList','planTitle','trainControls','savePlanBtn','removeSelectedBtn','copyPlanBtn','activatePlanBtn','saveTrainingBtn','startTrainingBtn','timerText','addExerciseModal','libraryList','customExerciseName','addCustomExerciseBtn','editExercisesBtn','saveLibraryBtn','deleteLibraryBtn','customRow','exerciseModalHelp','journalList','downloadWordBtn','downloadPdfBtn','sharePlanBtn','sharePlanLinkBtn','manageSavePlanBtn','insertPlanBtn','insertPlanInput','manageSaveReportBtn','shareReportBtn','saveAllDataBtn','restoreAllDataBtn','restoreAllDataInput','deleteDataBtn','toast','homeTodayCard','homeStartBtn','homeGreeting','aboutContent','languageSelect','languageSwitch','languageMenu'].forEach(id=>els[id]=$(id)); }
  function uid(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4)}
  function emptyDays(){return Object.fromEntries(DAYS.map(d=>[d,[]]));}
  function load(key, fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function save(key, val){localStorage.setItem(key, JSON.stringify(val));}
  function saveAll(){save(KEYS.week, weekPlans);save(KEYS.train, trainSessions);save(KEYS.saved, savedPlanDays);save(KEYS.journal, journal);save(KEYS.library, exerciseLibrary);save(KEYS.start, trainStartTimes);save(KEYS.backup, backupReady);save(KEYS.datePlans, datePlans);save(KEYS.savedDatePlans, savedDatePlans);save(KEYS.activeDatePlans, activeDatePlans);}
  function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function t(key){ return (I18N[currentLang]&&I18N[currentLang][key]) || I18N.en[key] || key; }
  function dayShort(day){ return ((I18N[currentLang]&&I18N[currentLang].days)||I18N.en.days)[day] || day; }
  function monthName(i){ return ((I18N[currentLang]&&I18N[currentLang].months)||I18N.en.months)[i] || ''; }
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
  function completedListHtml(entry){ const rows=[]; (entry.exercises||[]).forEach(ex=>(ex.sets||[]).forEach(s=>rows.push({name:ex.name,sets:s.sets,kg:s.kg,reps:s.reps}))); return `<ul class="home-plan-list">`+rows.map(r=>`<li><span class="hp-name">${esc(displayExerciseName(r.name))}</span><span class="hp-meta">${esc(numVal(r.sets))}&nbsp;×&nbsp;${esc(numVal(r.kg))}&nbsp;kg&nbsp;×&nbsp;${esc(numVal(r.reps))}</span></li>`).join('')+`</ul>`; }
  function readOnlyMetricBox(label,value){ return `<label class="metric-wrap disabled"><span class="metric-label-top">${esc(label)}</span><span class="metric-input-box disabled"><input type="text" value="${esc(numVal(value))}" readonly disabled></span></label>`; }
  function completedExerciseCardsHtml(entry){
    const exercises=(entry?.exercises||[]).map(ex=>({name:normalExercise(ex.name)||'Exercise', sets:(ex.sets||[]).filter(s=>isPositive(s.sets)&&isPositive(s.kg)&&isPositive(s.reps))})).filter(ex=>ex.sets.length);
    if(!exercises.length)return `<div class="empty">${esc(t('noCompletedExercises'))}</div>`;
    return exercises.map((ex,i)=>`<div class="exercise-card completed-exercise-card">
      <div class="exercise-top"><div class="exercise-number">${i+1}.</div>
      <div class="name-box disabled"><input value="${esc(displayExerciseName(ex.name))}" readonly disabled></div></div>
      ${ex.sets.map(s=>`<div class="metric-line"><div class="metric-row">
        ${readOnlyMetricBox(t('kg'), s.kg)}
        ${readOnlyMetricBox(t('reps'), s.reps)}
        ${readOnlyMetricBox(t('sets'), s.sets)}
      </div></div>`).join('')}
    </div>`).join('');
  }
  function readOnlyPlanExerciseCardsHtml(plan){
    const exercises=(plan||[]).map(item=>({name:normalExercise(item.name)||'Exercise', lines:ensureLines(item).filter(line=>isPositive(line.sets)&&isPositive(line.kg)&&isPositive(line.reps))})).filter(ex=>ex.lines.length);
    if(!exercises.length)return `<div class="empty">${esc(t('noSavedPlan'))}</div>`;
    return exercises.map((ex,i)=>`<div class="exercise-card completed-exercise-card saved-plan-card">
      <div class="exercise-top"><div class="exercise-number">${i+1}.</div>
      <div class="name-box disabled"><input value="${esc(displayExerciseName(ex.name))}" readonly disabled></div></div>
      ${ex.lines.map(line=>`<div class="metric-line"><div class="metric-row">
        ${readOnlyMetricBox(t('kg'), line.kg)}
        ${readOnlyMetricBox(t('reps'), line.reps)}
        ${readOnlyMetricBox(t('sets'), line.sets)}
      </div></div>`).join('')}
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
    const iconOnly=el.dataset.tab==='donate'||el.dataset.tab==='about';
    el.classList.toggle('nav-icon-only',iconOnly);
    el.classList.toggle('nav-text-only',!iconOnly);
    el.innerHTML=iconOnly?icon(iconName):textOnlyButtonHtml(text);
    el.setAttribute('aria-label',text);
    el.title=text;
  }
  function setIconText(id,key,iconName){ const el=$(id); if(el) setButtonLabel(el,iconName,t(key)); }
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
  function applyLanguageUi(){
    currentLang=normalizeLang(currentLang);
    document.documentElement.lang=currentLang;
    if(els.languageSelect){ els.languageSelect.value=currentLang; els.languageSelect.textContent=currentLang.toUpperCase(); els.languageSelect.setAttribute('aria-expanded','false'); }
    if(els.languageSwitch) els.languageSwitch.classList.remove('open');
    document.querySelectorAll('[data-lang-option]').forEach(b=>{ const active=b.dataset.langOption===currentLang; b.classList.toggle('active',active); b.hidden=active; b.setAttribute('aria-selected', active?'true':'false'); });
    const navKeys={plan:'plan',train:'do',progress:'report',explanations:'manage',donate:'donate',about:'about'};
    document.querySelectorAll('[data-tab]').forEach(b=>{ const k=navKeys[b.dataset.tab]; if(k) setNavButtonLabel(b,TAB_ICONS[b.dataset.tab]||'about',t(k)); });
    setText('planChooseHint','selectDay'); setIconText('addExerciseBtn','addExercise','add'); setIconText('removeSelectedBtn','remove','remove');
    setIconText('downloadWordBtn','word','word'); setIconText('downloadPdfBtn','pdf','pdf');
    setIconText('sharePlanBtn','sharePlan','share'); setIconText('sharePlanLinkBtn','sharePlanLink','share'); setIconText('manageSavePlanBtn','savePlan','save'); setIconText('insertPlanBtn','insertPlan','insert'); setIconText('manageSaveReportBtn','saveReport','save'); setIconText('shareReportBtn','shareReport','share'); setIconText('saveAllDataBtn','saveAllData','save'); setIconText('restoreAllDataBtn','restoreAllData','restore'); setIconText('deleteDataBtn','deleteData','delete');
    const donateTitle=document.querySelector('#donate .donate-intro h2'); if(donateTitle) donateTitle.textContent=t('supportTitle');
    const donateIntro=document.querySelector('#donate .donate-intro p'); if(donateIntro) donateIntro.textContent=t('supportIntro');
    setText('modalTitle','chooseExercise'); setIconText('editExercisesBtn','editExercises','edit'); setIconText('saveLibraryBtn','modalSave','save'); setIconText('deleteLibraryBtn','delete','delete');
    setIconText('homeStartBtn','startTraining','start');
    const custom=$('customExerciseName'); if(custom) custom.placeholder=t('writeOwnExercise');
    const close=$('closeModalBtn'); if(close) close.setAttribute('aria-label','Close');
    if(els.aboutContent) els.aboutContent.innerHTML=t('aboutHtml');
  }
  function changeLanguage(lang){ currentLang=normalizeLang(lang); save(KEYS.lang,currentLang); renderAll(); }

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
    $('closeModalBtn').addEventListener('click', closeExerciseModal);
    $('addExerciseBtn').addEventListener('click',()=>{ if(selectedPlanDate) openExerciseModal('date-add'); });
    els.removeSelectedBtn.addEventListener('click', removeSelectedDatePlan);
    if(els.copyPlanBtn) els.copyPlanBtn.addEventListener('click', handlePlanCopyPaste);
    els.savePlanBtn.addEventListener('click', ()=>saveCurrentDatePlan());
    if(els.startTrainingBtn) els.startTrainingBtn.addEventListener('click', startTraining);
    els.saveTrainingBtn.addEventListener('click', saveTraining);
    els.editExercisesBtn.addEventListener('click',()=>{editMode=true;libraryDraft=[...exerciseLibrary];libraryDirty=false;selectedLibraryDelete.clear();renderLibrary();});
    els.saveLibraryBtn.addEventListener('click', saveLibrary);
    els.deleteLibraryBtn.addEventListener('click', deleteCheckedLibrary);
    els.customExerciseName.addEventListener('input',()=>updateCustomAdd());
    els.addCustomExerciseBtn.addEventListener('click',()=>addCustomFromModal());
    els.customExerciseName.addEventListener('keydown',e=>{if(e.key==='Enter'){ if(editMode) saveLibrary(); else addCustomFromModal(); }});
    els.downloadWordBtn.addEventListener('click', downloadWord);
    els.downloadPdfBtn.addEventListener('click', downloadPdf);
    els.sharePlanBtn.addEventListener('click', sharePlan);
    if(els.sharePlanLinkBtn) els.sharePlanLinkBtn.addEventListener('click', sharePlanLink);
    els.manageSavePlanBtn.addEventListener('click', savePlanFile);
    els.insertPlanBtn.addEventListener('click',()=>els.insertPlanInput.click());
    els.insertPlanInput.addEventListener('change', insertPlanFile);
    els.manageSaveReportBtn.addEventListener('click', saveReportFile);
    els.shareReportBtn.addEventListener('click', shareReport);
    els.saveAllDataBtn.addEventListener('click', saveAllDataFile);
    els.restoreAllDataBtn.addEventListener('click',()=>els.restoreAllDataInput.click());
    els.restoreAllDataInput.addEventListener('change', restoreAllDataFile);
    els.deleteDataBtn.addEventListener('click', deleteAllData);
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
    container.querySelectorAll('[data-plan-line-check]').forEach(cb=>cb.addEventListener('change',()=>{
      const row=cb.closest('.metric-line');
      if(row) row.classList.toggle('line-selected', cb.checked);
    }));
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

  function tickLiveTimer(){
    const live=$('liveTimer');
    const iso=selectedTrainDate;
    if(live && iso && trainStartTimes[iso]){
      live.textContent = formatDuration(Date.now() - Number(trainStartTimes[iso]));
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
  function stripSets(){ return { trained:new Set((journal||[]).map(e=>e.date).filter(iso=>!activeDatePlans[iso])), planned:new Set(Object.keys(datePlans||{}).filter(iso=>hasDatePlan(iso))) }; }
  function centerStrip(el, dataAttr, iso){ const b=el.querySelector('['+dataAttr+'="'+iso+'"]'); if(b){ el.scrollLeft = b.offsetLeft - el.clientWidth/2 + b.offsetWidth/2; } }
  function buildDateStrip(el, selectedIso, dataAttr){
    const today=todayISO(); const sets=stripSets();
    const sig=[currentLang, today, [...sets.trained].sort().join(','), [...sets.planned].sort().join(',')].join('|');
    if(el.dataset.sig!==sig){
      const prev = el.children.length ? el.scrollLeft : null;
      const N=365; const base=new Date(); base.setHours(0,0,0,0);
      let html='';
      for(let off=-N; off<=N; off++){
        const dt=new Date(base.getFullYear(),base.getMonth(),base.getDate()+off); const iso=isoOf(dt);
        const trained=sets.trained.has(iso); const planned=sets.planned.has(iso);
        const cls=['day-link','with-date',iso===today?'is-today':'',trained?'trained':(planned?'planned':'')].filter(Boolean).join(' ');
        const ddmmyy=`${String(dt.getDate()).padStart(2,'0')}.${String(dt.getMonth()+1).padStart(2,'0')}.${String(dt.getFullYear()).slice(2)}`;
        html+=`<button class="${cls}" ${dataAttr}="${iso}"><span class="dl-day">${dayShort(DAYS[(dt.getDay()+6)%7]).toUpperCase()}</span><span class="dl-date">${ddmmyy}</span></button>`;
      }
      el.innerHTML=html; el.dataset.sig=sig;
      if(prev!=null) el.scrollLeft=prev;
    }
    const centerIso=selectedIso||today; if(el.clientWidth>0 && el.children.length && !el.dataset.initialCentered){ centerStrip(el, dataAttr, centerIso); el.dataset.initialCentered='1'; }
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
      els.planList.innerHTML='';
      updatePlanCopyState();
      updatePlanActivateState(null);
      return;
    }

    // PLAN controls stay visible for every selected day. App logic only enables/disables them.
    els.planActionRow.style.display='';
    els.savePlanRow.style.display='flex';
    const setDisabled=(btn,disabled)=>{ if(!btn)return; btn.disabled=!!disabled; btn.classList.toggle('disabled',!!disabled); };
    const today=todayISO(); const done=journalForDate(iso); const isPast = iso<today;
    updatePlanActivateState(iso);

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

    if(isPast && !activeDatePlans[iso]){
      // Past date, never trained — read-only, but controls remain visible and disabled.
      setDisabled($('addExerciseBtn'), true);
      setDisabled(els.removeSelectedBtn, true);
      updatePlanCopyState();
      setButtonLabel(els.savePlanBtn,'save',t('saveTraining'));
      els.savePlanBtn.disabled = true;
      els.savePlanBtn.classList.remove('saved');
      els.savePlanBtn.classList.add('disabled');
      const plan=datePlans[iso]||[];
      els.planList.innerHTML = plan.length ? planListHtml(plan) : `<div class="empty">${esc(t('noTrainingDay'))}</div>`;
      return;
    }

    // Today or future — editable plan for this exact date.
    setDisabled($('addExerciseBtn'), false);
    const list=datePlans[iso]||[]; const saved=hasDatePlan(iso);
    updatePlanCopyState();
    setButtonLabel(els.savePlanBtn, saved?'copied':'save', saved ? t('saved') : t('saveTraining'));
    els.savePlanBtn.disabled = saved || !isDatePlanValid(iso);
    els.savePlanBtn.classList.toggle('saved', saved);
    els.savePlanBtn.classList.toggle('disabled', !saved && els.savePlanBtn.disabled);
    els.planList.innerHTML = list.length ? list.map((item,i)=>exerciseCard(item,i,'plan')).join('') : `<div class="empty">${esc(t('tapAddExercise'))}</div>`;
    wireDateCards(iso, els.planList);
    els.planList.querySelectorAll('[data-remove-check],[data-plan-line-check]').forEach(cb=>cb.addEventListener('change',updatePlanRemoveState));
    updatePlanRemoveState();
  }
  function exerciseCard(item,i,mode){
    const disabled = mode==='train' && savedWorkout?.date===selectedTrainDate;
    const showPlus = mode==='train' && !disabled;
    if(mode==='plan'){
      const lines=ensureLines(item);
      return `<div class="exercise-card" data-card-id="${esc(item.id)}">
        <div class="exercise-top plan-top"><div class="exercise-number">${i+1}.</div>
        <div class="name-box" data-plan-name="${esc(item.id)}"><input value="${esc(displayExerciseName(item.name)||'')}" placeholder="${esc(t('chooseExercise'))}" readonly></div>
        <button class="plus plan-line-plus" type="button" data-plan-line-plus="${esc(item.id)}" aria-label="Add KG Reps Sets line">+</button>
        <input class="check" type="checkbox" data-remove-check value="${esc(item.id)}" aria-label="${esc(t('remove'))}"></div>
        ${lines.map((line,idx)=>`<div class="metric-line">
          <div class="metric-row ${idx>0?'with-line-check':''}">
            ${metricBox(t('kg'), line.kg, mode, item, 'kg', false, line.id)}
            ${metricBox(t('reps'), line.reps, mode, item, 'reps', false, line.id)}
            ${metricBox(t('sets'), line.sets, mode, item, 'sets', false, line.id)}
            ${idx>0?`<label class="line-select-wrap"><input class="check line-select" type="checkbox" data-plan-line-check="${esc(item.id)}" data-line-id="${esc(line.id)}" aria-label="Select line for remove"></label>`:''}
          </div>
        </div>`).join('')}
      </div>`;
    }
    const checkbox = showPlus?`<button class="plus" data-train-plus>+</button>`:'';
    const nameClick = disabled?'':`data-train-name="${esc(item.sessionId)}"`;
    return `<div class="exercise-card" data-card-id="${esc(item.sessionId)}">
      <div class="exercise-top"><div class="exercise-number">${i+1}.</div>
      <div class="name-box ${disabled?'disabled':''}" ${nameClick}><input value="${esc(displayExerciseName(item.name)||'')}" placeholder="${esc(t('chooseExercise'))}" readonly ${disabled?'disabled':''}></div>${checkbox}</div>
      <div class="metric-row">
        ${metricBox(t('kg'), item.kg, mode, item, 'kg', disabled)}
        ${metricBox(t('reps'), item.reps, mode, item, 'reps', disabled)}
        ${metricBox(t('sets'), item.sets, mode, item, 'sets', disabled)}
      </div>
      ${mode==='train'?setButtons(item,disabled):''}
    </div>`;
  }
  function metricBox(label,value,mode,item,field,disabled,lineId=null){const id=mode==='plan'?item.id:item.sessionId;return `<label class="metric-wrap ${disabled?'disabled':''}"><span class="metric-label-top">${label}</span><span class="metric-input-box ${disabled?'disabled':''}"><input inputmode="numeric" pattern="[0-9]*" type="text" value="${esc(numVal(value))}" data-metric-mode="${mode}" data-metric-id="${esc(id)}" ${lineId?`data-line-id="${esc(lineId)}"`:''} data-field="${field}" ${disabled?'disabled':''}></span></label>`;}
  function setButtons(item,disabled){ const total=Math.max(0,Math.floor(Number(item.sets)||0)); if(!total) return ''; const checked=Number(item.checked||0); let html='<div class="set-buttons">'; for(let n=1;n<=total;n++){html+=`<button class="set-btn ${checked>=n?'checked':''}" data-set-n="${n}" ${disabled?'disabled':''}>${n}</button>`;} return html+'</div>'; }
  function trainGroupKey(it){ return it.exerciseId?('exercise:'+it.exerciseId):('manual:'+(it.manualGroupId||it.sessionId)); }
  function trainGroups(list){ const out=[]; (list||[]).forEach(it=>{ const key=trainGroupKey(it); let g=out.find(x=>x.key===key); if(!g){ g={key,first:it,items:[]}; out.push(g); } g.items.push(it); }); return out; }
  function isDoAddedItem(item){ return !!(item && item.trainAdded); }
  function isDoAddedGroup(group){ return !!(group && Array.isArray(group.items) && group.items.length && group.items.every(isDoAddedItem)); }
  function trainGroupCard(group,i){
    const disabled = savedWorkout?.date===selectedTrainDate;
    const showPlus = !disabled;
    const first = group.first || group.items[0];
    const canDeleteGroup = !disabled && isDoAddedGroup(group);
    return `<div class="exercise-card train-group-card" data-train-group="${esc(group.key)}">
      <div class="exercise-top train-top"><div class="exercise-number">${i+1}.</div>
      <div class="name-box ${disabled?'disabled':''}" ${disabled?'':`data-train-name="${esc(first.sessionId)}"`}><input value="${esc(displayExerciseName(first.name)||'')}" placeholder="${esc(t('chooseExercise'))}" readonly ${disabled?'disabled':''}></div>
      ${showPlus?`<button class="plus train-line-plus" data-train-plus data-train-plus-session="${esc(first.sessionId)}" aria-label="Add KG Reps Sets line">+</button>`:'<span></span>'}
      ${canDeleteGroup?`<input class="check" type="checkbox" data-train-group-check="${esc(group.key)}" aria-label="${esc(t('remove'))}">`:'<span></span>'}</div>
      ${group.items.map((item,idx)=>{
        const canDeleteLine = idx>0 && !disabled && isDoAddedItem(item);
        return `<div class="train-metric-line metric-line" data-card-id="${esc(item.sessionId)}">
        <div class="metric-row ${canDeleteLine?'with-line-check':''}">
          ${metricBox(t('kg'), item.kg, 'train', item, 'kg', disabled)}
          ${metricBox(t('reps'), item.reps, 'train', item, 'reps', disabled)}
          ${metricBox(t('sets'), item.sets, 'train', item, 'sets', disabled)}
          ${canDeleteLine?`<label class="line-select-wrap"><input class="check line-select" type="checkbox" data-train-line-check="${esc(item.sessionId)}" aria-label="Select line for remove"></label>`:''}
        </div>
        ${setButtons(item,disabled)}
      </div>`}).join('')}
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
    els.trainControls.classList.remove('done-state','saved-state');
    els.trainControls.style.display = iso ? '' : 'none';

    const trainControlsHtml=({open=false, locked=false, hasList=false, activate=false}={})=>{
      const addDisabled = locked || !hasList;
      const removeDisabled = true;
      const startDisabled = locked || open || !hasList;
      const startLabel = activate ? t('activateTraining') : (open ? t('started') : t('startTraining'));
      const startIcon = open ? 'copied' : 'start';
      return `<button class="action small ${addDisabled?'disabled':''}" id="addTrainExerciseBtn" type="button" ${addDisabled?'disabled':''}>${buttonHtml('add',t('addExercise'))}</button>`+
        `<button class="action small ${startDisabled && !activate?'disabled':''}" id="startInlineBtn" type="button" ${startDisabled && !activate?'disabled':''}>${buttonHtml(startIcon,startLabel)}</button>`+
        `<span class="timer" id="liveTimer">${open?formatDuration(Date.now()-Number(trainStartTimes[iso])):''}</span>`+
        `<button class="action danger small disabled train-remove-end" id="removeTrainSelectedBtn" type="button" disabled>${buttonHtml('remove',t('remove'))}</button>`;
    };

    if(!iso){
      els.trainControls.innerHTML='';
      els.trainList.innerHTML=`<div class="empty">${esc(t('selectDay'))}</div>`;
      setTrainSaveState();
      return;
    }

    const open=!!trainStartTimes[iso]; const finished=savedWorkout?.date===iso; const done=journalForDate(iso);
    if(done && !activeDatePlans[iso] && !open && !finished){
      els.trainControls.classList.add('saved-state');
      els.trainControls.style.display='';
      els.trainControls.innerHTML=trainControlsHtml({locked:true, hasList:true, activate:false});
      els.trainList.innerHTML=completedExerciseCardsHtml(done);
      placeSaveTrainingButtonInline('saved');
      setTrainSaveState();
      return;
    }
    if(finished){
      els.trainControls.classList.add('saved-state');
      els.trainControls.style.display='';
      els.trainControls.innerHTML=trainControlsHtml({locked:true, hasList:true, activate:false});
      els.trainList.innerHTML=completedExerciseCardsHtml(done);
      placeSaveTrainingButtonInline('saved');
      setTrainSaveState();
      return;
    }

    if(!open && !finished && !(trainSessions[iso]||[]).length && isDatePlanValid(iso)){ seedTrainFromDate(iso); saveAll(); }
    const list=trainSessions[iso]||[];
    if(!list.length){
      els.trainControls.style.display='';
      els.trainControls.innerHTML=trainControlsHtml({open:false, locked:false, hasList:false});
      els.trainList.innerHTML=`<div class="empty">${esc(t('noTrainingPlanned'))}</div>`;
      setTrainSaveState();
      return;
    }

    els.trainControls.innerHTML=trainControlsHtml({open, locked:false, hasList:true});
    placeSaveTrainingButtonInline('open');
    const addBtn=$('addTrainExerciseBtn'); if(addBtn) addBtn.addEventListener('click',()=>openExerciseModal('train-add'));
    const startBtn=$('startInlineBtn'); if(startBtn) startBtn.addEventListener('click', startTraining);
    const removeBtn=$('removeTrainSelectedBtn'); if(removeBtn) removeBtn.addEventListener('click', removeSelectedTrain);
    els.trainList.innerHTML = trainGroups(list).map((g,i)=>trainGroupCard(g,i)).join('');
    wireTrainCards();
    updateTrainRemoveState(); setTrainSaveState();
  }
  function wireTrainCards(){
    els.trainList.querySelectorAll('[data-train-name]').forEach(box=>box.addEventListener('click',()=>openExerciseModal('train-replace', box.dataset.trainName)));
    els.trainList.querySelectorAll('[data-train-plus]').forEach(btn=>btn.addEventListener('click',()=>addTrainLine(btn.dataset.trainPlusSession)));
    els.trainList.querySelectorAll('[data-train-group-check]').forEach(cb=>cb.addEventListener('change',updateTrainRemoveState));
    els.trainList.querySelectorAll('[data-train-line-check]').forEach(cb=>cb.addEventListener('change',()=>{ const row=cb.closest('.metric-line'); if(row) row.classList.toggle('line-selected', cb.checked); updateTrainRemoveState(); }));
    els.trainList.querySelectorAll('[data-metric-mode="train"]').forEach(inp=>{
      inp.addEventListener('input',()=>{
        const it=findTrain(inp.dataset.metricId); if(!it||isTrainLocked())return;
        const cleaned=cleanMetricText(inp.value); if(inp.value!==cleaned) inp.value=cleaned;
        it[inp.dataset.field]=cleaned;
        if(inp.dataset.field==='sets' && Number(it.checked)>Number(cleaned)) it.checked=Number(cleaned)||0;
        saveAll();
        setTrainSaveState();
      });
      inp.addEventListener('blur',()=>renderTrain());
    });
    els.trainList.querySelectorAll('[data-set-n]').forEach(btn=>btn.addEventListener('click',()=>{if(isTrainLocked())return; const card=btn.closest('[data-card-id]'); const it=findTrain(card.dataset.cardId); if(!it)return; const n=Number(btn.dataset.setN); it.checked = Number(it.checked)>=n ? n-1 : n; if(it.trainAdded && it.checked>0){it.addedStarted=true;} saveAll(); renderTrain();}));
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
  function updateTrainRemoveState(){
    const btn=$('removeTrainSelectedBtn');
    if(!btn)return;
    const any=!!els.trainList.querySelector('[data-train-group-check]:checked,[data-train-line-check]:checked');
    btn.disabled=!any || isTrainLocked();
    btn.classList.toggle('disabled',btn.disabled);
  }
  function removeSelectedTrain(){
    const iso=selectedTrainDate; if(!iso||isTrainLocked())return;
    const list=trainSessions[iso]||[];
    const groupIds=new Set([...els.trainList.querySelectorAll('[data-train-group-check]:checked')].map(x=>x.dataset.trainGroupCheck));
    const lineIds=new Set([...els.trainList.querySelectorAll('[data-train-line-check]:checked')].map(x=>x.dataset.trainLineCheck));
    if(!groupIds.size && !lineIds.size)return;
    const groupDeleteAllowed=new Map();
    groupIds.forEach(key=>{
      const items=list.filter(item=>trainGroupKey(item)===key);
      groupDeleteAllowed.set(key, !!items.length && items.every(isDoAddedItem));
    });
    trainSessions[iso]=list.filter(item=>{
      const key=trainGroupKey(item);
      if(groupIds.has(key) && groupDeleteAllowed.get(key))return false;
      if(lineIds.has(item.sessionId) && isDoAddedItem(item))return false;
      return true;
    });
    saveAll(); renderTrain();
  }
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
    if(row) row.style.display=visible?'flex':'none';
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
    journal.unshift({id:uid(),date:iso,day:weekdayOf(iso),startedAt:new Date(start).toISOString(),endedAt:new Date(end).toISOString(),durationMs:end-start,plannedExercises,exercises});
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
        group.sets.push({sets:checked,kg:Number(it.kg),reps:Number(it.reps),planned:planned?{kg:planned.kg,reps:planned.reps,sets:planned.sets}:null});
      }
    }
    return out.map(({_key,...x})=>x);
  }
  function reportCell(v){ return v===''||v===null||v===undefined ? '-' : String(v); }
  function renderProgress(){
    const groups = progressGroups();
    const hasProgress = journal.length>0;
    const actions=$('progressActions');
    if(actions) actions.classList.toggle('is-hidden', !hasProgress);
    els.downloadWordBtn.disabled=!hasProgress;
    els.downloadPdfBtn.disabled=!hasProgress;
    if(!hasProgress){els.journalList.innerHTML=`<div class="empty">${esc(t('noSavedReport'))}</div>`;return;}
    els.journalList.innerHTML = groups.map(g=>`<div class="card"><table class="progress-table progress-table-v91"><colgroup><col class="exercise-col"><col class="num plan-num"><col class="num done-num"><col class="num plan-num"><col class="num done-num"><col class="num plan-num"><col class="num done-num"></colgroup><tbody><tr class="workout-row"><td colspan="7"><span class="pg-meta"><span class="pg-cell"><span class="pg-k">${esc(t('date'))}</span> ${esc(g.date)}</span><span class="pg-cell"><span class="pg-k">${esc(t('startTime'))}</span> ${esc(g.startTime)}</span><span class="pg-cell"><span class="pg-k">${esc(t('duration'))}</span> ${esc(g.duration)}</span><span class="pg-cell"><span class="pg-k">${esc(t('total'))}</span> ${esc(g.totalWeight)} kg</span></span></td></tr><tr><th>${esc(t('exercise'))}</th><th class="num plan-head">P-KG</th><th class="num done-head">D-KG</th><th class="num plan-head">P-${esc(t('reps'))}</th><th class="num done-head">D-${esc(t('reps'))}</th><th class="num plan-head">P-${esc(t('sets'))}</th><th class="num done-head">D-${esc(t('sets'))}</th></tr>${g.exercises.map(ex=>`<tr class="exercise-summary-row"><td colspan="7"><div class="exercise-summary-line"><span class="progress-ex-name">${esc(displayExerciseName(ex.name))}</span><span class="progress-stat"><span class="pg-k">${esc(t('everMax'))}</span>${esc(ex.everMax)} kg</span><span class="progress-stat"><span class="pg-k">${esc(t('maxToday'))}</span>${esc(ex.todayMax)} kg</span></div></td></tr>${ex.rows.map(r=>`<tr class="set-row"><td>&nbsp;</td><td class="num plan-val">${esc(reportCell(r.pKg))}</td><td class="num done-val">${esc(reportCell(r.dKg))}</td><td class="num plan-val">${esc(reportCell(r.pReps))}</td><td class="num done-val">${esc(reportCell(r.dReps))}</td><td class="num plan-val">${esc(reportCell(r.pSets))}</td><td class="num done-val">${esc(reportCell(r.dSets))}</td></tr>`).join('')}`).join('')}</tbody></table></div>`).join('');
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
    const n=Number(planned[field])||0;
    return n>0 ? weightText(n) : '';
  }
  function progressGroups(){
    const everMax=exerciseEverMaxMap();
    return journal.map(entry=>{
      const byName=[]; let totalWeight=0;
      (entry.exercises||[]).forEach(ex=>{
        const name=normalExercise(ex.name)||'Exercise';
        let group=byName.find(item=>item.name===name);
        if(!group){ group={name,rows:[],todayMax:0,everMax:everMax[name]||0}; byName.push(group); }
        (ex.sets||[]).forEach(s=>{
          const sets=Number(s.sets)||0, kg=Number(s.kg)||0, reps=Number(s.reps)||0;
          if(!(sets>0 && kg>0 && reps>0)) return;
          totalWeight+=sets*kg*reps;
          group.todayMax=Math.max(group.todayMax,kg);
          group.everMax=Math.max(group.everMax,kg);
          const planned=s.planned||null;
          group.rows.push({
            pKg:plannedValueText(planned,'kg'), dKg:weightText(kg),
            pReps:plannedValueText(planned,'reps'), dReps:weightText(reps),
            pSets:plannedValueText(planned,'sets'), dSets:weightText(sets)
          });
        });
      });
      const exercises=byName.filter(ex=>ex.rows.length).map(ex=>({
        name:ex.name,
        everMax:weightText(ex.everMax),
        todayMax:weightText(ex.todayMax),
        rows:ex.rows
      }));
      return {date:dateDisplay(entry.date), startTime:formatStartTime(entry.startedAt), duration:formatDuration(entry.durationMs), totalWeight:weightText(totalWeight), exercises};
    });
  }
  function progressText(){
    return progressGroups().map(g=>{
      const lines=g.exercises.map(ex=>{
        const setLines=ex.rows.map(r=>`    ${reportCell(r.pKg)} / ${reportCell(r.dKg)} / ${reportCell(r.pReps)} / ${reportCell(r.dReps)} / ${reportCell(r.pSets)} / ${reportCell(r.dSets)}`).join('\n');
        return `  ${displayExerciseName(ex.name)}: ${t('everMax')} ${ex.everMax} kg, ${t('maxToday')} ${ex.todayMax} kg\n${setLines}`;
      }).join('\n');
      return `${g.date} - ${t('startTime')}: ${g.startTime} - ${t('duration')}: ${g.duration} - ${t('total')}: ${g.totalWeight} kg\n${t('reportHeader')}\n${lines}`;
    }).join('\n\n');
  }
  function reportLayoutLabels(){
    const byLang={
      en:{date:'Date',start:'Start Time',duration:'Duration',totalVolume:'Total Volume',weight:'Weight (Done / Plan)',reps:'Reps (Done / Plan)',sets:'Sets (Done / Plan)',status:'Performance Status',targetHit:'Target Hit',underWeight:'Under planned weight',underReps:'Under planned reps',underSets:'Under planned sets',overTarget:'Above plan',logged:'Logged'},
      de:{date:'Datum',start:'Startzeit',duration:'Dauer',totalVolume:'Total Volumen',weight:'Gewicht (Gemacht / Plan)',reps:'Wdh. (Gemacht / Plan)',sets:'Sätze (Gemacht / Plan)',status:'Status',targetHit:'Ziel erreicht',underWeight:'Unter geplantem Gewicht',underReps:'Unter geplanten Wdh.',underSets:'Unter geplanten Sätzen',overTarget:'Über Plan',logged:'Erfasst'},
      fr:{date:'Date',start:'Heure de début',duration:'Durée',totalVolume:'Volume total',weight:'Poids (Fait / Plan)',reps:'Rép. (Fait / Plan)',sets:'Séries (Fait / Plan)',status:'Statut',targetHit:'Objectif atteint',underWeight:'Poids sous le plan',underReps:'Rép. sous le plan',underSets:'Séries sous le plan',overTarget:'Au-dessus du plan',logged:'Enregistré'},
      it:{date:'Data',start:'Ora inizio',duration:'Durata',totalVolume:'Volume totale',weight:'Peso (Fatto / Plan)',reps:'Rip. (Fatto / Plan)',sets:'Serie (Fatto / Plan)',status:'Stato',targetHit:'Obiettivo raggiunto',underWeight:'Peso sotto il plan',underReps:'Rip. sotto il plan',underSets:'Serie sotto il plan',overTarget:'Sopra il plan',logged:'Registrato'},
      es:{date:'Fecha',start:'Hora inicio',duration:'Duración',totalVolume:'Volumen total',weight:'Peso (Hecho / Plan)',reps:'Reps (Hecho / Plan)',sets:'Series (Hecho / Plan)',status:'Estado',targetHit:'Objetivo alcanzado',underWeight:'Peso por debajo del plan',underReps:'Reps por debajo del plan',underSets:'Series por debajo del plan',overTarget:'Por encima del plan',logged:'Registrado'}
    };
    return byLang[currentLang] || byLang.en;
  }
  function reportDownloadHeaders(){
    const L=reportLayoutLabels();
    return [L.weight,L.reps,L.sets,L.status];
  }
  function reportNum(v){
    if(v===''||v===null||v===undefined) return null;
    const n=parseFloat(String(v).replace(',', '.').replace(/[^0-9.\-]/g,''));
    return Number.isFinite(n)?n:null;
  }
  function reportPair(done,planned,suffix=''){
    const d=reportCell(done), p=reportCell(planned);
    const unit=suffix && (d!=='-' || p!=='-') ? ' '+suffix : '';
    return `${d} / ${p}${unit}`;
  }
  function reportRowStatus(r){
    const L=reportLayoutLabels();
    const pKg=reportNum(r.pKg), dKg=reportNum(r.dKg), pReps=reportNum(r.pReps), dReps=reportNum(r.dReps), pSets=reportNum(r.pSets), dSets=reportNum(r.dSets);
    if(pKg===null && pReps===null && pSets===null) return L.logged;
    if(pKg!==null && dKg!==null && dKg<pKg) return '⚠️ '+L.underWeight;
    if(pReps!==null && dReps!==null && dReps<pReps) return '⚠️ '+L.underReps;
    if(pSets!==null && dSets!==null && dSets<pSets) return '⚠️ '+L.underSets;
    if((pKg!==null&&dKg!==null&&dKg>pKg)||(pReps!==null&&dReps!==null&&dReps>pReps)||(pSets!==null&&dSets!==null&&dSets>pSets)) return L.overTarget;
    return L.targetHit;
  }
  const MAX_EVER_ICON_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAoCAYAAAB0HkOaAAAHNElEQVR4nK2YS4wcRxmAv6rqx+zMPuLH2rF5JMYGZxVxIhzsSMRKDoED8oEDAUEIcCASQgoIJHLIgQhxJSISEAk4gYWM4ITEKwIiI0eRIDjEwTYOGMWvZP3YeD0z29Nd9f8cqmdnZ3dmd23yz5a6u6q6/q//V3WvUVXGycKvvqMs/gdjFdtyuCkwk4qdsNimYnLFNMAmYFLAKmBAAVHEA94iPUULUNlFPve0GacvGUsCVFfOYRZOgTO4VoZ0Umwri20qxTZz7FQKrQyXZ5jGYDnteSgqQruHdCqkXUK4CnPj9dn1YJyrraagGo+oWXWMg2sNbOKfMZh4soG2jYZNH6ZWKIqqRMVSEwYFAUJAw2C+iqICWv/6D7WeDLmpvHRcy0vHAQjdJXx7PtIqUaFqhBCplQVUHOoFLRVcAFdbrBIIUkP3AZfgzacV64ESsv1wx+fNEIx053Xx+FNUV0/GBxDwXQtdsPVUFVlhhfrcK1opWgU0sdHOSYRRL2iQaK1QP0R1A64fA5dCYwr0Clz5qzL9OOQfNBag/fIzyyB9rwQPyIrAF0EDaO0OrQIaBHxAK0FLj/YCUsSmZUC9QKURSrS2VABfwNIi9DogJSz+KMaMdOe1d+GFZZ3ZnR9m++FfMDl3GFE3APS1W7zWT11DVFGxlAEpKrTwaM8jZYiAVUB9GLjsPd+GDxyFxr01TAXWQ3lGbTn/8lAQ5Xd/FDe522x54OvGuAZKbR2JbsHHWNBK0VJqqwS0b41e3QqP9iRap+9OUpg5aEi3G2YejiC+inGxdBxrs+khGH/97OCiMTuUsupXWKPfyhqm9GgRkMIjfZCy767aOmaFruJsHdwhwri7SLLdB41t7lDpzgPQPvlzircu69SHPgc00ZBAUg1cVT8liaAuINZgURCHJoJxdU0JOoitXrQgNoPeeeXCD6H9EqQpGAeSwOSDxqgq5aXjuvjit5Cqje8aqralKlLM4lZyd4M072JtNJHJHbaRYiaSeMxdbJmLIC4WOe2XgFLr4PZgHVN7wJgibh15DlOzMPkRmHksZlO2+6C549B3yXbch0rMpFAEqiWoqhwJ6XLBGrindk2tSIvoJl2qs6nwdVb5GOCVYEIPxINYcDm09sHUJ2DmMQNgVm+UN185ogsv/ZL2hWvQ3UZiLI1Gm7zRwboQrZNaTCPF9q2SJpjUgLMYG7cBpK5NPgax9ALZtKX57gQmt2G2HIBdXxraNNfA9OXikSf07ZNnobOVrNGJQHkXs8JdJksiUGohdRHEGQwsbxmxBChaBibf3yK7+z7Y89TInXssTF9Ofu1RtRrI8g6NvEuWL4ERjDWYzGKyJFoqsTFm+pZZhlG0EpKZBtOP/Hrs6wNsuI/Cni8/SVU1KYsmRdGiV0wSfBY3wTLEeOnFo/TqelM3qfshofWx5zZStTFMa++cufPhhyj9NL3eJEtFi2KpiS8nCFVCKAQtKqSGkhpK+gVQc1qHvombede6VoENXq76svPjjxgV9NLv/owER8hSQujhkpI0KRHvMWXAJBJLgAHUoEmTqQe/Qb7/0IYgsImYWSndf5/Scz/5MeW1RZKsIEkqXFJhrcfagDWCMYpJc7Ld+9h2+CukO967KZBbhlkJdfFnzyBLbxOqlCQVsi2Cy5R8205mHnqCfPf7Ng3Rl025abU0986ZHQd2qn/zNbKZlMauGZLZ7ZgkQbkLcxsgtw0zJCqo91AWaLCoznNbJP8PTFi8FFl8QLpdJNNYa5INE3Ss3NadN154Vqsrp5evpewhnTZadtDiAnL6q7ceiLcD89bRJ/Xm346uHRAPIQAG0/sX8tqjtwy0aZjy6ht64bnHtXv2L+MnicSmgg3XkVc/pXrzlU1DjUzt337v+/rq888jIuvefGtVQdm6a5atO7Yxu3c/D3zxC2vifGQAn/zTH0lsTprlsOIDbLXuAcxoKl19X+Uw1nH9jXMj54+EkcrTam0lTSLMmkXHwOjgdASMYnBIUJJsJMtamN8/+wO1NsFZN7JezN3bY6IJxgLGoA6MM/G6/wph4dplw+snhldQr4RKYAJe/OkRPfCZTw9NWANz8cwZEpdirVs9xD372tx/0ENi45dj3cyK8/5YUMPrJ4bXkCD4IsA0LM6/tWb9NdnUub6ANaOtkufrB/RKcenaPlXwPU/wQtFe3Bim1+3gXDL4eHuHxZeCeEWCXx/mH7/5g1ZliRkTL8XS5pWGanSGiQjBB6yDy6fPDE0aipn//v0EzjmsHb1lnT7b4p+nquXrtaldfyECuAQzYhnxSlUEGpNw5tgxdt2zfzTM1fPncTbFjYExzuHcin8GbCa1V4mK4ouAeKW7sDA0NqR1cX4eZ1KMJkOK3qk605eqUCQIZbc9HqbbvkkzmaXqWFiOmvEwq2U1TL9zNQxi8SUkq7JzCOb+T36W1DXJsolb2nd07MWgc2W3MQaTVLhkGOZ/lgSVsfx5SoYAAAAASUVORK5CYII=';
  const MAX_TODAY_ICON_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAoCAYAAACfKfiZAAAH+0lEQVR4nJ2YXahtVRXHf2PO9bH3Pufce86xvNfrtWsqkR+J0ZtaIZRICNF9KQuJIiGKeuhJehTqISgfCrSosA8p1L4pjOghMyOiIIwyjSS1q+m9nq+99/qac4we5trn7N25V69nwmCuvVh7/f/jP/5zzLWWmBkHHfXHbrf4/AaDS47g7/2GHOQe7qDg7Z13WHPmNM1WRXz8n4QPnDxQJgcmECYv05kR1FA15D+niR95/2smcSAC8Y+/segNVYgYUQzzCs+dQj/+wddE4kAEmh9/DUEJoUNRYqaYd5g37Jln0TvvOG8SB1PANYRW0RAwieBBc8W8YLlhTz0BX/3ceZF4zQTGd33UBNAqosHAA85DZtiMRAb66C/hZ996VRLnJGCfOGnx5C0Wbr3F9OGfG0B85BdmOsY6JUynKB3iDJdZAvVAYZCDZWAP3w9/fewVSWRnBf/0SWM1J1aKnaqI99yNy4PVv30AzAiTQJx2YIY4sDKimeC89TNJGWvhobvhmuvPXwG974tGJpB72qYjeIGLDqPf/jr4gEUlTitCjOAVXxhWgGWG5gIZWAHkltSYvgT3ffacKuwvwZ8fRUYlXd1Q1xXxcE5czrFlATNi1dKOa5QIJViuBK9obrtBDlaC5b0STz4Gv3vorCQWCMQvfMYYZFguTLa2GVuHFo7y2Q3aoyWhC0w3JrTNlJgZkhs2jMQZaEE/G+SSwD3gDR75zqsrYKdPwTCnrRu2tzdRL/j1ZaZXLKEozXhCO54SxIi+w/JIzIzoItFbkr8vg2SGZAbOQIB6Ex68a58KuwTCg/daHAiqxtbGy0xjTbEywrwSS083bqi3ptRdRRAj5Mb6VUdYPzzisM8omwA+Ys7ACUaakR5FgCcfhZf+bWclEP/xJ6KHyXTK1s4miKNcXcFWMrq2YbK5w3RnB3NKdIHjV19MfmaK1R2EiAF+OyJEEEP8HPgsYgOP3Hd2BaIPxLplvL1JEzoGK4fwyzlRlWZzTLUzJsZAwLjkbSfItiq0qRHpsFyhAEqQNiAuLILPHz/12H4Czfe/bKGtqadTptMd8I6VtVUkc1RbY6Y7E0LboigXX3sM2a4IVY1KWvdWehh6GHlk5DHvEa8JeL4EAsQafvWV3TJkAPrSv4hNQ1vVNBpYOrRGsVxQTSqm4wlt3RBR1o8fIvc5Nh4jokguiBckB5cLrhBcLmn9e0GaOeBdpwPPPb6oQNzZpKtq6npK5jyrRy8gRGW6PaGra6J2mCqHTxyFzR0ERTLbBfWFww8cfiC4oeAGglt2cMj2pPdz8cITcDqZMRGoxoSqpgsNo9U1JHPUkwldPSWGgKlx2Y1vgs0drGvBGeIdUoArwQ/AFSADgVKRIUipcFgXTTgff/v1XgnCJNVUnOfQheuEuqXemdB1EY2RI9ccRdQI04rMp/7vMsPnDslBCkFKUhSS2nDe3/1IhNN+wXg4YOOZRKC+/0sWq4ZWO5ZX1xAvVDsTurbFYsTMGB19HeH5FxEfcQLOCy4HKUgkSlLmeVoJyQM9UGZwxu35wAAVOP10ImAmxKrGS87S2iG6qqGtazQGYgxccsPl6HiCdi1ZJuCS0XwBLk/AFIKUvfmK1BF36+6ACyOc8Qmc3pTbLyQxDEfsImUxwA08zWRKCB2hU0yNYrhMrMa4zHC5kQ0EPwAZAEOQoSBDgYHCwFI/KCwdDxRyhRVb7AliEOreAyagET8qia3SVDUaDYvKiZveTFfvoBbwLsntBr38eSIhA6BQ0hZuKTLSBiSACaxEkGwv+9k8edkcOCTLyYYl1XaFRk21R/F5QawniBiuNKQUXAEMQEYgZS95bolEYVD2x7ml+mf9+YsC+0YMZCA47xGMrqnRELEYOfLW48SuJcaOzIPLJBmuAFf0O10hkMfk+LJXws9lPxsKLGnywMwH/exGt39SxAsxdGhoMVOIynD1MKGdIt5w3uFyjy+S8yWnB9e075e6Z77M9kj4We17T8wIWM/OZ6kP+MESsQ2YRixETCytlhBwCM6By4A87fPk7EVmqf5Oe8CewO6y61MdxaSEzcXSujiA4tilaGxRVcQU1MAM04hzQuYd4h3OC+LcXlaO/aCz7DPbU2Pm/ln2BgxXUwkAhtffTOg6LCgWDTEwDTjnEHOYEwRLd5k94SyEpdglNSM4d05IDWimwvob9wgUN71X/HAVFxUzQ0TQGBEVnAgeh4gkVfcBn4OMnwOeN6MCEbjw8j0CAGu3fCjVG3A4JCriHIZLj1c2f/WcjfcNWZR6dtnUQezDj+Ddn5IFAqP33CbLJ67FS44TT7MxxuFweARBzIG5RaD/H/Muj9JL3ss+9RAHKa545+5fFnJ6/ee/KaP14ziXs/PUGDFLptOkhEbBVBaBduceLJLAIxD6WQWeXoOwBMNjcPJOOSsBgGP3/ESW1i7GSU6sQgIXj5nDTNJvnQGyWNfZTjcPHoEXR3DqAmAF3vXhBbyzvpxedM+PZO0NV7P1ZIs2EVOfIjos+D5cL6/bkzv2pKLsxaSAv1wKxSrceCtc946F2skrfaSqfvBd23j4AZZOtORLDl9EfBGRMiK5IWXs94KAFKS+P3O/CdQl/P5KKI/C+26Dy67cZ5xXJDAbzQ+/Z+HvDyLDmmygSB6RIiKFQa5Irn3jAXGKhRw5s4Y8dx3ccD28/eZzfkE7LwLzQ//wU7P6v6BN/wJiSP8mJJJDdghZfgtcde15fbb7H4mvSiRlzSUhAAAAAElFTkSuQmCC';
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
  function reportDocxRun(value,size=21,color='1E293B',bold=false){
    return `<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:eastAsia="Arial" w:cs="Arial"/>${bold?'<w:b/><w:bCs/>':''}<w:color w:val="${color}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr><w:t xml:space="preserve">${reportDocxEsc(value)}</w:t></w:r>`;
  }
  function reportDocxParagraph(runs,{line=220,after=0,before=0,keep=false,align='left'}={}){
    return `<w:p><w:pPr><w:jc w:val="${align}"/><w:spacing w:before="${before}" w:after="${after}" w:line="${line}" w:lineRule="exact"/>${keep?'<w:keepNext/>':''}</w:pPr>${runs}</w:p>`;
  }
  function reportDocxCell(content,width,{top=0,bottom=0,left=0,right=80,v='center',shade='F8FAFC',topBorder='',bottomBorder=''}={}){
    const borders=(topBorder||bottomBorder)?`<w:tcBorders>${topBorder?`<w:top w:val="single" w:sz="${topBorder}" w:space="0" w:color="CBD5E1"/>`:''}${bottomBorder?`<w:bottom w:val="single" w:sz="${bottomBorder}" w:space="0" w:color="${bottomBorder==='6'?'E2E8F0':'CBD5E1'}"/>`:''}</w:tcBorders>`:'';
    return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/><w:vAlign w:val="${v}"/><w:shd w:val="clear" w:color="auto" w:fill="${shade}"/><w:tcMar><w:top w:w="${top}" w:type="dxa"/><w:left w:w="${left}" w:type="dxa"/><w:bottom w:w="${bottom}" w:type="dxa"/><w:right w:w="${right}" w:type="dxa"/></w:tcMar>${borders}</w:tcPr>${content}</w:tc>`;
  }
  function reportDocxImage(relId,name,cx,cy,id){
    return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="${id}" name="${reportDocxEsc(name)}" descr="${reportDocxEsc(name)}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="${reportDocxEsc(name)}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
  }
  function reportDocxSpacer(height=120){ return reportDocxParagraph('',{line:height,after:0,before:0}); }
  function makeReportDocx(){
    const groups=progressGroups(), L=reportLayoutLabels();
    const statusHeader=currentLang==='en'?'Status':L.status;
    let imageId=1;
    const summaryTable=g=>{
      const widths=[2675,2675,2675,2675];
      const labels=[L.date,L.start,L.duration,L.totalVolume].map(v=>String(v).toUpperCase());
      const values=[g.date,g.startTime,g.duration,g.totalWeight+' kg'];
      const grid=widths.map(w=>`<w:gridCol w:w="${w}"/>`).join('');
      const row1=labels.map((v,i)=>reportDocxCell(reportDocxParagraph(reportDocxRun(v,18,'64748B',true),{line:190,keep:true}),widths[i],{top:45,bottom:0,right:130,topBorder:'12'})).join('');
      const row2=values.map((v,i)=>reportDocxCell(reportDocxParagraph(reportDocxRun(v,28,'1E293B',true),{line:290,keep:true}),widths[i],{top:0,bottom:55,right:130,bottomBorder:'12'})).join('');
      return `<w:tbl><w:tblPr><w:tblW w:w="10700" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="0" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${grid}</w:tblGrid><w:tr><w:trPr><w:cantSplit/></w:trPr>${row1}</w:tr><w:tr><w:trPr><w:cantSplit/></w:trPr>${row2}</w:tr></w:tbl>${reportDocxSpacer(120)}`;
    };
    const recordsTable=ex=>{
      const widths=[360,1500,700,480,360,1700,700,4900];
      const grid=widths.map(w=>`<w:gridCol w:w="${w}"/>`).join('');
      const cells=[
        reportDocxCell(reportDocxParagraph(reportDocxImage('rId3','Max Ever trophy',166688,190500,imageId++),{line:420,keep:true,align:'center'}),widths[0],{top:20,bottom:20,right:20}),
        reportDocxCell(reportDocxParagraph(reportDocxRun('Max Ever:',21,'64748B',true),{line:230,keep:true}),widths[1],{left:35,right:20}),
        reportDocxCell(reportDocxParagraph(reportDocxRun(ex.everMax+' kg',21,'64748B',true),{line:230,keep:true}),widths[2],{right:0}),
        reportDocxCell(reportDocxParagraph('',{line:230,keep:true}),widths[3],{right:0}),
        reportDocxCell(reportDocxParagraph(reportDocxImage('rId4','Max Today fire',152400,190500,imageId++),{line:420,keep:true,align:'center'}),widths[4],{top:20,bottom:20,right:20}),
        reportDocxCell(reportDocxParagraph(reportDocxRun('Max Today:',21,'15803D',true),{line:230,keep:true}),widths[5],{left:35,right:20}),
        reportDocxCell(reportDocxParagraph(reportDocxRun(ex.todayMax+' kg',21,'15803D',true),{line:230,keep:true}),widths[6],{right:0}),
        reportDocxCell(reportDocxParagraph('',{line:230,keep:true}),widths[7],{right:0})
      ].join('');
      return `<w:tbl><w:tblPr><w:tblW w:w="10700" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>${grid}</w:tblGrid><w:tr><w:trPr><w:cantSplit/><w:trHeight w:val="430" w:hRule="atLeast"/></w:trPr>${cells}</w:tr></w:tbl>`;
    };
    const exerciseTable=ex=>{
      const widths=[3210,2568,2568,2354];
      const grid=widths.map(w=>`<w:gridCol w:w="${w}"/>`).join('');
      const heads=[L.weight,L.reps,L.sets,statusHeader];
      const headCells=heads.map((v,i)=>reportDocxCell(reportDocxParagraph(reportDocxRun(String(v).toUpperCase(),16,'64748B',true),{line:185,keep:true}),widths[i],{top:55,bottom:55,right:100,topBorder:'12',bottomBorder:'12'})).join('');
      const body=ex.rows.map(r=>{
        const status=reportRowStatus(r), statusColor=String(status).indexOf('⚠️')===0?'B45309':(status===L.overTarget?'15803D':'64748B');
        const vals=[reportPair(r.dKg,r.pKg,'kg'),reportPair(r.dReps,r.pReps),reportPair(r.dSets,r.pSets),status];
        return `<w:tr><w:trPr><w:cantSplit/></w:trPr>${vals.map((v,i)=>reportDocxCell(reportDocxParagraph(reportDocxRun(v,21,i===3?statusColor:'1E293B',i<3||i===3&&statusColor!=='64748B'),{line:230}),widths[i],{top:85,bottom:85,right:100,bottomBorder:'6'})).join('')}</w:tr>`;
      }).join('');
      return `<w:tbl><w:tblPr><w:tblW w:w="10700" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders><w:bottom w:val="single" w:sz="12" w:space="0" w:color="CBD5E1"/></w:tblBorders></w:tblPr><w:tblGrid>${grid}</w:tblGrid><w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>${headCells}</w:tr>${body}</w:tbl>`;
    };
    const exerciseBlock=(ex,idx)=>`${reportDocxParagraph(reportDocxRun((idx+1)+'. '+displayExerciseName(ex.name),30,'1E293B',true),{line:310,after:35,keep:true})}${recordsTable(ex)}${reportDocxSpacer(65)}${exerciseTable(ex)}${reportDocxSpacer(150)}`;
    const body=groups.length?groups.map(g=>summaryTable(g)+g.exercises.map(exerciseBlock).join('')).join(''):reportDocxParagraph(reportDocxRun(t('noReport'),21,'64748B',true),{line:230});
    const documentXml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:background w:color="F8FAFC"/><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="440" w:right="560" w:bottom="440" w:left="560" w:header="0" w:footer="0" w:gutter="0"/><w:cols w:space="720"/><w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>`;
    const contentTypes=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`;
    const rootRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`;
    const docRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/max-ever.png"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/max-today.png"/></Relationships>`;
    const stamp=new Date().toISOString();
    const core=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Easy Gym LOG</dc:title><dc:creator>Easy Gym</dc:creator><cp:lastModifiedBy>Easy Gym</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${stamp}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${stamp}</dcterms:modified></cp:coreProperties>`;
    const app=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Easy Gym</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><Company></Company><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>1.0</AppVersion></Properties>`;
    return reportZipStored([
      {name:'[Content_Types].xml',data:contentTypes},{name:'_rels/.rels',data:rootRels},{name:'word/document.xml',data:documentXml},
      {name:'word/_rels/document.xml.rels',data:docRels},{name:'word/media/max-ever.png',data:reportDataUriBytes(MAX_EVER_ICON_DATA)},
      {name:'word/media/max-today.png',data:reportDataUriBytes(MAX_TODAY_ICON_DATA)},{name:'docProps/core.xml',data:core},{name:'docProps/app.xml',data:app}
    ]);
  }
  function downloadWord(){ downloadFile('easy-gym-report.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document',makeReportDocx(),true); }
  let reportIconPromise=null;
  function reportLoadImage(src){ return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;}); }
  function reportLoadIcons(){ if(!reportIconPromise) reportIconPromise=Promise.all([reportLoadImage(MAX_EVER_ICON_DATA),reportLoadImage(MAX_TODAY_ICON_DATA)]); return reportIconPromise; }
  function reportFitCanvasText(ctx,value,maxWidth){
    let s=String(value==null?'':value);
    if(ctx.measureText(s).width<=maxWidth) return s;
    while(s.length>1 && ctx.measureText(s+'…').width>maxWidth) s=s.slice(0,-1);
    return s+'…';
  }
  function reportCanvasJpegBytes(canvas){
    const raw=atob(canvas.toDataURL('image/jpeg',0.94).split(',')[1]), out=new Uint8Array(raw.length);
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
    const L=reportLayoutLabels(), statusHeader=currentLang==='en'?'Status':L.status;
    const [trophyIcon,fireIcon]=await reportLoadIcons();
    const W=1190,H=1684,M=68,contentW=W-M*2,rowH=54;
    const colors={bg:'#f8fafc',primary:'#1e293b',secondary:'#64748b',success:'#15803d',warning:'#b45309',border:'#cbd5e1',soft:'#e2e8f0'};
    const pages=[];
    let canvas,ctx,y;
    const font=(size,bold=false)=>`${bold?'700':'400'} ${size}px Arial, "Segoe UI", sans-serif`;
    const newPage=()=>{
      canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;ctx=canvas.getContext('2d');
      ctx.fillStyle=colors.bg;ctx.fillRect(0,0,W,H);ctx.textBaseline='alphabetic';ctx.lineCap='butt';y=M;
    };
    const finishPage=()=>{ if(canvas) pages.push({bytes:reportCanvasJpegBytes(canvas),width:W,height:H}); };
    const line=(x1,y1,x2,y2,color=colors.border,width=2)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};
    const drawText=(value,x,base,size,bold=false,color=colors.primary,maxWidth=null)=>{ctx.font=font(size,bold);ctx.fillStyle=color;const shown=maxWidth?reportFitCanvasText(ctx,value,maxWidth):String(value);ctx.fillText(shown,x,base);};
    const ensure=h=>{ if(y+h>H-M){finishPage();newPage();} };
    const drawOverview=g=>{
      ensure(102); line(M,y,W-M,y);
      const labels=[L.date,L.start,L.duration,L.totalVolume], vals=[g.date,g.startTime,g.duration,g.totalWeight+' kg'], colW=contentW/4;
      labels.forEach((v,i)=>drawText(String(v).toUpperCase(),M+i*colW,y+22,18,true,colors.secondary,colW-24));
      vals.forEach((v,i)=>drawText(v,M+i*colW,y+55,28,true,colors.primary,colW-24));
      line(M,y+70,W-M,y+70); y+=96;
    };
    const drawExerciseHeader=(ex,idx,continued=false)=>{
      drawText((idx+1)+'. '+displayExerciseName(ex.name)+(continued?' (cont.)':''),M+16,y+30,30,true,colors.primary,contentW-32); y+=42;
      const iconY=y+7, everIconX=M+16, everLabelX=everIconX+38, everValueX=everLabelX+142;
      const todayIconX=M+Math.round(contentW*0.27), todayLabelX=todayIconX+38, todayValueX=todayLabelX+164;
      ctx.drawImage(trophyIcon,everIconX,iconY,25,29); ctx.drawImage(fireIcon,todayIconX,iconY,23,29);
      drawText('Max Ever:',everLabelX,y+29,21,true,colors.secondary); drawText(ex.everMax+' kg',everValueX,y+29,21,true,colors.secondary);
      drawText('Max Today:',todayLabelX,y+29,21,true,colors.success); drawText(ex.todayMax+' kg',todayValueX,y+29,21,true,colors.success);
      y+=53;
      line(M+16,y,W-M-16,y);
      const colW=[contentW*.30,contentW*.24,contentW*.24,contentW*.22], heads=[L.weight,L.reps,L.sets,statusHeader]; let x=M+16;
      heads.forEach((v,i)=>{drawText(String(v).toUpperCase(),x,y+23,16,true,colors.secondary,colW[i]-20);x+=colW[i];});
      line(M+16,y+36,W-M-16,y+36); y+=50;
      return colW;
    };
    newPage();
    groups.forEach((g,gi)=>{
      drawOverview(g);
      g.exercises.forEach((ex,idx)=>{
        let rowIndex=0, continued=false;
        while(rowIndex<ex.rows.length){
          ensure(42+53+50+rowH+24);
          const colW=drawExerciseHeader(ex,idx,continued); continued=true;
          while(rowIndex<ex.rows.length && y+rowH+24<=H-M){
            const r=ex.rows[rowIndex], status=reportRowStatus(r), statusColor=String(status).indexOf('⚠️')===0?colors.warning:(status===L.overTarget?colors.success:colors.secondary);
            const vals=[reportPair(r.dKg,r.pKg,'kg'),reportPair(r.dReps,r.pReps),reportPair(r.dSets,r.pSets),status]; let x=M+16;
            vals.forEach((v,i)=>{drawText(v,x,y+31,21,i<3||(i===3&&statusColor!==colors.secondary),i===3?statusColor:colors.primary,colW[i]-20);x+=colW[i];});
            line(M+16,y+45,W-M-16,y+45,colors.soft,1.5); y+=rowH; rowIndex++;
          }
          line(M+8,y,W-M-8,y,colors.border,2); y+=22;
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
  function setLibraryDeleteState(){ const enabled=editMode && selectedLibraryDelete.size>0; els.deleteLibraryBtn.style.display=''; els.deleteLibraryBtn.hidden=false; els.deleteLibraryBtn.disabled=!enabled; els.deleteLibraryBtn.classList.toggle('disabled',!enabled); }
  function renderLibrary(){ $('modalTitle').textContent=t('chooseExercise'); els.editExercisesBtn.style.display=editMode?'none':''; els.saveLibraryBtn.style.display=''; setLibraryDeleteState(); els.exerciseModalHelp.textContent=''; els.customRow.style.display=''; if(editMode){ els.libraryList.innerHTML = libraryDraft.map((name,i)=>`<div class="library-edit-row"><input class="library-checkbox" type="checkbox" data-lib-check="${i}" ${selectedLibraryDelete.has(i)?'checked':''}><input data-lib-name="${i}" value="${esc(displayExerciseName(name))}"><span></span></div>`).join(''); els.libraryList.querySelectorAll('[data-lib-check]').forEach(c=>c.addEventListener('change',()=>{const i=Number(c.dataset.libCheck); c.checked?selectedLibraryDelete.add(i):selectedLibraryDelete.delete(i); renderLibrary();})); els.libraryList.querySelectorAll('[data-lib-name]').forEach(inp=>inp.addEventListener('input',()=>{libraryDraft[Number(inp.dataset.libName)]=canonicalExerciseName(inp.value);libraryDirty=true;renderLibrarySaveOnly();})); } else { els.libraryList.innerHTML = exerciseLibrary.map(name=>`<div class="library-choice"><button type="button" class="exercise-choice-name" data-choice="${esc(name)}">${esc(displayExerciseName(name))}</button><span></span></div>`).join(''); els.libraryList.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>chooseExercise(b.dataset.choice))); } updateCustomAdd(); }
  function renderLibrarySaveOnly(){ updateCustomAdd(); }
  function updateCustomAdd(){ const has=!!normalExercise(els.customExerciseName.value); els.addCustomExerciseBtn.style.display='none'; const enabled=editMode?(libraryDirty||has):has; els.saveLibraryBtn.disabled=!enabled; els.saveLibraryBtn.classList.toggle('disabled',!enabled); }
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
    [['sharePlanBtn',hasPlan],['manageSavePlanBtn',hasPlan],['manageSaveReportBtn',hasReport],['shareReportBtn',hasReport],['saveAllDataBtn',hasData],['deleteDataBtn',hasData]].forEach(([id,on])=>{
      const b=els[id]; if(!b)return; b.disabled=!on; b.classList.toggle('disabled',!on);
    });
    if(els.sharePlanLinkBtn){
      els.sharePlanLinkBtn.disabled=false;
      els.sharePlanLinkBtn.classList.remove('disabled');
    }
  }
  function allDataPayload(){
    return {type:'easy-gym-backup',version:143,exportedAt:new Date().toISOString(),weekPlans,savedPlanDays,trainSessions,journal,exerciseLibrary,datePlans,savedDatePlans,activeDatePlans};
  }
  function planPayload(){
    const exportWeekPlans=JSON.parse(JSON.stringify(weekPlans||emptyDays()));
    const exportSavedPlanDays={...(savedPlanDays||{})};
    DAYS.forEach(day=>{
      if(Array.isArray(exportWeekPlans[day]) && exportWeekPlans[day].length){
        exportSavedPlanDays[day]=true;
      }
    });

    const exportDatePlans=JSON.parse(JSON.stringify(datePlans||{}));
    const exportSavedDatePlans={...(savedDatePlans||{})};
    const exportActiveDatePlans={...(activeDatePlans||{})};
    Object.keys(exportDatePlans).forEach(iso=>{
      if(Array.isArray(exportDatePlans[iso]) && exportDatePlans[iso].length){
        exportSavedDatePlans[iso]=true;
        exportActiveDatePlans[iso]=true;
      }
    });

    return {
      type:'easy-gym-plan',
      version:143,
      exportedAt:new Date().toISOString(),
      weekPlans:exportWeekPlans,
      savedPlanDays:exportSavedPlanDays,
      exerciseLibrary,
      datePlans:exportDatePlans,
      savedDatePlans:exportSavedDatePlans,
      activeDatePlans:exportActiveDatePlans
    };
  }
  function reportPayload(){
    return {type:'easy-gym-report',version:143,exportedAt:new Date().toISOString(),text:progressText(),journal};
  }
  function savePlanFile(){ downloadFile(`easy-gym-plan-${todayISO()}.json`,'application/json',JSON.stringify(planPayload(),null,2)); toast(t('planSaved')); }
  function saveReportFile(){ downloadFile(`easy-gym-report-${todayISO()}.txt`,'text/plain',progressText()||t('noReport')); toast(t('reportSaved')); }
  function saveAllDataFile(){ downloadFile(`easy-gym-backup-${todayISO()}.json`,'application/json',JSON.stringify(allDataPayload(),null,2)); backupReady=true; save(KEYS.backup,true); renderExplanations(); toast(t('allDataSaved')); }
  async function shareFile(name,mime,content){
    try{
      const file=new File([content],name,{type:mime});
      if(navigator.share && navigator.canShare && navigator.canShare({files:[file]})){ await navigator.share({files:[file],title:'Easy Gym',text:name}); toast(t('shared')); return; }
      if(navigator.share && mime==='text/plain'){ await navigator.share({title:'Easy Gym',text:content}); toast(t('shared')); return; }
    }catch(e){}
    downloadFile(name,mime,content);
    toast(t('fileSaved'));
  }
  function sharePlan(){ const content=JSON.stringify(planPayload(),null,2); shareFile(`easy-gym-plan-${todayISO()}.json`,'application/json',content); }
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
    const dateIsos=Object.keys(datePlans||{}).sort().filter(iso=>Array.isArray(datePlans[iso])&&datePlans[iso].length&&isoDayNumber(iso)!==null);
    const baseNum=dateIsos.length?isoDayNumber(dateIsos[0]):0;
    const dateEntries=dateIsos.map(iso=>[isoDayNumber(iso)-baseNum,packList(datePlans[iso])]).filter(entry=>entry[1].length);
    const weekEntries=DAYS.map((day,i)=>Array.isArray(weekPlans[day])&&weekPlans[day].length?[i,packList(weekPlans[day])]:null).filter(Boolean).filter(entry=>entry[1].length);
    return ['egp5',baseNum,customNames,dateEntries,weekEntries];
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
  async function sharePlanLink(){
    if(!hasPlanData()){ toast(t('savePlanFirst')); return; }
    const signature=currentPlanLinkSignature();
    if(cachedPlanLink && cachedPlanLinkSignature===signature){
      shareReadyPlanLink(cachedPlanLink);
      return;
    }
    toast(t('creatingPlanLink'));
    let link='';
    try{
      link=await planShareLink();
    }catch(e){
      toast(e && e.message==='PLAN_LINK_TOO_LARGE' ? t('planLinkTooLarge') : t('importFailed'));
      return;
    }
    if(!link){ toast(t('copyPlanLinkPrompt')); return; }
    shareReadyPlanLink(link);
  }
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
    if(confirm(t('confirmInsert'))){
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
  function shareReport(){ shareFile(`easy-gym-report-${todayISO()}.txt`,'text/plain',progressText()||t('noReport')); }
  function readJsonFile(file, done, failMsg){
    const reader=new FileReader();
    reader.onload=()=>{ try{ done(JSON.parse(reader.result)); }catch(e){ toast(failMsg||t('importFailed')); } };
    reader.readAsText(file);
  }
  function importPlanData(data){
    if(!data || typeof data!=='object') throw new Error('invalid plan');
    weekPlans=data.weekPlans||emptyDays();
    savedPlanDays=data.savedPlanDays||{};
    datePlans=(data.datePlans&&typeof data.datePlans==='object'&&!Array.isArray(data.datePlans))?data.datePlans:{};
    savedDatePlans=(data.savedDatePlans&&typeof data.savedDatePlans==='object'&&!Array.isArray(data.savedDatePlans))?data.savedDatePlans:{};
    activeDatePlans=(data.activeDatePlans&&typeof data.activeDatePlans==='object'&&!Array.isArray(data.activeDatePlans))?data.activeDatePlans:{};
    Object.keys(datePlans||{}).forEach(iso=>{ if(Array.isArray(datePlans[iso]) && datePlans[iso].length){ savedDatePlans[iso]=true; activeDatePlans[iso]=true; } });
    DAYS.forEach(day=>{ if(Array.isArray(weekPlans[day]) && weekPlans[day].length){ savedPlanDays[day]=true; } });
    const importedPlanNames=collectPlanExerciseNames({weekPlans,datePlans});
    if(Array.isArray(data.exerciseLibrary)) exerciseLibrary=data.exerciseLibrary;
    importedPlanNames.forEach(name=>{ if(name&&!exerciseLibrary.includes(name)) exerciseLibrary.push(name); });
    trainSessions=emptyDays();
    trainStartTimes={};
    selectedPlanDate=null; selectedTrainDate=null; selectedPlanDay=null; selectedTrainDay=null; savedWorkout=null; copiedPlan=null;
    normalizeData(); renderAll(); toast(t('planInserted'));
  }
  function insertPlanFile(e){
    const file=e.target.files&&e.target.files[0]; if(!file)return;
    if(!confirm(t('confirmInsert'))){ e.target.value=''; return; }
    readJsonFile(file, data=>{
      try{ importPlanData(data); }catch(err){ toast(t('insertFailed')); }
      e.target.value='';
    },t('insertFailed'));
  }
  function restoreAllDataFile(e){
    const file=e.target.files&&e.target.files[0]; if(!file)return;
    if(!confirm(t('confirmRestore'))){ e.target.value=''; return; }
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
      normalizeData(); renderAll(); toast(t('dataRestored')); e.target.value='';
    },t('restoreFailed'));
  }
  function deleteAllData(){
    if(!confirm(t('confirmDelete')))return;
    [...Object.keys(localStorage)].forEach(k=>{if(k.startsWith(PACKAGE_PREFIX))localStorage.removeItem(k);});
    weekPlans=emptyDays(); trainSessions=emptyDays(); savedPlanDays={}; journal=[]; exerciseLibrary=[...DEFAULT_LIBRARY]; trainStartTimes={}; datePlans={}; savedDatePlans={}; activeDatePlans={}; backupReady=false; selectedPlanDay=null; selectedTrainDay=null; selectedPlanDate=null; selectedTrainDate=null; savedWorkout=null;
    saveAll(); renderAll(); toast(t('dataDeleted'));
  }

  async function boot(){
    try{
      await loadLanguagePacks();
      init();
    }catch(e){
      console.error(e);
      document.body.innerHTML = '<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;padding:24px;line-height:1.4"><h1>Easy Gym</h1><p>Language files could not be loaded. Please reinstall/update the app package.</p></div>';
    }
  }
  window.addEventListener('DOMContentLoaded', boot);
})();
