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
  const LANG_PACK_VERSION = 'v230X-language-packages';
  const EMBEDDED_LANGUAGE_PACKS = {"en":{"code":"en","ui":{"langName":"English","days":{"mon":"Mon","tue":"Tue","wed":"Wed","thu":"Thu","fri":"Fri","sat":"Sat","sun":"Sun"},"months":["January","February","March","April","May","June","July","August","September","October","November","December"],"plan":"PLAN","do":"GO","report":"LOG","manage":"mgmt","donate":"support","about":"info","selectDay":"Select the Day","addExercise":"EXERCISE","remove":"del","copy":"Copy","copied":"Copied","paste":"Paste","saveTraining":"Save training","saved":"Saved","startTraining":"Start Training","mass":"Mass","time":"Time","started":"Started","stopSaveTraining":"Stop and Save Training","done":"Done","activateTraining":"Activate Training","plannedNotTrained":"Planned · not trained","noTrainingDay":"No training on this day.","tapAddExercise":"Tap “+ EXERCISE” to build this day’s training.","noSavedPlan":"No saved plan for this day.","noCompletedExercises":"No completed exercises.","chooseExercise":"Choose exercise","editExercises":"Edit exercises","save":"Save","modalSave":"SAVE","delete":"del","writeOwnExercise":"Write your own exercise","kg":"KG","reps":"Reps","sets":"Sets","download":"Download","word":"Word","pdf":"PDF","noSavedReport":"No saved LOG yet.","noReport":"No LOG","date":"Date","startTime":"Start Time","duration":"Duration","total":"Total","exercise":"Exercise","everMax":"Apex","maxToday":"Max TDY","sharePlan":"Share Plan","sharePlanLink":"Share Plan as Link","sharePlanLinkUnavailable":"Available in App Store version","directLinkComingSoon":"PLAN-Link ready.","planLinkReady":"Plan link ready","planLinkCopied":"Plan link copied","planLinkTooLarge":"Plan too large for link - use Share Plan file","savePlanFirst":"Save a plan first","creatingPlanLink":"Creating plan link","copyPlanLinkPrompt":"Copy this plan link","savePlan":"Save Plan","insertPlan":"Insert Plan","saveReport":"Save LOG","shareReport":"Share LOG","saveAllData":"Backup","restoreAllData":"Restore","deleteData":"Delete Data","mgmtShareSaveTitle":"Share & Save","mgmtDataTitle":"Data Backup & Imports","mgmtDangerTitle":"Danger Zone","supportTitle":"Support Easy Gym","supportIntro":"This version of Easy Gym is free. If you like it — any donation helps — thank you.","confirmInsert":"Insert will override Plans - confirm","confirmRestore":"Restore will replace All Data - confirm","confirmDelete":"Delete will erase All Data - confirm","theme":"Theme","themeToast":"Theme: ","planSaved":"Plan saved","reportSaved":"LOG saved","allDataSaved":"All data saved","shared":"Shared","fileSaved":"File saved","planInserted":"Plan inserted","dataRestored":"Data restored","dataDeleted":"Data deleted","insertFailed":"Insert failed","restoreFailed":"Restore failed","importFailed":"Import failed","trainingSaved":"Training saved","exerciseRemovedPlan":"Exercise removed from Plan","exerciseListSaved":"Exercise list saved","addFirst":"Add exercises to today’s training first","resumeTraining":"Resume training","noExercisesYet":"No exercises yet. Tap “+ EXERCISE” to build today’s training.","noTrainingPlanned":"No training planned for this day. Create it in Plan first.","reportHeader":"Exercise / P-KG / D-KG / P-Reps / D-Reps / P-Sets / D-Sets","aboutHtml":"<div class=\"app-view-container\"><div class=\"app-info-section\"><div class=\"app-group-title\">Preface</div><div class=\"app-group-card app-preface-card\"><div class=\"app-list-row app-preface-row\"><div class=\"app-row-left-group\"><p class=\"app-global-desc app-preface-body\">I created Easy Gym for my own serious training. It is ad-free training tracker with no subscriptions. Build your PLAN, start your workout in GO, and keep every result in LOG — all on your phone. You can help by sharing the app, rating it in the App Store, or sending feedback. Contact: <span class=\"em-keyword\">arthur.stivenson@gmail.com</span> More info in <span class=\"em-keyword\">www.easygym.ch</span>.</p></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">User Guide</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><rect height=\"15\" rx=\"2.5\" width=\"17\" x=\"3.5\" y=\"5.5\"></rect><path d=\"M7.5 3.5v4M16.5 3.5v4M3.5 9.5h17\"></path><path d=\"M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">PLAN</span><span class=\"app-global-desc\">Create a plan for any date. Use <strong class=\"em-keyword\">+ EXERCISE</strong> to add exercises with KG, reps, and sets. Use <strong class=\"em-keyword\">DEL</strong> to remove exercises. Save the plan when it is ready.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"m10 8 6 4-6 4z\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">GO</span><span class=\"app-global-desc\">Start from a saved PLAN. You can adjust KG, reps, and sets during the workout or add another <strong class=\"em-keyword\">+ EXERCISE</strong>. Your original PLAN stays unchanged for next time.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M4.5 8.5V4.5h4\"></path><path d=\"M5 7a8.5 8.5 0 1 1-1.1 8\"></path><path d=\"M12 7.5V12l3 2\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">LOG</span><span class=\"app-global-desc\">Compare planned targets with actual results. Completed sets are marked green. Save or share your final training log.</span></div></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">Management &amp; Share</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M9.5 14.5 14.5 9.5\"></path><path d=\"M7.8 16.2 6.4 17.6a3.5 3.5 0 0 1-5-5l3.1-3.1a3.5 3.5 0 0 1 5 0\"></path><path d=\"m16.2 7.8 1.4-1.4a3.5 3.5 0 1 1 5 5l-3.1 3.1a3.5 3.5 0 0 1-5 0\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Share Plan as Link</span><span class=\"app-global-desc\">Plan-Link will be available in Easy Gym from App Store.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 15.5V3\"></path><path d=\"m7.5 7.5 4.5-4.5 4.5 4.5\"></path><path d=\"M8 9.5H6.5A2.5 2.5 0 0 0 4 12v6.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V12a2.5 2.5 0 0 0-2.5-2.5H16\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Share Plan File or LOG</span><span class=\"app-global-desc\">When you share a file, we create a secure link you can send via WhatsApp or other messengers.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M6 3.5h8l4 4V20.5H6z\"></path><path d=\"M14 3.5v4h4M9 12h6M9 15.5h6\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Save File or LOG</span><span class=\"app-global-desc\">Saves it locally on your device.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 3.5v11\"></path><path d=\"m7.5 10 4.5 4.5 4.5-4.5\"></path><path d=\"M4.5 18v2.5h15V18\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Insert Plan File</span><span class=\"app-global-desc\">Imports a received plan file into Easy Gym.</span></div></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">System &amp; Security</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M7 18.5H5.8A3.8 3.8 0 0 1 5.2 11 6.5 6.5 0 0 1 17.8 9a4.6 4.6 0 0 1 .4 9.2H17\"></path><path d=\"M12 20.5v-9\"></path><path d=\"m8.5 15 3.5-3.5 3.5 3.5\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">BACKUP</span><span class=\"app-global-desc\">Backup saves a full copy. Restore recovers your data. Delete Data wipes everything after confirmation.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 3.2 19 6v5.2c0 4.5-2.8 8-7 9.6-4.2-1.6-7-5.1-7-9.6V6z\"></path><path d=\"m8.8 12 2.1 2.1 4.4-4.5\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">PRIVACY</span><span class=\"app-global-desc\">Easy Gym works on your phone. Your plans and logs stay on your device unless you share them.</span></div></div></div></div></div></div>","supportShareTitle":"Share App","supportShareText":"Share with training partners","supportRateTitle":"Rate in the App Store","supportRateText":"Leave us a review","supportFeedbackTitle":"Feedback & Problems","supportFeedbackText":"Report bugs or suggest ideas","supportContactTitle":"Contact Us","supportContactText":"arthur.stivenson@gmail.com","shareApp":"Share App","rateApp":"Rate App","sendFeedback":"Send Feedback","supportContact":"Contact","supportShareMessage":"Easy Gym — focused training with no ads or subscriptions. https://easygym.ch","reviewUnavailable":"The App Store page could not be opened.","feedbackSubject":"Easy Gym feedback","printReport":"Print LOG","printFailed":"Printing could not be started.","supportDonateGroupTitle":"Donate","supportDonateTitle":"Support Easy Gym","supportDonateText":"A voluntary donation helps maintain and improve the free PWA.","supportDonateQrTitle":"Use Swiss Bank App","supportDonateQrText":"Amount: Open","supportDonateMessage":"Message: Easy Gym","supportDonateDownload":"Download Swiss QR","supportAccountHolder":"Account holder","supportIban":"IBAN","supportSwift":"SWIFT/BIC","supportAccountNumber":"Account Nr","supportClearingNumber":"Clearing Nr","supportBank":"Bank","supportDonateAlt":"Swiss payment QR code","supportDonateAmount":"Message: Easy Gym","dialogCancel":"Cancel","dialogOk":"OK","confirmDeleteTitle":"Delete all data?","confirmDeleteMessage":"It will erase all plans and logs, and can be undone only having backup.","confirmDeleteAction":"Delete Data","confirmInsertTitle":"Replace existing plans?","confirmInsertMessage":"Importing this file will overwrite the plans currently stored in Easy Gym.","confirmInsertAction":"Insert Plan","confirmRestoreTitle":"Restore all data?","confirmRestoreMessage":"Restoring this backup will replace all current Easy Gym data on this device.","confirmRestoreAction":"Restore","sharePlanUnsupportedTitle":"Share Plan unavailable","sharePlanUnsupportedMessage":"File sharing is not supported in this browser. Use Save Plan instead."},"exercises":{}},"de":{"code":"de","ui":{"langName":"Deutsch","days":{"mon":"Mo","tue":"Di","wed":"Mi","thu":"Do","fri":"Fr","sat":"Sa","sun":"So"},"months":["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],"plan":"PLAN","do":"GO","report":"LOG","manage":"orga","donate":"unterstützen","about":"info","selectDay":"Tag wählen","addExercise":"ÜBUNG","remove":"löschen","copy":"Kopieren","copied":"Kopiert","paste":"Einfügen","saveTraining":"Training speichern","saved":"Gespeichert","startTraining":"Training starten","mass":"Mass","time":"Zeit","started":"Gestartet","stopSaveTraining":"Training stoppen und speichern","done":"Erledigt","activateTraining":"Training aktivieren","plannedNotTrained":"Geplant · nicht trainiert","noTrainingDay":"Kein Training an diesem Tag.","tapAddExercise":"Tippe auf „+ ÜBUNG“, um das Training für diesen Tag zu erstellen.","noSavedPlan":"Kein gespeicherter Plan für diesen Tag.","noCompletedExercises":"Keine abgeschlossenen Übungen.","chooseExercise":"Übung wählen","editExercises":"Bearbeiten","save":"Speichern","modalSave":"SPEICHERN","delete":"löschen","writeOwnExercise":"Eigene Übung schreiben","kg":"KG","reps":"Wdh.","sets":"Sätze","download":"Download","word":"Word","pdf":"PDF","noSavedReport":"Noch kein Log gespeichert.","noReport":"Kein Log","date":"Datum","startTime":"Startzeit","duration":"Dauer","total":"Total","exercise":"Übung","everMax":"Apex","maxToday":"Max HEU","sharePlan":"Plan teilen","sharePlanLink":"Plan als Link teilen","sharePlanLinkUnavailable":"In der App-Store-Version verfügbar","directLinkComingSoon":"PLAN-Link bereit.","planLinkReady":"Plan-Link bereit","planLinkCopied":"Plan-Link kopiert","planLinkTooLarge":"Plan zu gross für Link - Plan-Datei teilen verwenden","savePlan":"Plan speichern","insertPlan":"Plan einfügen","saveReport":"Log speichern","shareReport":"Log teilen","saveAllData":"Backup","restoreAllData":"Restore","deleteData":"Daten löschen","mgmtShareSaveTitle":"Teilen & Speichern","mgmtDataTitle":"Datensicherung & Import","mgmtDangerTitle":"Gefahrenbereich","supportTitle":"Easy Gym unterstützen","supportIntro":"Diese Version von Easy Gym ist kostenlos. Wenn sie dir gefällt — jede Spende hilft — danke.","confirmInsert":"Einfügen überschreibt Pläne - bestätigen","confirmRestore":"Wiederherstellen ersetzt alle Daten - bestätigen","confirmDelete":"Löschen entfernt alle Daten - bestätigen","theme":"Design","themeToast":"Design: ","planSaved":"Plan gespeichert","reportSaved":"Log gespeichert","allDataSaved":"Alle Daten gespeichert","shared":"Geteilt","fileSaved":"Datei gespeichert","planInserted":"Plan eingefügt","dataRestored":"Daten wiederhergestellt","dataDeleted":"Daten gelöscht","insertFailed":"Einfügen fehlgeschlagen","restoreFailed":"Wiederherstellen fehlgeschlagen","importFailed":"Import fehlgeschlagen","trainingSaved":"Training gespeichert","exerciseRemovedPlan":"Übung aus Plan entfernt","exerciseListSaved":"Übungsliste gespeichert","addFirst":"Zuerst Übungen zum heutigen Training hinzufügen","resumeTraining":"Training fortsetzen","noExercisesYet":"Noch keine Übungen. Tippe auf „+ ÜBUNG“.","noTrainingPlanned":"Für diesen Tag ist kein Training geplant. Erstelle es zuerst im Plan.","reportHeader":"Übung / P-KG / D-KG / P-Wdh. / D-Wdh. / P-Sätze / D-Sätze","aboutHtml":"<div class=\"app-view-container\"><div class=\"app-info-section\"><div class=\"app-group-title\">Vorwort</div><div class=\"app-group-card app-preface-card\"><div class=\"app-list-row app-preface-row\"><div class=\"app-row-left-group\"><p class=\"app-global-desc app-preface-body\">Ich habe Easy Gym für mein eigenes ernsthaftes Training entwickelt. Es ist ein werbefreier Trainings-Tracker ohne Abonnements. Erstelle deinen PLAN, starte dein Training in GO und speichere jedes Ergebnis im LOG — alles auf deinem Telefon. Du kannst helfen, indem du die App teilst, im App Store bewertest oder Feedback sendest. Kontakt: <span class=\"em-keyword\">arthur.stivenson@gmail.com</span> Weitere Informationen unter <span class=\"em-keyword\">www.easygym.ch</span>.</p></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">Benutzerhandbuch</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><rect height=\"15\" rx=\"2.5\" width=\"17\" x=\"3.5\" y=\"5.5\"></rect><path d=\"M7.5 3.5v4M16.5 3.5v4M3.5 9.5h17\"></path><path d=\"M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">PLAN</span><span class=\"app-global-desc\">Erstelle einen Plan für ein beliebiges Datum. Mit <strong class=\"em-keyword\">+ ÜBUNG</strong> fügst du Übungen mit KG, Wiederholungen und Sätzen hinzu. Mit <strong class=\"em-keyword\">LÖSCHEN</strong> entfernst du Übungen. Speichere den Plan, wenn er bereit ist.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"m10 8 6 4-6 4z\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">GO</span><span class=\"app-global-desc\">Starte mit einem gespeicherten PLAN. Du kannst KG, Wiederholungen und Sätze während des Trainings anpassen oder eine weitere <strong class=\"em-keyword\">+ ÜBUNG</strong> hinzufügen. Dein ursprünglicher PLAN bleibt für das nächste Mal unverändert.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M4.5 8.5V4.5h4\"></path><path d=\"M5 7a8.5 8.5 0 1 1-1.1 8\"></path><path d=\"M12 7.5V12l3 2\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">LOG</span><span class=\"app-global-desc\">Vergleiche die geplanten Vorgaben mit deinen tatsächlichen Ergebnissen. Abgeschlossene Sätze werden grün markiert. Speichere oder teile deinen fertigen Trainings-LOG.</span></div></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">Verwaltung &amp; Teilen</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M9.5 14.5 14.5 9.5\"></path><path d=\"M7.8 16.2 6.4 17.6a3.5 3.5 0 0 1-5-5l3.1-3.1a3.5 3.5 0 0 1 5 0\"></path><path d=\"m16.2 7.8 1.4-1.4a3.5 3.5 0 1 1 5 5l-3.1 3.1a3.5 3.5 0 0 1-5 0\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Plan als Link teilen</span><span class=\"app-global-desc\">Der Plan-Link wird in Easy Gym aus dem App Store verfügbar sein.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 15.5V3\"></path><path d=\"m7.5 7.5 4.5-4.5 4.5 4.5\"></path><path d=\"M8 9.5H6.5A2.5 2.5 0 0 0 4 12v6.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V12a2.5 2.5 0 0 0-2.5-2.5H16\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Plan-Datei oder LOG teilen</span><span class=\"app-global-desc\">Beim Teilen einer Datei erstellen wir einen sicheren Link, den du über WhatsApp oder andere Messenger senden kannst.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M6 3.5h8l4 4V20.5H6z\"></path><path d=\"M14 3.5v4h4M9 12h6M9 15.5h6\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Datei oder LOG speichern</span><span class=\"app-global-desc\">Speichert die Datei lokal auf deinem Gerät.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 3.5v11\"></path><path d=\"m7.5 10 4.5 4.5 4.5-4.5\"></path><path d=\"M4.5 18v2.5h15V18\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Plan-Datei einfügen</span><span class=\"app-global-desc\">Importiert eine erhaltene Plan-Datei in Easy Gym.</span></div></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">System &amp; Sicherheit</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M7 18.5H5.8A3.8 3.8 0 0 1 5.2 11 6.5 6.5 0 0 1 17.8 9a4.6 4.6 0 0 1 .4 9.2H17\"></path><path d=\"M12 20.5v-9\"></path><path d=\"m8.5 15 3.5-3.5 3.5 3.5\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">BACKUP</span><span class=\"app-global-desc\">Backup speichert eine vollständige Kopie. Restore stellt deine Daten wieder her. Daten löschen entfernt nach Bestätigung alles.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 3.2 19 6v5.2c0 4.5-2.8 8-7 9.6-4.2-1.6-7-5.1-7-9.6V6z\"></path><path d=\"m8.8 12 2.1 2.1 4.4-4.5\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">DATENSCHUTZ</span><span class=\"app-global-desc\">Easy Gym funktioniert auf deinem Telefon. Deine Pläne und LOGs bleiben auf deinem Gerät, sofern du sie nicht teilst.</span></div></div></div></div></div></div>","supportShareTitle":"App teilen","supportShareText":"Mit Trainingspartnern teilen","supportRateTitle":"Im App Store bewerten","supportRateText":"Hinterlasse uns eine Rezension","supportFeedbackTitle":"Feedback & Probleme","supportFeedbackText":"Fehler melden oder Ideen vorschlagen","supportContactTitle":"Kontaktieren Sie uns","supportContactText":"arthur.stivenson@gmail.com","shareApp":"App teilen","rateApp":"App bewerten","sendFeedback":"Feedback senden","supportContact":"Kontakt","supportShareMessage":"Easy Gym — fokussiertes Training ohne Werbung oder Abonnements. https://easygym.ch","reviewUnavailable":"Die App-Store-Seite konnte nicht geöffnet werden.","feedbackSubject":"Feedback zu Easy Gym","printReport":"LOG drucken","printFailed":"Drucken konnte nicht gestartet werden.","supportDonateGroupTitle":"Spenden","supportDonateTitle":"Easy Gym unterstützen","supportDonateText":"Eine freiwillige Spende hilft, die kostenlose PWA zu pflegen und weiterzuentwickeln.","supportDonateQrTitle":"Schweizer Bank-App verwenden","supportDonateQrText":"Betrag: Offen","supportDonateMessage":"Mitteilung: Easy Gym","supportDonateDownload":"Schweizer QR herunterladen","supportAccountHolder":"Kontoinhaber","supportIban":"IBAN","supportSwift":"SWIFT/BIC","supportAccountNumber":"Kontonummer","supportClearingNumber":"Clearing Nr","supportBank":"Bank","supportDonateAlt":"Schweizer Zahlungs-QR-Code","supportDonateAmount":"Mitteilung: Easy Gym","dialogCancel":"Abbrechen","dialogOk":"OK","confirmDeleteTitle":"Alle Daten löschen?","confirmDeleteMessage":"Dadurch werden alle Pläne und LOGs gelöscht; rückgängig gemacht werden kann dies nur mit einem Backup.","confirmDeleteAction":"Daten löschen","confirmInsertTitle":"Bestehende Pläne ersetzen?","confirmInsertMessage":"Beim Importieren dieser Datei werden die aktuell in Easy Gym gespeicherten Pläne überschrieben.","confirmInsertAction":"Plan einfügen","confirmRestoreTitle":"Alle Daten wiederherstellen?","confirmRestoreMessage":"Beim Wiederherstellen dieses Backups werden alle aktuellen Easy-Gym-Daten auf diesem Gerät ersetzt.","confirmRestoreAction":"Wiederherstellen","sharePlanUnsupportedTitle":"PLAN teilen nicht verfügbar","sharePlanUnsupportedMessage":"Das Teilen von Dateien wird von diesem Browser nicht unterstützt. Verwende stattdessen „Plan speichern“."},"exercises":{"Snatch":"Reissen","Clean and Jerk":"Umsetzen & Ausstossen","Clean":"Umsetzen","Jerk":"Ausstossen","Power Snatch":"Standreissen","Power Clean":"Standumsetzen","Back Squat":"Kniebeuge hinten","Front Squat":"Kniebeuge vorne","Overhead Squat":"Überkopfkniebeuge","Deadlift":"Kreuzheben","Bench Press":"Bankdrücken","Push Press":"Schwungdrücken","Strict Press":"Schulterdrücken","Barbell Row":"Langhantelrudern","Pull-up":"Klimmzug","Dip":"Dip","Lunge":"Ausfallschritt","Romanian Deadlift":"Rumänisches Kreuzheben"}},"fr":{"code":"fr","ui":{"langName":"Français","days":{"mon":"Lun","tue":"Mar","wed":"Mer","thu":"Jeu","fri":"Ven","sat":"Sam","sun":"Dim"},"months":["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],"plan":"PLAN","do":"GO","report":"LOG","manage":"gest.","donate":"soutien","about":"info","selectDay":"Choisir le jour","addExercise":"EXERCICE","remove":"elimine","copy":"Copier","copied":"Copié","paste":"Coller","saveTraining":"Sauver training","saved":"Sauvé","startTraining":"Démarrer training","mass":"Mass","time":"Temps","started":"Démarré","stopSaveTraining":"Arrêter et sauver","done":"Terminé","activateTraining":"Activer training","plannedNotTrained":"Planifié · non entraîné","noTrainingDay":"Pas de training ce jour.","tapAddExercise":"Tape “+ EXERCICE” pour créer le training du jour.","noSavedPlan":"Pas de plan sauvé pour ce jour.","noCompletedExercises":"Aucun exercice terminé.","chooseExercise":"Choisir exercice","editExercises":"Modifier","save":"Sauver","modalSave":"SAUVER","delete":"elimine","writeOwnExercise":"Écrire ton exercice","kg":"KG","reps":"Rép.","sets":"Séries","download":"Download","word":"Word","pdf":"PDF","noSavedReport":"Aucun log sauvé.","noReport":"Aucun log","date":"Date","startTime":"Heure début","duration":"Durée","total":"Total","exercise":"Exercice","everMax":"Apex","maxToday":"Max AUJ","sharePlan":"Envoi plan","sharePlanLink":"Envoi plan-lien","sharePlanLinkUnavailable":"Disponible dans la version App Store","directLinkComingSoon":"PLAN-Link prêt.","planLinkReady":"Lien Plan prêt","planLinkCopied":"Lien Plan copié","planLinkTooLarge":"Plan trop grand pour le lien - utiliser le fichier Plan","savePlan":"Archive plan","insertPlan":"Import plan","saveReport":"Archive log","shareReport":"Envoi log","saveAllData":"Backup","restoreAllData":"Restaurer","deleteData":"Effacer data","mgmtShareSaveTitle":"Partage et enregistrement","mgmtDataTitle":"Sauvegarde et importation des données","mgmtDangerTitle":"Zone dangereuse","supportTitle":"Soutenir Easy Gym","supportIntro":"Cette version d’Easy Gym est gratuite. Si elle vous plaît — chaque don aide — merci.","confirmInsert":"Insert will override Plans - confirm","confirmRestore":"Restore will replace All Data - confirm","confirmDelete":"Delete will erase All Data - confirm","theme":"Thème","themeToast":"Thème: ","planSaved":"Plan sauvé","reportSaved":"Log sauvé","allDataSaved":"Toutes les données sauvées","shared":"Partagé","fileSaved":"Fichier sauvé","planInserted":"Plan inséré","dataRestored":"Données restaurées","dataDeleted":"Données supprimées","insertFailed":"Insertion échouée","restoreFailed":"Restauration échouée","importFailed":"Import échoué","trainingSaved":"Training sauvé","exerciseRemovedPlan":"Exercice supprimé du Plan","exerciseListSaved":"Liste d’exercices sauvée","addFirst":"Ajoute d’abord des exercices au training du jour","resumeTraining":"Reprendre training","noExercisesYet":"Aucun exercice. Tape “+ EXERCICE”.","noTrainingPlanned":"Aucun training prévu pour ce jour. Crée-le d’abord dans Plan.","reportHeader":"Exercice / P-KG / D-KG / P-Rép. / D-Rép. / P-Séries / D-Séries","aboutHtml":"<div class=\"app-view-container\"><div class=\"app-info-section\"><div class=\"app-group-title\">Avant-propos</div><div class=\"app-group-card app-preface-card\"><div class=\"app-list-row app-preface-row\"><div class=\"app-row-left-group\"><p class=\"app-global-desc app-preface-body\">J’ai créé Easy Gym pour mon propre entraînement sérieux. C’est un tracker d’entraînement sans publicité ni abonnement. Créez votre PLAN, démarrez votre entraînement dans GO et conservez chaque résultat dans LOG — le tout sur votre téléphone. Vous pouvez aider en partageant l’app, en la notant dans l’App Store ou en envoyant vos commentaires. Contact : <span class=\"em-keyword\">arthur.stivenson@gmail.com</span> Plus d’informations sur <span class=\"em-keyword\">www.easygym.ch</span>.</p></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">Guide d’utilisation</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><rect height=\"15\" rx=\"2.5\" width=\"17\" x=\"3.5\" y=\"5.5\"></rect><path d=\"M7.5 3.5v4M16.5 3.5v4M3.5 9.5h17\"></path><path d=\"M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">PLAN</span><span class=\"app-global-desc\">Créez un plan pour n’importe quelle date. Utilisez <strong class=\"em-keyword\">+ EXERCICE</strong> pour ajouter des exercices avec KG, répétitions et séries. Utilisez <strong class=\"em-keyword\">ÉLIMINER</strong> pour supprimer des exercices. Enregistrez le plan lorsqu’il est prêt.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"m10 8 6 4-6 4z\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">GO</span><span class=\"app-global-desc\">Démarrez à partir d’un PLAN enregistré. Vous pouvez ajuster les KG, répétitions et séries pendant la séance ou ajouter un autre <strong class=\"em-keyword\">+ EXERCICE</strong>. Votre PLAN d’origine reste inchangé pour la prochaine fois.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M4.5 8.5V4.5h4\"></path><path d=\"M5 7a8.5 8.5 0 1 1-1.1 8\"></path><path d=\"M12 7.5V12l3 2\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">LOG</span><span class=\"app-global-desc\">Comparez les objectifs planifiés avec vos résultats réels. Les séries terminées sont marquées en vert. Enregistrez ou partagez votre LOG final.</span></div></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">Gestion &amp; partage</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M9.5 14.5 14.5 9.5\"></path><path d=\"M7.8 16.2 6.4 17.6a3.5 3.5 0 0 1-5-5l3.1-3.1a3.5 3.5 0 0 1 5 0\"></path><path d=\"m16.2 7.8 1.4-1.4a3.5 3.5 0 1 1 5 5l-3.1 3.1a3.5 3.5 0 0 1-5 0\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Partager le plan comme lien</span><span class=\"app-global-desc\">Le Plan-Link sera disponible dans Easy Gym depuis l’App Store.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 15.5V3\"></path><path d=\"m7.5 7.5 4.5-4.5 4.5 4.5\"></path><path d=\"M8 9.5H6.5A2.5 2.5 0 0 0 4 12v6.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V12a2.5 2.5 0 0 0-2.5-2.5H16\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Partager un fichier PLAN ou LOG</span><span class=\"app-global-desc\">Lorsque vous partagez un fichier, nous créons un lien sécurisé que vous pouvez envoyer par WhatsApp ou d’autres messageries.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M6 3.5h8l4 4V20.5H6z\"></path><path d=\"M14 3.5v4h4M9 12h6M9 15.5h6\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Enregistrer un fichier ou LOG</span><span class=\"app-global-desc\">L’enregistre localement sur votre appareil.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 3.5v11\"></path><path d=\"m7.5 10 4.5 4.5 4.5-4.5\"></path><path d=\"M4.5 18v2.5h15V18\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Insérer un fichier PLAN</span><span class=\"app-global-desc\">Importe dans Easy Gym un fichier PLAN reçu.</span></div></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">Système &amp; sécurité</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M7 18.5H5.8A3.8 3.8 0 0 1 5.2 11 6.5 6.5 0 0 1 17.8 9a4.6 4.6 0 0 1 .4 9.2H17\"></path><path d=\"M12 20.5v-9\"></path><path d=\"m8.5 15 3.5-3.5 3.5 3.5\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">BACKUP</span><span class=\"app-global-desc\">Backup enregistre une copie complète. Restaurer récupère vos données. Effacer les données supprime tout après confirmation.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 3.2 19 6v5.2c0 4.5-2.8 8-7 9.6-4.2-1.6-7-5.1-7-9.6V6z\"></path><path d=\"m8.8 12 2.1 2.1 4.4-4.5\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">CONFIDENTIALITÉ</span><span class=\"app-global-desc\">Easy Gym fonctionne sur votre téléphone. Vos plans et LOGs restent sur votre appareil, sauf si vous les partagez.</span></div></div></div></div></div></div>","supportShareTitle":"Partager l’app","supportShareText":"Partager avec des partenaires d’entraînement","supportRateTitle":"Noter dans l’App Store","supportRateText":"Laissez-nous un avis","supportFeedbackTitle":"Avis & problèmes","supportFeedbackText":"Signaler une erreur ou proposer une idée","supportContactTitle":"Nous contacter","supportContactText":"arthur.stivenson@gmail.com","shareApp":"Partager l’app","rateApp":"Noter l’app","sendFeedback":"Envoyer un commentaire","supportContact":"Contact","supportShareMessage":"Easy Gym — entraînement ciblé sans publicité ni abonnement. https://easygym.ch","reviewUnavailable":"La page App Store n’a pas pu être ouverte.","feedbackSubject":"Commentaires sur Easy Gym","printReport":"Imprimer le LOG","printFailed":"L’impression n’a pas pu démarrer.","supportDonateGroupTitle":"Faire un don","supportDonateTitle":"Soutenir Easy Gym","supportDonateText":"Un don volontaire aide à maintenir et à améliorer la PWA gratuite.","supportDonateQrTitle":"Utiliser une app bancaire suisse","supportDonateQrText":"Montant : libre","supportDonateMessage":"Message : Easy Gym","supportDonateDownload":"Télécharger le QR suisse","supportAccountHolder":"Titulaire du compte","supportIban":"IBAN","supportSwift":"SWIFT/BIC","supportAccountNumber":"Numéro de compte","supportClearingNumber":"Clearing Nr","supportBank":"Banque","supportDonateAlt":"Code QR de paiement suisse","supportDonateAmount":"Message : Easy Gym","dialogCancel":"Annuler","dialogOk":"OK","confirmDeleteTitle":"Supprimer toutes les données ?","confirmDeleteMessage":"Cela effacera tous les plans et LOGs et ne pourra être annulé qu’avec une sauvegarde.","confirmDeleteAction":"Supprimer les données","confirmInsertTitle":"Remplacer les plans existants ?","confirmInsertMessage":"L’importation de ce fichier remplacera les plans actuellement enregistrés dans Easy Gym.","confirmInsertAction":"Insérer le plan","confirmRestoreTitle":"Restaurer toutes les données ?","confirmRestoreMessage":"La restauration de cette sauvegarde remplacera toutes les données Easy Gym actuelles sur cet appareil.","confirmRestoreAction":"Restaurer","sharePlanUnsupportedTitle":"Partage du PLAN indisponible","sharePlanUnsupportedMessage":"Le partage de fichiers n’est pas pris en charge par ce navigateur. Utilisez plutôt « Enregistrer le plan »."},"exercises":{"Snatch":"Arraché","Clean and Jerk":"Épaulé-jeté","Clean":"Épaulé","Jerk":"Jeté","Power Snatch":"Arraché puissance","Power Clean":"Épaulé puissance","Back Squat":"Squat arrière","Front Squat":"Squat avant","Overhead Squat":"Squat au-dessus de la tête","Deadlift":"Soulevé de terre","Bench Press":"Développé couché","Push Press":"Développé avec jambes","Strict Press":"Développé strict","Barbell Row":"Rowing barre","Pull-up":"Traction","Dip":"Dips","Lunge":"Fente","Romanian Deadlift":"Soulevé de terre roumain"}},"it":{"code":"it","ui":{"langName":"Italiano","days":{"mon":"Lun","tue":"Mar","wed":"Mer","thu":"Gio","fri":"Ven","sat":"Sab","sun":"Dom"},"months":["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"],"plan":"PLAN","do":"GO","report":"LOG","manage":"gest.","donate":"supporto","about":"info","selectDay":"Scegli giorno","addExercise":"ESERCIZIO","remove":"elimina","copy":"Copia","copied":"Copiato","paste":"Incolla","saveTraining":"Salva training","saved":"Salvato","startTraining":"Inizia training","mass":"Mass","time":"Tempo","started":"Iniziato","stopSaveTraining":"Ferma e salva training","done":"Fatto","activateTraining":"Attiva training","plannedNotTrained":"Pianificato · non allenato","noTrainingDay":"Nessun training in questo giorno.","tapAddExercise":"Tocca “+ ESERCIZIO” per creare il training del giorno.","noSavedPlan":"Nessun piano salvato per questo giorno.","noCompletedExercises":"Nessun esercizio completato.","chooseExercise":"Scegli esercizio","editExercises":"Modifica esercizi","save":"Salva","modalSave":"SALVA","delete":"elimina","writeOwnExercise":"Scrivi il tuo esercizio","kg":"KG","reps":"Rip.","sets":"Serie","download":"Download","word":"Word","pdf":"PDF","noSavedReport":"Nessun log salvato.","noReport":"Nessun log","date":"Data","startTime":"Ora inizio","duration":"Durata","total":"Total","exercise":"Esercizio","everMax":"Apex","maxToday":"Max OGG","sharePlan":"Invio plan","sharePlanLink":"Invio plan-link","sharePlanLinkUnavailable":"Disponibile nella versione App Store","directLinkComingSoon":"PLAN-Link pronto.","planLinkReady":"Link Plan pronto","planLinkCopied":"Link Plan copiato","planLinkTooLarge":"Plan troppo grande per il link - usa file Plan","savePlan":"Archivio plan","insertPlan":"Import plan","saveReport":"Archivio log","shareReport":"Invio log","saveAllData":"Backup","restoreAllData":"Ripristina","deleteData":"Elimina dati","mgmtShareSaveTitle":"Condivisione e salvataggio","mgmtDataTitle":"Backup e importazione dati","mgmtDangerTitle":"Zona pericolosa","supportTitle":"Sostieni Easy Gym","supportIntro":"Questa versione di Easy Gym è gratuita. Se ti piace — ogni donazione aiuta — grazie.","confirmInsert":"Insert will override Plans - confirm","confirmRestore":"Restore will replace All Data - confirm","confirmDelete":"Delete will erase All Data - confirm","theme":"Tema","themeToast":"Tema: ","planSaved":"Plan salvato","reportSaved":"Log salvato","allDataSaved":"Tutti i dati salvati","shared":"Condiviso","fileSaved":"File salvato","planInserted":"Plan inserito","dataRestored":"Dati ripristinati","dataDeleted":"Dati eliminati","insertFailed":"Inserimento fallito","restoreFailed":"Ripristino fallito","importFailed":"Import fallito","trainingSaved":"Training salvato","exerciseRemovedPlan":"Esercizio rimosso dal Plan","exerciseListSaved":"Lista esercizi salvata","addFirst":"Aggiungi prima esercizi al training di oggi","resumeTraining":"Riprendi training","noExercisesYet":"Nessun esercizio. Tocca “+ ESERCIZIO”.","noTrainingPlanned":"Nessun training pianificato per questo giorno. Crealo prima in Plan.","reportHeader":"Esercizio / P-KG / D-KG / P-Rip. / D-Rip. / P-Serie / D-Serie","aboutHtml":"<div class=\"app-view-container\"><div class=\"app-info-section\"><div class=\"app-group-title\">Prefazione</div><div class=\"app-group-card app-preface-card\"><div class=\"app-list-row app-preface-row\"><div class=\"app-row-left-group\"><p class=\"app-global-desc app-preface-body\">Ho creato Easy Gym per il mio allenamento serio. È un tracker di allenamento senza pubblicità e senza abbonamenti. Prepara il tuo PLAN, avvia l’allenamento in GO e conserva ogni risultato nel LOG — tutto sul tuo telefono. Puoi aiutare condividendo l’app, valutandola nell’App Store o inviando un feedback. Contatto: <span class=\"em-keyword\">arthur.stivenson@gmail.com</span> Maggiori informazioni su <span class=\"em-keyword\">www.easygym.ch</span>.</p></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">Guida utente</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><rect height=\"15\" rx=\"2.5\" width=\"17\" x=\"3.5\" y=\"5.5\"></rect><path d=\"M7.5 3.5v4M16.5 3.5v4M3.5 9.5h17\"></path><path d=\"M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">PLAN</span><span class=\"app-global-desc\">Crea un plan per qualsiasi data. Usa <strong class=\"em-keyword\">+ ESERCIZIO</strong> per aggiungere esercizi con KG, ripetizioni e serie. Usa <strong class=\"em-keyword\">ELIMINA</strong> per rimuovere esercizi. Salva il plan quando è pronto.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"m10 8 6 4-6 4z\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">GO</span><span class=\"app-global-desc\">Parti da un PLAN salvato. Puoi modificare KG, ripetizioni e serie durante la sessione o aggiungere un altro <strong class=\"em-keyword\">+ ESERCIZIO</strong>. Il tuo PLAN originale resta invariato per la prossima volta.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M4.5 8.5V4.5h4\"></path><path d=\"M5 7a8.5 8.5 0 1 1-1.1 8\"></path><path d=\"M12 7.5V12l3 2\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">LOG</span><span class=\"app-global-desc\">Confronta gli obiettivi pianificati con i risultati reali. I set completati sono indicati in verde. Salva o condividi il LOG finale.</span></div></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">Gestione e condivisione</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M9.5 14.5 14.5 9.5\"></path><path d=\"M7.8 16.2 6.4 17.6a3.5 3.5 0 0 1-5-5l3.1-3.1a3.5 3.5 0 0 1 5 0\"></path><path d=\"m16.2 7.8 1.4-1.4a3.5 3.5 0 1 1 5 5l-3.1 3.1a3.5 3.5 0 0 1-5 0\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Condividi PLAN come link</span><span class=\"app-global-desc\">Plan-Link sarà disponibile in Easy Gym dall’App Store.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 15.5V3\"></path><path d=\"m7.5 7.5 4.5-4.5 4.5 4.5\"></path><path d=\"M8 9.5H6.5A2.5 2.5 0 0 0 4 12v6.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V12a2.5 2.5 0 0 0-2.5-2.5H16\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Condividi file PLAN o LOG</span><span class=\"app-global-desc\">Quando condividi un file, creiamo un link sicuro che puoi inviare tramite WhatsApp o altri messenger.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M6 3.5h8l4 4V20.5H6z\"></path><path d=\"M14 3.5v4h4M9 12h6M9 15.5h6\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Salva file o LOG</span><span class=\"app-global-desc\">Lo salva localmente sul tuo dispositivo.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 3.5v11\"></path><path d=\"m7.5 10 4.5 4.5 4.5-4.5\"></path><path d=\"M4.5 18v2.5h15V18\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Inserisci file PLAN</span><span class=\"app-global-desc\">Importa in Easy Gym un file PLAN ricevuto.</span></div></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">Sistema e sicurezza</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M7 18.5H5.8A3.8 3.8 0 0 1 5.2 11 6.5 6.5 0 0 1 17.8 9a4.6 4.6 0 0 1 .4 9.2H17\"></path><path d=\"M12 20.5v-9\"></path><path d=\"m8.5 15 3.5-3.5 3.5 3.5\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">BACKUP</span><span class=\"app-global-desc\">Backup salva una copia completa. Ripristina recupera i tuoi dati. Elimina dati cancella tutto dopo la conferma.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 3.2 19 6v5.2c0 4.5-2.8 8-7 9.6-4.2-1.6-7-5.1-7-9.6V6z\"></path><path d=\"m8.8 12 2.1 2.1 4.4-4.5\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">PRIVACY</span><span class=\"app-global-desc\">Easy Gym funziona sul tuo telefono. I tuoi plan e LOG restano sul dispositivo, a meno che tu non li condivida.</span></div></div></div></div></div></div>","supportShareTitle":"Condividi app","supportShareText":"Condividi con i compagni di allenamento","supportRateTitle":"Valuta nell’App Store","supportRateText":"Lasciaci una recensione","supportFeedbackTitle":"Feedback & problemi","supportFeedbackText":"Segnala errori o suggerisci idee","supportContactTitle":"Contattaci","supportContactText":"arthur.stivenson@gmail.com","shareApp":"Condividi app","rateApp":"Valuta app","sendFeedback":"Invia feedback","supportContact":"Contatto","supportShareMessage":"Easy Gym — allenamento mirato senza pubblicità né abbonamenti. https://easygym.ch","reviewUnavailable":"Non è stato possibile aprire la pagina dell’App Store.","feedbackSubject":"Feedback su Easy Gym","printReport":"Stampa LOG","printFailed":"Impossibile avviare la stampa.","supportDonateGroupTitle":"Dona","supportDonateTitle":"Sostieni Easy Gym","supportDonateText":"Una donazione volontaria aiuta a mantenere e migliorare la PWA gratuita.","supportDonateQrTitle":"Usa un’app bancaria svizzera","supportDonateQrText":"Importo: libero","supportDonateMessage":"Messaggio: Easy Gym","supportDonateDownload":"Scarica QR svizzero","supportAccountHolder":"Titolare del conto","supportIban":"IBAN","supportSwift":"SWIFT/BIC","supportAccountNumber":"Numero conto","supportClearingNumber":"Clearing Nr","supportBank":"Banca","supportDonateAlt":"Codice QR di pagamento svizzero","supportDonateAmount":"Messaggio: Easy Gym","dialogCancel":"Annulla","dialogOk":"OK","confirmDeleteTitle":"Eliminare tutti i dati?","confirmDeleteMessage":"Questo cancellerà tutti i piani e i LOG e potrà essere annullato solo con un backup.","confirmDeleteAction":"Elimina dati","confirmInsertTitle":"Sostituire i piani esistenti?","confirmInsertMessage":"L’importazione di questo file sovrascriverà i piani attualmente salvati in Easy Gym.","confirmInsertAction":"Inserisci piano","confirmRestoreTitle":"Ripristinare tutti i dati?","confirmRestoreMessage":"Il ripristino di questo backup sostituirà tutti i dati Easy Gym attualmente presenti su questo dispositivo.","confirmRestoreAction":"Ripristina","sharePlanUnsupportedTitle":"Condivisione PLAN non disponibile","sharePlanUnsupportedMessage":"La condivisione dei file non è supportata da questo browser. Usa invece «Salva piano»."},"exercises":{"Snatch":"Strappo","Clean and Jerk":"Slancio","Clean":"Girata","Jerk":"Spinta","Power Snatch":"Strappo in piedi","Power Clean":"Girata in piedi","Back Squat":"Squat posteriore","Front Squat":"Squat frontale","Overhead Squat":"Squat overhead","Deadlift":"Stacco da terra","Bench Press":"Panca piana","Push Press":"Push press","Strict Press":"Military press","Barbell Row":"Rematore con bilanciere","Pull-up":"Trazione","Dip":"Dip","Lunge":"Affondo","Romanian Deadlift":"Stacco rumeno"}},"es":{"code":"es","ui":{"langName":"Español","days":{"mon":"Lun","tue":"Mar","wed":"Mié","thu":"Jue","fri":"Vie","sat":"Sáb","sun":"Dom"},"months":["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],"plan":"PLAN","do":"GO","report":"LOG","manage":"gest.","donate":"apoyo","about":"info","selectDay":"Elegir día","addExercise":"EJERCICIO","remove":"eliminar","copy":"Copiar","copied":"Copiado","paste":"Pegar","saveTraining":"Guardar training","saved":"Guardado","startTraining":"Iniciar training","mass":"Mass","time":"Tiempo","started":"Iniciado","stopSaveTraining":"Parar y guardar training","done":"Hecho","activateTraining":"Activar training","plannedNotTrained":"Planificado · no entrenado","noTrainingDay":"Sin training este día.","tapAddExercise":"Toca “+ EJERCICIO” para crear el training del día.","noSavedPlan":"No hay plan guardado para este día.","noCompletedExercises":"No hay ejercicios completados.","chooseExercise":"Elegir ejercicio","editExercises":"Editar","save":"Guardar","modalSave":"GUARDAR","delete":"eliminar","writeOwnExercise":"Escribe tu ejercicio","kg":"KG","reps":"Reps","sets":"Series","download":"Download","word":"Word","pdf":"PDF","noSavedReport":"Todavía no hay log guardado.","noReport":"Sin log","date":"Fecha","startTime":"Hora inicio","duration":"Duración","total":"Total","exercise":"Ejercicio","everMax":"Apex","maxToday":"Max HOY","sharePlan":"Envio plan","sharePlanLink":"Envio plan-link","sharePlanLinkUnavailable":"Disponible en la versión de App Store","directLinkComingSoon":"PLAN-Link listo.","planLinkReady":"Enlace Plan listo","planLinkCopied":"Enlace Plan copiado","planLinkTooLarge":"Plan demasiado grande para enlace - usa archivo Plan","savePlanFirst":"Primero guarda un Plan","creatingPlanLink":"Creando enlace del Plan","copyPlanLinkPrompt":"Copia este enlace del Plan","savePlan":"Archivo plan","insertPlan":"Import plan","saveReport":"Archivo log","shareReport":"Envio log","saveAllData":"Backup","restoreAllData":"Restaurar","deleteData":"Eliminar datos","mgmtShareSaveTitle":"Compartir y guardar","mgmtDataTitle":"Copias de seguridad e importación","mgmtDangerTitle":"Zona de peligro","supportTitle":"Apoya Easy Gym","supportIntro":"Esta versión de Easy Gym es gratuita. Si te gusta — cualquier donación ayuda — gracias.","confirmInsert":"Insert will override Plans - confirm","confirmRestore":"Restore will replace All Data - confirm","confirmDelete":"Delete will erase All Data - confirm","theme":"Tema","themeToast":"Tema: ","planSaved":"Plan guardado","reportSaved":"Log guardado","allDataSaved":"Todos los datos guardados","shared":"Compartido","fileSaved":"Archivo guardado","planInserted":"Plan insertado","dataRestored":"Datos restaurados","dataDeleted":"Datos eliminados","insertFailed":"Inserción fallida","restoreFailed":"Restauración fallida","importFailed":"Importación fallida","trainingSaved":"Training guardado","exerciseRemovedPlan":"Ejercicio eliminado del Plan","exerciseListSaved":"Lista de ejercicios guardada","addFirst":"Añade primero ejercicios al training de hoy","resumeTraining":"Continuar training","noExercisesYet":"Sin ejercicios. Toca “+ EJERCICIO”.","noTrainingPlanned":"No hay training planificado para este día. Créalo primero en Plan.","reportHeader":"Ejercicio / P-KG / D-KG / P-Reps / D-Reps / P-Series / D-Series","aboutHtml":"<div class=\"app-view-container\"><div class=\"app-info-section\"><div class=\"app-group-title\">Prólogo</div><div class=\"app-group-card app-preface-card\"><div class=\"app-list-row app-preface-row\"><div class=\"app-row-left-group\"><p class=\"app-global-desc app-preface-body\">Creé Easy Gym para mi propio entrenamiento serio. Es un registro de entrenamiento sin publicidad ni suscripciones. Crea tu PLAN, inicia el entrenamiento en GO y guarda cada resultado en LOG — todo en tu teléfono. Puedes ayudar compartiendo la app, valorándola en el App Store o enviando comentarios. Contacto: <span class=\"em-keyword\">arthur.stivenson@gmail.com</span> Más información en <span class=\"em-keyword\">www.easygym.ch</span>.</p></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">Guía del usuario</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><rect height=\"15\" rx=\"2.5\" width=\"17\" x=\"3.5\" y=\"5.5\"></rect><path d=\"M7.5 3.5v4M16.5 3.5v4M3.5 9.5h17\"></path><path d=\"M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">PLAN</span><span class=\"app-global-desc\">Crea un plan para cualquier fecha. Usa <strong class=\"em-keyword\">+ EJERCICIO</strong> para añadir ejercicios con KG, repeticiones y series. Usa <strong class=\"em-keyword\">ELIMINAR</strong> para quitar ejercicios. Guarda el plan cuando esté listo.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><circle cx=\"12\" cy=\"12\" r=\"9\"></circle><path d=\"m10 8 6 4-6 4z\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">GO</span><span class=\"app-global-desc\">Empieza desde un PLAN guardado. Puedes ajustar KG, repeticiones y series durante la sesión o añadir otro <strong class=\"em-keyword\">+ EJERCICIO</strong>. Tu PLAN original queda sin cambios para la próxima vez.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M4.5 8.5V4.5h4\"></path><path d=\"M5 7a8.5 8.5 0 1 1-1.1 8\"></path><path d=\"M12 7.5V12l3 2\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">LOG</span><span class=\"app-global-desc\">Compara los objetivos planificados con tus resultados reales. Las series completadas se marcan en verde. Guarda o comparte tu LOG final.</span></div></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">Gestión y compartir</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M9.5 14.5 14.5 9.5\"></path><path d=\"M7.8 16.2 6.4 17.6a3.5 3.5 0 0 1-5-5l3.1-3.1a3.5 3.5 0 0 1 5 0\"></path><path d=\"m16.2 7.8 1.4-1.4a3.5 3.5 0 1 1 5 5l-3.1 3.1a3.5 3.5 0 0 1-5 0\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Compartir PLAN como enlace</span><span class=\"app-global-desc\">Plan-Link estará disponible en Easy Gym desde el App Store.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 15.5V3\"></path><path d=\"m7.5 7.5 4.5-4.5 4.5 4.5\"></path><path d=\"M8 9.5H6.5A2.5 2.5 0 0 0 4 12v6.5A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5V12a2.5 2.5 0 0 0-2.5-2.5H16\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Compartir archivo PLAN o LOG</span><span class=\"app-global-desc\">Cuando compartes un archivo, creamos un enlace seguro que puedes enviar por WhatsApp u otros mensajeros.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M6 3.5h8l4 4V20.5H6z\"></path><path d=\"M14 3.5v4h4M9 12h6M9 15.5h6\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Guardar archivo o LOG</span><span class=\"app-global-desc\">Lo guarda localmente en tu dispositivo.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 3.5v11\"></path><path d=\"m7.5 10 4.5 4.5 4.5-4.5\"></path><path d=\"M4.5 18v2.5h15V18\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">Insertar archivo PLAN</span><span class=\"app-global-desc\">Importa en Easy Gym un archivo PLAN recibido.</span></div></div></div></div></div><div class=\"app-info-section\"><div class=\"app-group-title\">Sistema y seguridad</div><div class=\"app-group-card\"><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M7 18.5H5.8A3.8 3.8 0 0 1 5.2 11 6.5 6.5 0 0 1 17.8 9a4.6 4.6 0 0 1 .4 9.2H17\"></path><path d=\"M12 20.5v-9\"></path><path d=\"m8.5 15 3.5-3.5 3.5 3.5\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">BACKUP</span><span class=\"app-global-desc\">Backup guarda una copia completa. Restaurar recupera tus datos. Eliminar datos borra todo después de la confirmación.</span></div></div></div><div class=\"app-list-row\"><div class=\"app-row-left-group\"><span aria-hidden=\"true\" class=\"app-global-icon\"><svg viewbox=\"0 0 24 24\"><g><path d=\"M12 3.2 19 6v5.2c0 4.5-2.8 8-7 9.6-4.2-1.6-7-5.1-7-9.6V6z\"></path><path d=\"m8.8 12 2.1 2.1 4.4-4.5\"></path></g></svg></span><div class=\"app-text-column-stack\"><span class=\"app-global-title\">PRIVACIDAD</span><span class=\"app-global-desc\">Easy Gym funciona en tu teléfono. Tus planes y LOGs permanecen en tu dispositivo, a menos que los compartas.</span></div></div></div></div></div></div>","supportShareTitle":"Compartir app","supportShareText":"Compartir con compañeros de entrenamiento","supportRateTitle":"Valorar en el App Store","supportRateText":"Déjanos una reseña","supportFeedbackTitle":"Comentarios y problemas","supportFeedbackText":"Informa de errores o sugiere ideas","supportContactTitle":"Contáctanos","supportContactText":"arthur.stivenson@gmail.com","shareApp":"Compartir app","rateApp":"Valorar app","sendFeedback":"Enviar comentarios","supportContact":"Contacto","supportShareMessage":"Easy Gym — entrenamiento enfocado sin anuncios ni suscripciones. https://easygym.ch","reviewUnavailable":"No se pudo abrir la página del App Store.","feedbackSubject":"Comentarios sobre Easy Gym","printReport":"Imprimir LOG","printFailed":"No se pudo iniciar la impresión.","supportDonateGroupTitle":"Donar","supportDonateTitle":"Apoya Easy Gym","supportDonateText":"Una donación voluntaria ayuda a mantener y mejorar la PWA gratuita.","supportDonateQrTitle":"Usa una app bancaria suiza","supportDonateQrText":"Importe: libre","supportDonateMessage":"Mensaje: Easy Gym","supportDonateDownload":"Descargar QR suizo","supportAccountHolder":"Titular de la cuenta","supportIban":"IBAN","supportSwift":"SWIFT/BIC","supportAccountNumber":"Número de cuenta","supportClearingNumber":"Clearing Nr","supportBank":"Banco","supportDonateAlt":"Código QR de pago suizo","supportDonateAmount":"Mensaje: Easy Gym","dialogCancel":"Cancelar","dialogOk":"OK","confirmDeleteTitle":"¿Eliminar todos los datos?","confirmDeleteMessage":"Esto borrará todos los planes y LOGs y solo podrá deshacerse con una copia de seguridad.","confirmDeleteAction":"Eliminar datos","confirmInsertTitle":"¿Reemplazar los planes existentes?","confirmInsertMessage":"Al importar este archivo se sobrescribirán los planes guardados actualmente en Easy Gym.","confirmInsertAction":"Insertar plan","confirmRestoreTitle":"¿Restaurar todos los datos?","confirmRestoreMessage":"Al restaurar esta copia de seguridad se reemplazarán todos los datos actuales de Easy Gym en este dispositivo.","confirmRestoreAction":"Restaurar","sharePlanUnsupportedTitle":"Compartir PLAN no disponible","sharePlanUnsupportedMessage":"Este navegador no admite compartir archivos. Usa «Guardar plan» en su lugar."},"exercises":{"Snatch":"Arrancada","Clean and Jerk":"Dos tiempos","Clean":"Cargada","Jerk":"Envión","Power Snatch":"Arrancada de potencia","Power Clean":"Cargada de potencia","Back Squat":"Sentadilla trasera","Front Squat":"Sentadilla frontal","Overhead Squat":"Sentadilla sobre la cabeza","Deadlift":"Peso muerto","Bench Press":"Press de banca","Push Press":"Push press","Strict Press":"Press estricto","Barbell Row":"Remo con barra","Pull-up":"Dominada","Dip":"Fondos","Lunge":"Zancada","Romanian Deadlift":"Peso muerto rumano"}}};
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
  const DEV_BUILD = 'v292X-PWA-restored-utility-uppercase-kg-empty-go';
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
  function cacheEls(){ ['planDayButtons','planChooseHint','planActionRow','savePlanRow','trainDayButtons','planList','trainList','planTitle','trainControls','savePlanBtn','removeSelectedBtn','copyPlanBtn','activatePlanBtn','saveTrainingBtn','startTrainingBtn','timerText','addExerciseModal','libraryList','customExerciseName','addCustomExerciseBtn','editExercisesBtn','saveLibraryBtn','deleteLibraryBtn','customRow','exerciseModalHelp','journalList','downloadWordBtn','downloadPdfBtn','sharePlanBtn','sharePlanLinkBtn','manageSavePlanBtn','insertPlanBtn','insertPlanInput','manageSaveReportBtn','shareReportBtn','printReportBtn','saveAllDataBtn','restoreAllDataBtn','restoreAllDataInput','deleteDataBtn','easyGymDialog','easyGymDialogCard','easyGymDialogTitle','easyGymDialogMessage','easyGymDialogCancel','easyGymDialogConfirm','toast','homeTodayCard','homeStartBtn','homeGreeting','aboutContent','languageSelect','languageSwitch','languageMenu'].forEach(id=>els[id]=$(id)); }
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
    setMgmtRowText('sharePlanBtn','sharePlan'); setMgmtRowText('sharePlanLinkBtn','sharePlanLink'); setText('sharePlanLinkDesc','sharePlanLinkUnavailable'); setMgmtRowText('manageSavePlanBtn','savePlan'); setMgmtRowText('manageSaveReportBtn','saveReport'); setMgmtRowText('shareReportBtn','shareReport'); setMgmtRowText('printReportBtn','printReport'); setMgmtRowText('insertPlanBtn','insertPlan'); setMgmtRowText('saveAllDataBtn','saveAllData'); setMgmtRowText('restoreAllDataBtn','restoreAllData'); setMgmtRowText('deleteDataBtn','deleteData');
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
    if(els.aboutContent) els.aboutContent.innerHTML=t('aboutHtml');
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
    els.sharePlanBtn.addEventListener('click', sharePlan);
    els.manageSavePlanBtn.addEventListener('click', savePlanFile);
    els.insertPlanBtn.addEventListener('click',()=>els.insertPlanInput.click());
    els.insertPlanInput.addEventListener('change', insertPlanFile);
    els.manageSaveReportBtn.addEventListener('click', saveReportFile);
    els.shareReportBtn.addEventListener('click', shareReport);
    els.printReportBtn.addEventListener('click', executeNativePrintExport);
    els.saveAllDataBtn.addEventListener('click', saveAllDataFile);
    els.restoreAllDataBtn.addEventListener('click',()=>els.restoreAllDataInput.click());
    els.restoreAllDataInput.addEventListener('change', restoreAllDataFile);
    els.deleteDataBtn.addEventListener('click', deleteAllData);
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
        return sum+(kg*completed);
      },0);
    }
    const saved=journalForDate(iso);
    return (saved&&saved.exercises||[]).reduce((sum,exercise)=>sum+(exercise.sets||[]).reduce((rowSum,row)=>{
      const completed=Math.max(0,Number(row.sets)||0);
      const kg=Math.max(0,Number(row.kg)||0);
      return rowSum+(kg*completed);
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
    const sig=['v230X',currentLang, today, [...sets.trained].sort().join(','), [...sets.planned].sort().join(',')].join('|');
    if(el.dataset.sig!==sig){
      const prev = el.children.length ? el.scrollLeft : null;
      const N=365; const base=new Date(); base.setHours(0,0,0,0);
      let html='';
      for(let off=-N; off<=N; off++){
        const dt=new Date(base.getFullYear(),base.getMonth(),base.getDate()+off); const iso=isoOf(dt);
        const trained=sets.trained.has(iso); const planned=sets.planned.has(iso);
        const cls=['day-link','with-date','calendar-day',iso===today?'is-today':'',trained?'trained':(planned?'planned':'')].filter(Boolean).join(' ');
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
          <div class="control-box cell-interactive x-go-action-cell row-interactive-cell"><button class="x-check-btn uniform-digit ${complete?'completed':(checked>0?'partial':'')}" type="button" data-x-set-progress="${esc(item.sessionId)}" ${disabled?'disabled':''} aria-label="${esc(t('sets'))}: ${checked}/${total}"><span>${progress}</span></button></div>
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
        ? formatDuration(Date.now()-Number(trainStartTimes[iso]))
        : formatDuration(Math.max(0,Number(durationMs)||0));
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
      if(isTrainLocked())return; const it=findTrain(btn.dataset.xSetProgress); if(!it)return;
      const total=Math.max(0,Math.floor(Number(it.sets)||0)); if(!total)return;
      const checked=Math.max(0,Number(it.checked)||0); it.checked=checked>=total?0:checked+1;
      if(it.trainAdded && it.checked>0) it.addedStarted=true;
      updateTrainItemPerformanceStatus(it);
      saveAll(); renderTrain();
    }));
    els.trainList.querySelectorAll('[data-set-n]').forEach(btn=>btn.addEventListener('click',()=>{if(isTrainLocked())return; const card=btn.closest('[data-card-id]'); const it=findTrain(card.dataset.cardId); if(!it)return; const n=Number(btn.dataset.setN); it.checked = Number(it.checked)>=n ? n-1 : n; if(it.trainAdded && it.checked>0){it.addedStarted=true;} updateTrainItemPerformanceStatus(it); saveAll(); renderTrain();}));
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
  function renderProgress(){
    const groups = progressGroups();
    const hasProgress = journal.length>0;
    const actions=$('progressActions');
    if(actions) actions.classList.toggle('is-hidden', !hasProgress);
    els.downloadWordBtn.disabled=!hasProgress;
    els.downloadPdfBtn.disabled=!hasProgress;
    if(!hasProgress){els.journalList.innerHTML=`<div class="empty exercise-typography-empty">${esc(t('noSavedReport'))}</div>`;return;}
    els.journalList.innerHTML = groups.map(g=>`<section class="log-workout-group">
      <div class="log-workout-meta" aria-label="${esc(t('report'))}">
        <div class="log-meta-cell"><span class="log-meta-label">${esc(t('date'))}</span><span class="log-meta-value">${esc(g.date)}</span></div>
        <div class="log-meta-cell"><span class="log-meta-label">${esc(t('startTime'))}</span><span class="log-meta-value">${esc(g.startTime)}</span></div>
        <div class="log-meta-cell"><span class="log-meta-label">${esc(t('duration'))}</span><span class="log-meta-value">${esc(g.duration)}</span></div>
        <div class="log-meta-cell"><span class="log-meta-label">${esc(t('total'))}</span><span class="log-meta-value">${esc(g.totalWeight)} KG</span></div>
      </div>
      ${g.exercises.map((ex,exerciseIndex)=>`<article class="exercise-card log-history-card">
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
                <div class="horizontal-data-stream">
                  <span class="val-p" data-plan="${esc(reportCell(r.pKg))}">${esc(reportCell(r.pKg))}</span>
                  <span class="data-divider-slash" aria-hidden="true">/</span>
                  <span class="val-d" data-done="${esc(reportCell(r.dKg))}">${esc(reportCell(r.dKg))}</span>
                </div>
                <div class="horizontal-data-stream">
                  <span class="val-p" data-plan="${esc(reportCell(r.pReps))}">${esc(reportCell(r.pReps))}</span>
                  <span class="data-divider-slash" aria-hidden="true">/</span>
                  <span class="val-d" data-done="${esc(reportCell(r.dReps))}">${esc(reportCell(r.dReps))}</span>
                </div>
                <div class="horizontal-data-stream">
                  <span class="val-p" data-plan="${esc(reportCell(r.pSets))}">${esc(reportCell(r.pSets))}</span>
                  <span class="data-divider-slash" aria-hidden="true">/</span>
                  <span class="val-d" data-done="${esc(reportCell(r.dSets))}">${esc(reportCell(r.dSets))}</span>
                </div>
                <div class="action-status-cell">
                  <span class="indicator-icon-clean ${targetHit?'state-hit':'state-missed'}" aria-label="${targetHit?'Target reached':'Target missed'}">${targetHit?'✓':'✕'}</span>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </article>`).join('')}
    </section>`).join('');
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
      return {date:dateDisplay(entry.date), startTime:formatStartTime(entry.startedAt), duration:formatDuration(entry.durationMs), totalWeight:weightText(totalWeight), exercises};
    });
  }
  function progressText(){
    return progressGroups().map(g=>{
      const lines=g.exercises.map(ex=>{
        const setLines=ex.rows.map(r=>`    ${reportCell(r.pKg)} / ${reportCell(r.dKg)} / ${reportCell(r.pReps)} / ${reportCell(r.dReps)} / ${reportCell(r.pSets)} / ${reportCell(r.dSets)}`).join('\n');
        return `  ${displayExerciseName(ex.name)}: ${t('everMax')} ${ex.everMax} KG, ${t('maxToday')} ${ex.todayMax} KG\n${setLines}`;
      }).join('\n');
      return `${g.date} - ${t('startTime')}: ${g.startTime} - ${t('duration')}: ${g.duration} - ${t('total')}: ${g.totalWeight} KG\n${t('reportHeader')}\n${lines}`;
    }).join('\n\n');
  }
  function reportLayoutLabels(){
    const byLang={
      en:{date:'Date',start:'Start Time',duration:'Duration',totalVolume:'Total Volume',weight:'Weight',reps:'Reps',sets:'Sets',status:'Status',targetHit:'Target Hit',hitShort:'Hit',underWeight:'Under planned weight',underReps:'Under planned reps',underSets:'Under planned sets',overTarget:'Above plan',logged:'Logged',reportTitle:'Workout Report',formatNote:'(All values formatted as Plan / Done)'},
      de:{date:'Datum',start:'Startzeit',duration:'Dauer',totalVolume:'Total Volumen',weight:'Gewicht',reps:'Wdh.',sets:'Sätze',status:'Status',targetHit:'Ziel erreicht',hitShort:'Ziel',underWeight:'Unter geplantem Gewicht',underReps:'Unter geplanten Wdh.',underSets:'Unter geplanten Sätzen',overTarget:'Über Plan',logged:'Erfasst',reportTitle:'Trainingsbericht',formatNote:'(Alle Werte als Plan / Gemacht)'},
      fr:{date:'Date',start:'Heure de début',duration:'Durée',totalVolume:'Volume total',weight:'Poids',reps:'Rép.',sets:'Séries',status:'Statut',targetHit:'Objectif atteint',hitShort:'Atteint',underWeight:'Poids sous le plan',underReps:'Rép. sous le plan',underSets:'Séries sous le plan',overTarget:'Au-dessus du plan',logged:'Enregistré',reportTitle:"Rapport d'entraînement",formatNote:'(Toutes les valeurs : Plan / Fait)'},
      it:{date:'Data',start:'Ora inizio',duration:'Durata',totalVolume:'Volume totale',weight:'Peso',reps:'Rip.',sets:'Serie',status:'Stato',targetHit:'Obiettivo raggiunto',hitShort:'Raggiunto',underWeight:'Peso sotto il plan',underReps:'Rip. sotto il plan',underSets:'Serie sotto il plan',overTarget:'Sopra il plan',logged:'Registrato',reportTitle:'Rapporto di allenamento',formatNote:'(Tutti i valori: Plan / Fatto)'},
      es:{date:'Fecha',start:'Hora inicio',duration:'Duración',totalVolume:'Volumen total',weight:'Peso',reps:'Reps',sets:'Series',status:'Estado',targetHit:'Objetivo alcanzado',hitShort:'Logrado',underWeight:'Peso por debajo del plan',underReps:'Reps por debajo del plan',underSets:'Series por debajo del plan',overTarget:'Por encima del plan',logged:'Registrado',reportTitle:'Informe de entrenamiento',formatNote:'(Todos los valores: Plan / Hecho)'}
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
  const REPORT_LOGO_DATA = 'data:image/png;base64,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';
  const MAX_EVER_ICON_DATA = 'data:image/png;base64,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';
  const MAX_TODAY_ICON_DATA = 'data:image/png;base64,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';
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
    [['sharePlanBtn',hasPlan],['manageSavePlanBtn',hasPlan],['manageSaveReportBtn',hasReport],['shareReportBtn',hasReport],['printReportBtn',hasReport],['saveAllDataBtn',hasData],['deleteDataBtn',hasData]].forEach(([id,on])=>{
      const b=els[id]; if(!b)return; b.disabled=!on; b.classList.toggle('disabled',!on);
    });
    if(els.sharePlanLinkBtn){
      els.sharePlanLinkBtn.disabled=true;
      els.sharePlanLinkBtn.setAttribute('aria-disabled','true');
      els.sharePlanLinkBtn.classList.add('disabled');
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
    const confirmed=await showEasyGymDialog({
      title:t('confirmInsertTitle'),
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
  async function insertPlanFile(e){
    const file=e.target.files&&e.target.files[0]; if(!file)return;
    const confirmed=await showEasyGymDialog({
      title:t('confirmInsertTitle'),
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
      normalizeData(); renderAll(); toast(t('dataRestored')); e.target.value='';
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
    weekPlans=emptyDays(); trainSessions=emptyDays(); savedPlanDays={}; journal=[]; exerciseLibrary=[...DEFAULT_LIBRARY]; trainStartTimes={}; datePlans={}; savedDatePlans={}; activeDatePlans={}; backupReady=false; selectedPlanDay=null; selectedTrainDay=null; selectedPlanDate=null; selectedTrainDate=null; savedWorkout=null;
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
