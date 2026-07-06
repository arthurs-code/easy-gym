(() => {
  'use strict';
  const DAYS = ['mon','tue','wed','thu','fri','sat','sun'];
  const DAY_SHORT = {mon:'Mon',tue:'Tue',wed:'Wed',thu:'Thu',fri:'Fri',sat:'Sat',sun:'Sun'};
  const DEFAULT_LIBRARY = ['Snatch','Clean and Jerk','Clean','Jerk','Power Snatch','Power Clean','Back Squat','Front Squat','Overhead Squat','Deadlift','Bench Press','Push Press','Strict Press','Barbell Row','Pull-up','Dip','Lunge','Romanian Deadlift'];
  const EXERCISE_TRANSLATIONS = {
      "de": {
          "Snatch": "Reissen",
          "Clean and Jerk": "Umsetzen & Ausstossen",
          "Clean": "Umsetzen",
          "Jerk": "Ausstossen",
          "Power Snatch": "Standreissen",
          "Power Clean": "Standumsetzen",
          "Back Squat": "Kniebeuge hinten",
          "Front Squat": "Kniebeuge vorne",
          "Overhead Squat": "Überkopfkniebeuge",
          "Deadlift": "Kreuzheben",
          "Bench Press": "Bankdrücken",
          "Push Press": "Schwungdrücken",
          "Strict Press": "Schulterdrücken",
          "Barbell Row": "Langhantelrudern",
          "Pull-up": "Klimmzug",
          "Dip": "Dip",
          "Lunge": "Ausfallschritt",
          "Romanian Deadlift": "Rumänisches Kreuzheben"
      },
      "fr": {
          "Snatch": "Arraché",
          "Clean and Jerk": "Épaulé-jeté",
          "Clean": "Épaulé",
          "Jerk": "Jeté",
          "Power Snatch": "Arraché puissance",
          "Power Clean": "Épaulé puissance",
          "Back Squat": "Squat arrière",
          "Front Squat": "Squat avant",
          "Overhead Squat": "Squat au-dessus de la tête",
          "Deadlift": "Soulevé de terre",
          "Bench Press": "Développé couché",
          "Push Press": "Développé avec jambes",
          "Strict Press": "Développé strict",
          "Barbell Row": "Rowing barre",
          "Pull-up": "Traction",
          "Dip": "Dips",
          "Lunge": "Fente",
          "Romanian Deadlift": "Soulevé de terre roumain"
      },
      "it": {
          "Snatch": "Strappo",
          "Clean and Jerk": "Slancio",
          "Clean": "Girata",
          "Jerk": "Spinta",
          "Power Snatch": "Strappo in piedi",
          "Power Clean": "Girata in piedi",
          "Back Squat": "Squat posteriore",
          "Front Squat": "Squat frontale",
          "Overhead Squat": "Squat overhead",
          "Deadlift": "Stacco da terra",
          "Bench Press": "Panca piana",
          "Push Press": "Push press",
          "Strict Press": "Military press",
          "Barbell Row": "Rematore con bilanciere",
          "Pull-up": "Trazione",
          "Dip": "Dip",
          "Lunge": "Affondo",
          "Romanian Deadlift": "Stacco rumeno"
      },
      "es": {
          "Snatch": "Arrancada",
          "Clean and Jerk": "Dos tiempos",
          "Clean": "Cargada",
          "Jerk": "Envión",
          "Power Snatch": "Arrancada de potencia",
          "Power Clean": "Cargada de potencia",
          "Back Squat": "Sentadilla trasera",
          "Front Squat": "Sentadilla frontal",
          "Overhead Squat": "Sentadilla sobre la cabeza",
          "Deadlift": "Peso muerto",
          "Bench Press": "Press de banca",
          "Push Press": "Push press",
          "Strict Press": "Press estricto",
          "Barbell Row": "Remo con barra",
          "Pull-up": "Dominada",
          "Dip": "Fondos",
          "Lunge": "Zancada",
          "Romanian Deadlift": "Peso muerto rumano"
      }
  };
  const EXERCISE_TO_EN = {};
  Object.values(EXERCISE_TRANSLATIONS).forEach(map=>Object.entries(map).forEach(([en,local])=>{ EXERCISE_TO_EN[local]=en; }));
  const I18N = {
      "en": {
            "langName": "English",
            "days": {
                  "mon": "Mon",
                  "tue": "Tue",
                  "wed": "Wed",
                  "thu": "Thu",
                  "fri": "Fri",
                  "sat": "Sat",
                  "sun": "Sun"
            },
            "months": [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December"
            ],
            "plan": "PLAN",
            "do": "GO",
            "report": "LOG",
            "manage": "mgmt",
            "donate": "heart",
            "about": "info",
            "selectDay": "Select the Day",
            "addExercise": "EXERCISE",
            "remove": "del",
            "copy": "Copy",
            "copied": "Copied",
            "paste": "Paste",
            "saveTraining": "Save training",
            "saved": "Saved",
            "startTraining": "Start Training",
            "started": "Started",
            "stopSaveTraining": "Stop and Save Training",
            "done": "Done",
            "activateTraining": "Activate Training",
            "plannedNotTrained": "Planned · not trained",
            "noTrainingDay": "No training on this day.",
            "tapAddExercise": "Tap “+ EXERCISE” to build this day’s training.",
            "noSavedPlan": "No saved plan for this day.",
            "noCompletedExercises": "No completed exercises.",
            "chooseExercise": "Choose exercise",
            "editExercises": "Edit exercises",
            "save": "Save",
            "modalSave": "SAVE",
            "delete": "del",
            "writeOwnExercise": "Write your own exercise",
            "kg": "KG",
            "reps": "Reps",
            "sets": "Sets",
            "download": "Download",
            "word": "Word",
            "pdf": "PDF",
            "noSavedReport": "No saved LOG yet.",
            "noReport": "No LOG",
            "date": "Date",
            "startTime": "Start Time",
            "duration": "Duration",
            "total": "Total",
            "exercise": "Exercise",
            "everMax": "Ever Max",
            "maxToday": "Max Today",
            "sharePlan": "Share Plan",
            "sharePlanLink": "Share Plan as Link",
            "directLinkComingSoon": "Direct link sharing requires an App Store or Google Play version. This feature is coming soon!",
            "planLinkReady": "Plan link ready",
            "planLinkCopied": "Plan link copied",
            "planLinkTooLarge": "Plan too large for link - use Share Plan file",
            "savePlanFirst": "Save a plan first",
            "creatingPlanLink": "Creating plan link",
            "copyPlanLinkPrompt": "Copy this plan link",
            "savePlan": "Save Plan",
            "insertPlan": "Insert Plan",
            "saveReport": "Save LOG",
            "shareReport": "Share LOG",
            "saveAllData": "Backup",
            "restoreAllData": "Restore",
            "deleteData": "Delete Data",
            "supportTitle": "Support Easy Gym",
            "supportIntro": "Easy Gym is free and ad-free. If it helps your training, a small donation keeps it growing — thank you.",
            "confirmInsert": "Insert will override Plans - confirm",
            "confirmRestore": "Restore will replace All Data - confirm",
            "confirmDelete": "Delete will erase All Data - confirm",
            "theme": "Theme",
            "themeToast": "Theme: ",
            "planSaved": "Plan saved",
            "reportSaved": "LOG saved",
            "allDataSaved": "All data saved",
            "shared": "Shared",
            "fileSaved": "File saved",
            "planInserted": "Plan inserted",
            "dataRestored": "Data restored",
            "dataDeleted": "Data deleted",
            "insertFailed": "Insert failed",
            "restoreFailed": "Restore failed",
            "importFailed": "Import failed",
            "trainingSaved": "Training saved",
            "exerciseRemovedPlan": "Exercise removed from Plan",
            "exerciseListSaved": "Exercise list saved",
            "addFirst": "Add exercises to today’s training first",
            "resumeTraining": "Resume training",
            "noExercisesYet": "No exercises yet. Tap “+ EXERCISE” to build today’s training.",
            "noTrainingPlanned": "No training planned for this day. Create it in Plan first.",
            "reportHeader": "Exercise / P-KG / D-KG / P-Reps / D-Reps / P-Sets / D-Sets",
            "aboutHtml": "<div class=\"card about-card\"><h2>Easy Gym — Plan, Go, Log</h2><p>A free, ad-free training tracker for serious training. Build your PLAN, start your workout in GO, and keep every result in LOG — all on your phone.</p></div><div class=\"card about-card\"><h2>Preface</h2><p>I created Easy Gym for my own training. It is free and has no ads. Like it? Support me with a donation. Want your own app? Write to: arthur.stivenson@gmail.com.</p></div><div class=\"card about-card\"><h2>PLAN</h2><p>Create a plan for any date. Use <strong>+ EXERCISE</strong> to add exercises with kg, reps, and sets. Use <strong>DEL</strong> to remove exercises. Save the plan when it is ready.</p></div><div class=\"card about-card\"><h2>GO</h2><p>Start from a saved PLAN. You can adjust kg, reps, and sets during the workout or add another <strong>+ EXERCISE</strong>. Your original PLAN stays unchanged for next time.</p></div><div class=\"card about-card\"><h2>LOG</h2><p>Compare planned targets with actual results. Completed sets are marked green. Save or share your final training log.</p></div><div class=\"card about-card\"><h2>MGMT &amp; share</h2><p><strong>Share Plan as Link</strong> — Direct link sharing requires an App Store or Google Play version. This feature is coming soon!</p><p><strong>Share Plan File or LOG</strong> — When you share a file, we create a secure link you can send via WhatsApp or other messengers.</p><p><strong>Save File or LOG</strong> — saves it locally.</p><p><strong>Insert Plan File</strong> — imports a received plan file into Easy Gym.</p></div><div class=\"card about-card\"><h2>Backup</h2><p>Backup saves a full copy. Restore recovers your data. Delete Data wipes everything after confirmation.</p></div><div class=\"card about-card\"><h2>Privacy</h2><p>Easy Gym works on your phone. Your plans and logs stay on your device unless you share them.</p></div>"
      },
      "de": {
            "langName": "Deutsch",
            "days": {
                  "mon": "Mo",
                  "tue": "Di",
                  "wed": "Mi",
                  "thu": "Do",
                  "fri": "Fr",
                  "sat": "Sa",
                  "sun": "So"
            },
            "months": [
                  "Januar",
                  "Februar",
                  "März",
                  "April",
                  "Mai",
                  "Juni",
                  "Juli",
                  "August",
                  "September",
                  "Oktober",
                  "November",
                  "Dezember"
            ],
            "plan": "PLAN",
            "do": "GO",
            "report": "LOG",
            "manage": "orga",
            "donate": "herz",
            "about": "info",
            "selectDay": "Tag wählen",
            "addExercise": "ÜBUNG",
            "remove": "löschen",
            "copy": "Kopieren",
            "copied": "Kopiert",
            "paste": "Einfügen",
            "saveTraining": "Training speichern",
            "saved": "Gespeichert",
            "startTraining": "Training starten",
            "started": "Gestartet",
            "stopSaveTraining": "Training stoppen und speichern",
            "done": "Erledigt",
            "activateTraining": "Training aktivieren",
            "plannedNotTrained": "Geplant · nicht trainiert",
            "noTrainingDay": "Kein Training an diesem Tag.",
            "tapAddExercise": "Tippe auf „+ ÜBUNG“, um das Training für diesen Tag zu erstellen.",
            "noSavedPlan": "Kein gespeicherter Plan für diesen Tag.",
            "noCompletedExercises": "Keine abgeschlossenen Übungen.",
            "chooseExercise": "Übung wählen",
            "editExercises": "Bearbeiten",
            "save": "Speichern",
            "modalSave": "SPEICHERN",
            "delete": "löschen",
            "writeOwnExercise": "Eigene Übung schreiben",
            "kg": "KG",
            "reps": "Wdh.",
            "sets": "Sätze",
            "download": "Download",
            "word": "Word",
            "pdf": "PDF",
            "noSavedReport": "Noch kein Log gespeichert.",
            "noReport": "Kein Log",
            "date": "Datum",
            "startTime": "Startzeit",
            "duration": "Dauer",
            "total": "Total",
            "exercise": "Übung",
            "everMax": "Ever Max",
            "maxToday": "Max Heute",
            "sharePlan": "Plan teilen",
            "sharePlanLink": "Plan als Link teilen",
            "directLinkComingSoon": "Direktes Teilen per Link erfordert eine App-Store- oder Google-Play-Version. Diese Funktion kommt bald!",
            "planLinkReady": "Plan-Link bereit",
            "planLinkCopied": "Plan-Link kopiert",
            "planLinkTooLarge": "Plan zu gross für Link - Plan-Datei teilen verwenden",
            "savePlan": "Plan speichern",
            "insertPlan": "Plan einfügen",
            "saveReport": "Log speichern",
            "shareReport": "Log teilen",
            "saveAllData": "Backup",
            "restoreAllData": "Restore",
            "deleteData": "Daten löschen",
            "supportTitle": "Easy Gym unterstützen",
            "supportIntro": "Easy Gym ist kostenlos und werbefrei. Wenn es deinem Training hilft, unterstützt eine kleine Spende die Weiterentwicklung — danke.",
            "confirmInsert": "Einfügen überschreibt Pläne - bestätigen",
            "confirmRestore": "Wiederherstellen ersetzt alle Daten - bestätigen",
            "confirmDelete": "Löschen entfernt alle Daten - bestätigen",
            "theme": "Design",
            "themeToast": "Design: ",
            "planSaved": "Plan gespeichert",
            "reportSaved": "Log gespeichert",
            "allDataSaved": "Alle Daten gespeichert",
            "shared": "Geteilt",
            "fileSaved": "Datei gespeichert",
            "planInserted": "Plan eingefügt",
            "dataRestored": "Daten wiederhergestellt",
            "dataDeleted": "Daten gelöscht",
            "insertFailed": "Einfügen fehlgeschlagen",
            "restoreFailed": "Wiederherstellen fehlgeschlagen",
            "importFailed": "Import fehlgeschlagen",
            "trainingSaved": "Training gespeichert",
            "exerciseRemovedPlan": "Übung aus Plan entfernt",
            "exerciseListSaved": "Übungsliste gespeichert",
            "addFirst": "Zuerst Übungen zum heutigen Training hinzufügen",
            "resumeTraining": "Training fortsetzen",
            "noExercisesYet": "Noch keine Übungen. Tippe auf „+ ÜBUNG“.",
            "noTrainingPlanned": "Für diesen Tag ist kein Training geplant. Erstelle es zuerst im Plan.",
            "reportHeader": "Übung / P-KG / D-KG / P-Wdh. / D-Wdh. / P-Sätze / D-Sätze",
            "aboutHtml": "<div class=\"card about-card\"><h2>Easy Gym — Plan, Go, Log</h2><p>Ein kostenloser Trainings-Tracker ohne Werbung für ernsthaftes Training. Erstelle deinen PLAN, starte dein Training mit GO und speichere jedes Ergebnis im LOG — alles auf deinem Telefon.</p></div><div class=\"card about-card\"><h2>Vorwort</h2><p>Ich habe Easy Gym für mein eigenes Training erstellt. Die App ist kostenlos und ohne Werbung. Gefällt sie dir? Unterstütze mich mit einer Spende. Möchtest du deine eigene App? Schreib mir: arthur.stivenson@gmail.com.</p></div><div class=\"card about-card\"><h2>PLAN</h2><p>Erstelle einen Plan für ein beliebiges Datum. Mit <strong>+ ÜBUNG</strong> fügst du Übungen mit kg, Wiederholungen und Sätzen hinzu. Mit <strong>LÖSCHEN</strong> entfernst du Übungen. Speichere den Plan, wenn er bereit ist.</p></div><div class=\"card about-card\"><h2>GO</h2><p>Starte mit einem gespeicherten PLAN. Du kannst kg, Wiederholungen und Sätze während des Trainings anpassen oder eine weitere <strong>+ ÜBUNG</strong> hinzufügen. Dein ursprünglicher PLAN bleibt für das nächste Mal unverändert.</p></div><div class=\"card about-card\"><h2>LOG</h2><p>Vergleiche Planvorgaben direkt mit deinen echten Ergebnissen. Erledigte Sätze werden grün markiert. Speichere oder teile deinen fertigen Trainingslog.</p></div><div class=\"card about-card\"><h2>Verwalten &amp; teilen</h2><p><strong>Plan als Link teilen</strong> — Direktes Teilen per Link erfordert eine App-Store- oder Google-Play-Version. Diese Funktion kommt bald!</p><p><strong>Plan oder Log teilen</strong> — Wenn du eine Datei teilst, erstellen wir einen sicheren Link, den du per WhatsApp oder über andere Messenger senden kannst.</p><p><strong>Plan oder Log speichern</strong> — speichert ihn lokal.</p><p><strong>Plan-Datei einfügen</strong> — importiert eine erhaltene Plan-Datei in Easy Gym.</p></div><div class=\"card about-card\"><h2>Backup</h2><p>Backup speichert eine vollständige Kopie. Restore stellt deine Daten wieder her. Daten löschen löscht alles nach Bestätigung.</p></div><div class=\"card about-card\"><h2>Datenschutz</h2><p>Easy Gym funktioniert auf deinem Telefon. Deine Pläne und Logs bleiben auf deinem Gerät, ausser du teilst sie.</p></div>"
      },
      "fr": {
            "langName": "Français",
            "days": {
                  "mon": "Lun",
                  "tue": "Mar",
                  "wed": "Mer",
                  "thu": "Jeu",
                  "fri": "Ven",
                  "sat": "Sam",
                  "sun": "Dim"
            },
            "months": [
                  "Janvier",
                  "Février",
                  "Mars",
                  "Avril",
                  "Mai",
                  "Juin",
                  "Juillet",
                  "Août",
                  "Septembre",
                  "Octobre",
                  "Novembre",
                  "Décembre"
            ],
            "plan": "PLAN",
            "do": "GO",
            "report": "LOG",
            "manage": "gest.",
            "donate": "don",
            "about": "info",
            "selectDay": "Choisir le jour",
            "addExercise": "EXERCICE",
            "remove": "elimine",
            "copy": "Copier",
            "copied": "Copié",
            "paste": "Coller",
            "saveTraining": "Sauver training",
            "saved": "Sauvé",
            "startTraining": "Démarrer training",
            "started": "Démarré",
            "stopSaveTraining": "Arrêter et sauver",
            "done": "Terminé",
            "activateTraining": "Activer training",
            "plannedNotTrained": "Planifié · non entraîné",
            "noTrainingDay": "Pas de training ce jour.",
            "tapAddExercise": "Tape “+ EXERCICE” pour créer le training du jour.",
            "noSavedPlan": "Pas de plan sauvé pour ce jour.",
            "noCompletedExercises": "Aucun exercice terminé.",
            "chooseExercise": "Choisir exercice",
            "editExercises": "Modifier",
            "save": "Sauver",
            "modalSave": "SAUVER",
            "delete": "elimine",
            "writeOwnExercise": "Écrire ton exercice",
            "kg": "KG",
            "reps": "Rép.",
            "sets": "Séries",
            "download": "Download",
            "word": "Word",
            "pdf": "PDF",
            "noSavedReport": "Aucun log sauvé.",
            "noReport": "Aucun log",
            "date": "Date",
            "startTime": "Heure début",
            "duration": "Durée",
            "total": "Total",
            "exercise": "Exercice",
            "everMax": "Ever Max",
            "maxToday": "Max aujourd’hui",
            "sharePlan": "envoi plan",
            "sharePlanLink": "envoi plan-lien",
            "directLinkComingSoon": "Le partage direct par lien nécessite une version App Store ou Google Play. Cette fonction arrive bientôt !",
            "planLinkReady": "Lien Plan prêt",
            "planLinkCopied": "Lien Plan copié",
            "planLinkTooLarge": "Plan trop grand pour le lien - utiliser le fichier Plan",
            "savePlan": "archive plan",
            "insertPlan": "import plan",
            "saveReport": "archive log",
            "shareReport": "envoi log",
            "saveAllData": "Backup",
            "restoreAllData": "Restaurer",
            "deleteData": "Effacer data",
            "supportTitle": "Soutenir Easy Gym",
            "supportIntro": "Easy Gym est gratuit et sans publicité. Si l’app aide ton training, un petit don aide à continuer — merci.",
            "confirmInsert": "Insert will override Plans - confirm",
            "confirmRestore": "Restore will replace All Data - confirm",
            "confirmDelete": "Delete will erase All Data - confirm",
            "theme": "Thème",
            "themeToast": "Thème: ",
            "planSaved": "Plan sauvé",
            "reportSaved": "Log sauvé",
            "allDataSaved": "Toutes les données sauvées",
            "shared": "Partagé",
            "fileSaved": "Fichier sauvé",
            "planInserted": "Plan inséré",
            "dataRestored": "Données restaurées",
            "dataDeleted": "Données supprimées",
            "insertFailed": "Insertion échouée",
            "restoreFailed": "Restauration échouée",
            "importFailed": "Import échoué",
            "trainingSaved": "Training sauvé",
            "exerciseRemovedPlan": "Exercice supprimé du Plan",
            "exerciseListSaved": "Liste d’exercices sauvée",
            "addFirst": "Ajoute d’abord des exercices au training du jour",
            "resumeTraining": "Reprendre training",
            "noExercisesYet": "Aucun exercice. Tape “+ EXERCICE”.",
            "noTrainingPlanned": "Aucun training prévu pour ce jour. Crée-le d’abord dans Plan.",
            "reportHeader": "Exercice / P-KG / D-KG / P-Rép. / D-Rép. / P-Séries / D-Séries",
            "aboutHtml": "<div class=\"card about-card\"><h2>Easy Gym — Plan, Go, Log</h2><p>Un tracker de training gratuit et sans publicité. Préparez votre PLAN, lancez votre séance dans GO et gardez chaque résultat dans LOG — le tout sur votre téléphone.</p></div><div class=\"card about-card\"><h2>Avant-propos</h2><p>J'ai créé Easy Gym pour mon propre entraînement. C'est gratuit et sans publicité. Ça vous plaît ? Soutenez-moi via Don. Vous voulez votre propre app ? Écrivez-moi : arthur.stivenson@gmail.com.</p></div><div class=\"card about-card\"><h2>PLAN</h2><p>Créez un plan pour n'importe quelle date. Utilisez <strong>+ EXERCICE</strong> pour ajouter des exercices avec kg, répétitions et séries. Utilisez <strong>ELIMINE</strong> pour supprimer des exercices. Sauvez le plan quand il est prêt.</p></div><div class=\"card about-card\"><h2>GO</h2><p>Démarrez à partir d'un PLAN sauvé. Vous pouvez ajuster kg, répétitions et séries pendant la séance ou ajouter un autre <strong>+ EXERCICE</strong>. Votre PLAN d'origine reste inchangé pour la prochaine fois.</p></div><div class=\"card about-card\"><h2>LOG</h2><p>Comparez vos objectifs planifiés avec vos résultats réels. Les séries terminées sont marquées en vert. Sauvegardez ou partagez votre log de training final.</p></div><div class=\"card about-card\"><h2>GEST. &amp; partage</h2><p><strong>envoi plan-lien</strong> — Le partage direct par lien nécessite une version App Store ou Google Play. Cette fonction arrive bientôt !</p><p><strong>envoi plan</strong> — partage un fichier plan via un lien sécurisé que vous pouvez envoyer par WhatsApp ou d'autres messengers.</p><p><strong>envoi log</strong> — partage votre log via un lien sécurisé.</p><p><strong>import plan</strong> — insère un fichier plan reçu dans Easy Gym.</p><p><strong>archive plan</strong> — sauvegarde le plan localement.</p><p><strong>archive log</strong> — sauvegarde le log localement.</p></div><div class=\"card about-card\"><h2>Backup</h2><p>Backup sauvegarde une copie complète. Restaurer récupère vos données. Effacer data efface tout après confirmation.</p></div><div class=\"card about-card\"><h2>Confidentialité</h2><p>Easy Gym fonctionne sur votre téléphone. Vos plans et logs restent sur votre appareil, sauf si vous les partagez.</p></div>"
      },
      "it": {
            "langName": "Italiano",
            "days": {
                  "mon": "Lun",
                  "tue": "Mar",
                  "wed": "Mer",
                  "thu": "Gio",
                  "fri": "Ven",
                  "sat": "Sab",
                  "sun": "Dom"
            },
            "months": [
                  "Gennaio",
                  "Febbraio",
                  "Marzo",
                  "Aprile",
                  "Maggio",
                  "Giugno",
                  "Luglio",
                  "Agosto",
                  "Settembre",
                  "Ottobre",
                  "Novembre",
                  "Dicembre"
            ],
            "plan": "PLAN",
            "do": "GO",
            "report": "LOG",
            "manage": "gest.",
            "donate": "dono",
            "about": "info",
            "selectDay": "Scegli giorno",
            "addExercise": "ESERCIZIO",
            "remove": "elimina",
            "copy": "Copia",
            "copied": "Copiato",
            "paste": "Incolla",
            "saveTraining": "Salva training",
            "saved": "Salvato",
            "startTraining": "Inizia training",
            "started": "Iniziato",
            "stopSaveTraining": "Ferma e salva training",
            "done": "Fatto",
            "activateTraining": "Attiva training",
            "plannedNotTrained": "Pianificato · non allenato",
            "noTrainingDay": "Nessun training in questo giorno.",
            "tapAddExercise": "Tocca “+ ESERCIZIO” per creare il training del giorno.",
            "noSavedPlan": "Nessun piano salvato per questo giorno.",
            "noCompletedExercises": "Nessun esercizio completato.",
            "chooseExercise": "Scegli esercizio",
            "editExercises": "Modifica esercizi",
            "save": "Salva",
            "modalSave": "SALVA",
            "delete": "elimina",
            "writeOwnExercise": "Scrivi il tuo esercizio",
            "kg": "KG",
            "reps": "Rip.",
            "sets": "Serie",
            "download": "Download",
            "word": "Word",
            "pdf": "PDF",
            "noSavedReport": "Nessun log salvato.",
            "noReport": "Nessun log",
            "date": "Data",
            "startTime": "Ora inizio",
            "duration": "Durata",
            "total": "Total",
            "exercise": "Esercizio",
            "everMax": "Ever Max",
            "maxToday": "Max oggi",
            "sharePlan": "invio plan",
            "sharePlanLink": "invio plan-link",
            "directLinkComingSoon": "La condivisione diretta tramite link richiede una versione App Store o Google Play. Questa funzione arriverà presto!",
            "planLinkReady": "Link Plan pronto",
            "planLinkCopied": "Link Plan copiato",
            "planLinkTooLarge": "Plan troppo grande per il link - usa file Plan",
            "savePlan": "archivio plan",
            "insertPlan": "import plan",
            "saveReport": "archivio log",
            "shareReport": "invio log",
            "saveAllData": "Backup",
            "restoreAllData": "Ripristina",
            "deleteData": "Elimina dati",
            "supportTitle": "Sostieni Easy Gym",
            "supportIntro": "Easy Gym è gratis e senza pubblicità. Se aiuta il tuo training, una piccola donazione sostiene lo sviluppo — grazie.",
            "confirmInsert": "Insert will override Plans - confirm",
            "confirmRestore": "Restore will replace All Data - confirm",
            "confirmDelete": "Delete will erase All Data - confirm",
            "theme": "Tema",
            "themeToast": "Tema: ",
            "planSaved": "Plan salvato",
            "reportSaved": "Log salvato",
            "allDataSaved": "Tutti i dati salvati",
            "shared": "Condiviso",
            "fileSaved": "File salvato",
            "planInserted": "Plan inserito",
            "dataRestored": "Dati ripristinati",
            "dataDeleted": "Dati eliminati",
            "insertFailed": "Inserimento fallito",
            "restoreFailed": "Ripristino fallito",
            "importFailed": "Import fallito",
            "trainingSaved": "Training salvato",
            "exerciseRemovedPlan": "Esercizio rimosso dal Plan",
            "exerciseListSaved": "Lista esercizi salvata",
            "addFirst": "Aggiungi prima esercizi al training di oggi",
            "resumeTraining": "Riprendi training",
            "noExercisesYet": "Nessun esercizio. Tocca “+ ESERCIZIO”.",
            "noTrainingPlanned": "Nessun training pianificato per questo giorno. Crealo prima in Plan.",
            "reportHeader": "Esercizio / P-KG / D-KG / P-Rip. / D-Rip. / P-Serie / D-Serie",
            "aboutHtml": "<div class=\"card about-card\"><h2>Easy Gym — Plan, Go, Log</h2><p>Un tracker di training gratuito e senza pubblicità. Prepara il tuo PLAN, avvia la sessione in GO e conserva ogni risultato nel LOG — tutto sul tuo telefono.</p></div><div class=\"card about-card\"><h2>Prefazione</h2><p>Ho creato Easy Gym per il mio allenamento. È gratis e senza pubblicità. Ti piace? Sostienimi con una Donazione. Vuoi la tua app? Scrivimi: arthur.stivenson@gmail.com.</p></div><div class=\"card about-card\"><h2>PLAN</h2><p>Crea un plan per qualsiasi data. Usa <strong>+ ESERCIZIO</strong> per aggiungere esercizi con kg, ripetizioni e serie. Usa <strong>ELIMINA</strong> per rimuovere esercizi. Salva il plan quando è pronto.</p></div><div class=\"card about-card\"><h2>GO</h2><p>Parti da un PLAN salvato. Puoi modificare kg, ripetizioni e serie durante la sessione o aggiungere un altro <strong>+ ESERCIZIO</strong>. Il tuo PLAN originale resta invariato per la prossima volta.</p></div><div class=\"card about-card\"><h2>LOG</h2><p>Confronta i target pianificati con i risultati reali. I set completati sono evidenziati in verde. Salva o condividi il tuo log di training finale.</p></div><div class=\"card about-card\"><h2>GEST. &amp; condivisione</h2><p><strong>invio plan-link</strong> — La condivisione diretta tramite link richiede una versione App Store o Google Play. Questa funzione arriverà presto!</p><p><strong>invio plan</strong> — condivide un file plan tramite un link sicuro che puoi inviare via WhatsApp o altri messenger.</p><p><strong>invio log</strong> — condivide il tuo log tramite un link sicuro.</p><p><strong>import plan</strong> — inserisce un file plan ricevuto in Easy Gym.</p><p><strong>archivio plan</strong> — salva il plan localmente.</p><p><strong>archivio log</strong> — salva il log localmente.</p></div><div class=\"card about-card\"><h2>Backup</h2><p>Backup salva una copia completa. Ripristina recupera i tuoi dati. Elimina dati cancella tutto dopo conferma.</p></div><div class=\"card about-card\"><h2>Privacy</h2><p>Easy Gym funziona sul tuo telefono. I tuoi plan e log restano sul dispositivo, a meno che tu non li condivida.</p></div>"
      },
      "es": {
            "langName": "Español",
            "days": {
                  "mon": "Lun",
                  "tue": "Mar",
                  "wed": "Mié",
                  "thu": "Jue",
                  "fri": "Vie",
                  "sat": "Sáb",
                  "sun": "Dom"
            },
            "months": [
                  "Enero",
                  "Febrero",
                  "Marzo",
                  "Abril",
                  "Mayo",
                  "Junio",
                  "Julio",
                  "Agosto",
                  "Septiembre",
                  "Octubre",
                  "Noviembre",
                  "Diciembre"
            ],
            "plan": "PLAN",
            "do": "GO",
            "report": "LOG",
            "manage": "gest.",
            "donate": "apoyo",
            "about": "info",
            "selectDay": "Elegir día",
            "addExercise": "EJERCICIO",
            "remove": "eliminar",
            "copy": "Copiar",
            "copied": "Copiado",
            "paste": "Pegar",
            "saveTraining": "Guardar training",
            "saved": "Guardado",
            "startTraining": "Iniciar training",
            "started": "Iniciado",
            "stopSaveTraining": "Parar y guardar training",
            "done": "Hecho",
            "activateTraining": "Activar training",
            "plannedNotTrained": "Planificado · no entrenado",
            "noTrainingDay": "Sin training este día.",
            "tapAddExercise": "Toca “+ EJERCICIO” para crear el training del día.",
            "noSavedPlan": "No hay plan guardado para este día.",
            "noCompletedExercises": "No hay ejercicios completados.",
            "chooseExercise": "Elegir ejercicio",
            "editExercises": "Editar",
            "save": "Guardar",
            "modalSave": "GUARDAR",
            "delete": "eliminar",
            "writeOwnExercise": "Escribe tu ejercicio",
            "kg": "KG",
            "reps": "Reps",
            "sets": "Series",
            "download": "Download",
            "word": "Word",
            "pdf": "PDF",
            "noSavedReport": "Todavía no hay log guardado.",
            "noReport": "Sin log",
            "date": "Fecha",
            "startTime": "Hora inicio",
            "duration": "Duración",
            "total": "Total",
            "exercise": "Ejercicio",
            "everMax": "Ever Max",
            "maxToday": "Max hoy",
            "sharePlan": "envio plan",
            "sharePlanLink": "envio plan-link",
            "directLinkComingSoon": "Compartir directamente por enlace requiere una versión de App Store o Google Play. ¡Esta función llegará pronto!",
            "planLinkReady": "Enlace Plan listo",
            "planLinkCopied": "Enlace Plan copiado",
            "planLinkTooLarge": "Plan demasiado grande para enlace - usa archivo Plan",
            "savePlanFirst": "Primero guarda un Plan",
            "creatingPlanLink": "Creando enlace del Plan",
            "copyPlanLinkPrompt": "Copia este enlace del Plan",
            "savePlan": "archivo plan",
            "insertPlan": "import plan",
            "saveReport": "archivo log",
            "shareReport": "envio log",
            "saveAllData": "Backup",
            "restoreAllData": "Restaurar",
            "deleteData": "Eliminar datos",
            "supportTitle": "Apoyar Easy Gym",
            "supportIntro": "Easy Gym es gratis y sin anuncios. Si ayuda a tu training, una pequeña donación ayuda a seguir — gracias.",
            "confirmInsert": "Insert will override Plans - confirm",
            "confirmRestore": "Restore will replace All Data - confirm",
            "confirmDelete": "Delete will erase All Data - confirm",
            "theme": "Tema",
            "themeToast": "Tema: ",
            "planSaved": "Plan guardado",
            "reportSaved": "Log guardado",
            "allDataSaved": "Todos los datos guardados",
            "shared": "Compartido",
            "fileSaved": "Archivo guardado",
            "planInserted": "Plan insertado",
            "dataRestored": "Datos restaurados",
            "dataDeleted": "Datos eliminados",
            "insertFailed": "Inserción fallida",
            "restoreFailed": "Restauración fallida",
            "importFailed": "Importación fallida",
            "trainingSaved": "Training guardado",
            "exerciseRemovedPlan": "Ejercicio eliminado del Plan",
            "exerciseListSaved": "Lista de ejercicios guardada",
            "addFirst": "Añade primero ejercicios al training de hoy",
            "resumeTraining": "Continuar training",
            "noExercisesYet": "Sin ejercicios. Toca “+ EJERCICIO”.",
            "noTrainingPlanned": "No hay training planificado para este día. Créalo primero en Plan.",
            "reportHeader": "Ejercicio / P-KG / D-KG / P-Reps / D-Reps / P-Series / D-Series",
            "aboutHtml": "<div class=\"card about-card\"><h2>Easy Gym — Plan, Go, Log</h2><p>Un tracker de training gratuito y sin anuncios. Prepara tu PLAN, empieza en GO y guarda cada resultado en LOG — todo en tu teléfono.</p></div><div class=\"card about-card\"><h2>Prólogo</h2><p>Creé Easy Gym para mi propio entrenamiento. Es gratis y sin anuncios. ¿Te gusta? Apóyame con una Donación. ¿Necesitas tu propia app? Escríbeme: arthur.stivenson@gmail.com.</p></div><div class=\"card about-card\"><h2>PLAN</h2><p>Crea un plan para cualquier fecha. Usa <strong>+ EJERCICIO</strong> para añadir ejercicios con kg, repeticiones y series. Usa <strong>ELIMINAR</strong> para quitar ejercicios. Guarda el plan cuando esté listo.</p></div><div class=\"card about-card\"><h2>GO</h2><p>Empieza desde un PLAN guardado. Puedes ajustar kg, repeticiones y series durante la sesión o añadir otro <strong>+ EJERCICIO</strong>. Tu PLAN original queda sin cambios para la próxima vez.</p></div><div class=\"card about-card\"><h2>LOG</h2><p>Compara los objetivos planificados con tus resultados reales. Las series completadas se marcan en verde. Guarda o comparte tu log de training final.</p></div><div class=\"card about-card\"><h2>GEST. &amp; compartir</h2><p><strong>envio plan-link</strong> — El envío directo por enlace requiere una versión App Store o Google Play. ¡Esta función llegará pronto!</p><p><strong>envio plan</strong> — comparte un archivo plan mediante un enlace seguro que puedes enviar por WhatsApp u otros messengers.</p><p><strong>envio log</strong> — comparte tu log mediante un enlace seguro.</p><p><strong>import plan</strong> — inserta un archivo plan recibido en Easy Gym.</p><p><strong>archivo plan</strong> — guarda el plan localmente.</p><p><strong>archivo log</strong> — guarda el log localmente.</p></div><div class=\"card about-card\"><h2>Backup</h2><p>Backup guarda una copia completa. Restaurar recupera tus datos. Eliminar datos borra todo después de la confirmación.</p></div><div class=\"card about-card\"><h2>Privacidad</h2><p>Easy Gym funciona en tu teléfono. Tus planes y logs permanecen en tu dispositivo, a menos que los compartas.</p></div>"
      }
};
  const LANGS = ['en','de','fr','it','es'];
  const PLAN_LINK_MAX_LENGTH = 8000;
  function normalizeLang(lang){ return LANGS.includes(lang) ? lang : 'en'; }
  const PACKAGE_PREFIX = 'easyGym.enDeFrItEs.';
  const KEYS = {
    week:PACKAGE_PREFIX+'weekPlans.v1', train:PACKAGE_PREFIX+'trainSessions.v1', saved:PACKAGE_PREFIX+'savedPlans.v1', journal:PACKAGE_PREFIX+'journal.v1',
    library:PACKAGE_PREFIX+'exerciseLibrary.v1', start:PACKAGE_PREFIX+'trainStartTimes.v1', backup:PACKAGE_PREFIX+'backupReady.v1', theme:PACKAGE_PREFIX+'theme.v1',
    datePlans:PACKAGE_PREFIX+'datePlans.v1', savedDatePlans:PACKAGE_PREFIX+'savedDatePlans.v1', activeDatePlans:PACKAGE_PREFIX+'activeDatePlans.v1', lang:PACKAGE_PREFIX+'lang.v1'
  };
  const LEGACY_KEYS = [];
  const DEV_BUILD = 'v172';
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
  function cacheEls(){ ['planDayButtons','planChooseHint','planActionRow','savePlanRow','trainDayButtons','planList','trainList','planTitle','trainControls','savePlanBtn','removeSelectedBtn','copyPlanBtn','saveTrainingBtn','startTrainingBtn','timerText','addExerciseModal','libraryList','customExerciseName','addCustomExerciseBtn','editExercisesBtn','saveLibraryBtn','deleteLibraryBtn','customRow','exerciseModalHelp','journalList','downloadWordBtn','downloadPdfBtn','sharePlanBtn','sharePlanLinkBtn','manageSavePlanBtn','insertPlanBtn','insertPlanInput','manageSaveReportBtn','shareReportBtn','saveAllDataBtn','restoreAllDataBtn','restoreAllDataInput','deleteDataBtn','toast','qrImage','downloadSwissQrBtn','homeTodayCard','homeStartBtn','homeGreeting','aboutContent','languageSelect'].forEach(id=>els[id]=$(id)); }
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
    return `<div class="home-row done-action-row"><span class="home-label done-label">${esc(t('done'))}</span>${activateIso?`<button class="action small" type="button" data-activate-date="${esc(activateIso)}">${buttonHtml('start',t('activateTraining'))}</button>`:''}</div>`;
  }
  function toast(msg){ if(!els.toast) return; els.toast.textContent=msg; els.toast.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>els.toast.classList.remove('show'),1700); }


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
  function applyLanguageUi(){
    currentLang=normalizeLang(currentLang);
    document.documentElement.lang=currentLang;
    if(els.languageSelect) els.languageSelect.value=currentLang;
    const navKeys={plan:'plan',train:'do',progress:'report',explanations:'manage',donate:'donate',about:'about'};
    document.querySelectorAll('[data-tab]').forEach(b=>{ const k=navKeys[b.dataset.tab]; if(k) setNavButtonLabel(b,TAB_ICONS[b.dataset.tab]||'about',t(k)); });
    setText('planChooseHint','selectDay'); setIconText('addExerciseBtn','addExercise','add'); setIconText('removeSelectedBtn','remove','remove');
    setIconText('downloadWordBtn','word','word'); setIconText('downloadPdfBtn','pdf','pdf');
    const dl=document.querySelector('.download-label'); if(dl) dl.textContent=t('download');
    setIconText('sharePlanBtn','sharePlan','share'); setIconText('sharePlanLinkBtn','sharePlanLink','share'); setIconText('manageSavePlanBtn','savePlan','save'); setIconText('insertPlanBtn','insertPlan','insert'); setIconText('manageSaveReportBtn','saveReport','save'); setIconText('shareReportBtn','shareReport','share'); setIconText('saveAllDataBtn','saveAllData','save'); setIconText('restoreAllDataBtn','restoreAllData','restore'); setIconText('deleteDataBtn','deleteData','delete');
    const donateTitle=document.querySelector('#donate .donate-intro h2'); if(donateTitle) donateTitle.textContent=t('supportTitle');
    const donateIntro=document.querySelector('#donate .donate-intro p'); if(donateIntro) donateIntro.textContent=t('supportIntro');
    const theme=$('themeToggle'); if(theme){ theme.setAttribute('aria-label',t('theme')); theme.title=t('theme'); }
    setText('modalTitle','chooseExercise'); setIconText('editExercisesBtn','editExercises','edit'); setIconText('saveLibraryBtn','modalSave','save'); setIconText('deleteLibraryBtn','delete','delete');
    setIconText('homeStartBtn','startTraining','start'); const qr=$('downloadSwissQrBtn'); if(qr) setButtonLabel(qr,'download','Download Swiss QR');
    const custom=$('customExerciseName'); if(custom) custom.placeholder=t('writeOwnExercise');
    const close=$('closeModalBtn'); if(close) close.setAttribute('aria-label','Close');
    if(els.aboutContent) els.aboutContent.innerHTML=t('aboutHtml');
  }
  function changeLanguage(lang){ currentLang=normalizeLang(lang); save(KEYS.lang,currentLang); renderAll(); toast((I18N[currentLang]&&I18N[currentLang].langName)||currentLang.toUpperCase()); }

  const THEMES = ['system','light','dark'];
  function applyTheme(mode){
    const root = document.documentElement;
    if(mode==='light'||mode==='dark') root.setAttribute('data-theme',mode);
    else root.removeAttribute('data-theme');
    const dark = (mode==='dark') || (mode!=='light' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const meta = document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', dark ? '#000000' : '#ffffff');
  }
  function cycleTheme(){
    const cur = load(KEYS.theme, 'system');
    const next = THEMES[(THEMES.indexOf(cur)+1) % THEMES.length];
    save(KEYS.theme, next);
    applyTheme(next);
    toast(t('themeToast')+next);
  }

  function init(){ currentLang=normalizeLang(load(KEYS.lang,'en')); applyTheme(load(KEYS.theme,'system')); cacheEls(); wire(); normalizeData(); if(!selectedPlanDate) selectedPlanDate=todayISO(); renderAll(); updateTimerLoop(); handleIncomingPlanLink();}
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
    if(els.languageSelect) els.languageSelect.addEventListener('change',()=>changeLanguage(els.languageSelect.value));
    const tt = document.getElementById('themeToggle');
    if(tt) tt.addEventListener('click', cycleTheme);
    if(window.matchMedia){
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{ if(load(KEYS.theme,'system')==='system') applyTheme('system'); });
    }
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
    if(els.downloadSwissQrBtn) els.downloadSwissQrBtn.addEventListener('click', downloadSwissQR);
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
      card.innerHTML = `<div class="home-row"><span class="home-label">${esc(t('done'))}</span><span class="home-sub">${esc(formatDuration(done.durationMs))}</span></div>`+ completedListHtml(done);
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
    toast(t('trainingSaved'));
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
  function renderPlan(){
    const iso=selectedPlanDate; const has=!!iso;
    els.planChooseHint.style.display = has ? 'none' : '';
    els.planTitle.style.display = 'none'; els.planTitle.textContent='';
    els.planList.style.display = has ? '' : 'none';
    if(!has){ els.planActionRow.style.display='none'; els.savePlanRow.style.display='none'; els.planList.innerHTML=''; updatePlanCopyState(); return; }
    const today=todayISO(); const done=journalForDate(iso); const isPast = iso<today;
    if(done && !activeDatePlans[iso]){
      // Done: Progress keeps the performed session; Plan still shows the original saved plan unchanged.
      els.planActionRow.style.display='none'; els.savePlanRow.style.display='none'; updatePlanCopyState();
      const originalPlan = (datePlans[iso]||[]);
      els.planList.innerHTML = doneRowHtml(iso) + (originalPlan.length ? readOnlyPlanExerciseCardsHtml(originalPlan) : completedExerciseCardsHtml(done));
      const activateBtn = els.planList.querySelector('[data-activate-date]');
      if(activateBtn) activateBtn.addEventListener('click',()=>activateTraining(iso));
      return;
    }
    if(isPast && !activeDatePlans[iso]){
      // Past date, never trained — read-only
      els.planActionRow.style.display='none'; els.savePlanRow.style.display='none'; updatePlanCopyState();
      const plan=datePlans[iso]||[];
      els.planList.innerHTML = plan.length ? (`<div class="home-row"><span class="home-label">${esc(t('plannedNotTrained'))}</span></div>`+planListHtml(plan)) : `<div class="empty">${esc(t('noTrainingDay'))}</div>`;
      return;
    }
    // Today or future — editable plan for this exact date
    els.planActionRow.style.display=''; els.savePlanRow.style.display='';
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
  function saveCurrentPlan(){ if(!selectedPlanDay||!isPlanValid(selectedPlanDay))return; savedPlanDays[selectedPlanDay]=true; syncTrainFromPlan(selectedPlanDay); saveAll(); renderAll(); toast(`${dayShort(selectedPlanDay)}-plan ${t('saved')}`); }
  function addPlanExercise(name){ if(!selectedPlanDay)return; weekPlans[selectedPlanDay].push({id:uid(),name,sets:1,kg:1,reps:1});markPlanDirty(selectedPlanDay);closeExerciseModal();renderAll();}
  function replacePlanExercise(id,name){ if(!selectedPlanDay)return; const it=currentPlan().find(x=>x.id===id); if(!it)return; it.name=name; markPlanDirty(selectedPlanDay); closeExerciseModal(); renderAll();}
  function syncTrainFromPlan(day){trainSessions[day]=(weekPlans[day]||[]).map(p=>({sessionId:uid(),exerciseId:p.id,name:p.name,sets:p.sets,kg:p.kg,reps:p.reps,checked:0,trainAdded:false,addedStarted:false}));}

  function selectTrainDay(day){ if(!hasSavedPlan(day)) return; selectedTrainDay=day; savedWorkout=null; syncTrainFromPlan(day); delete trainStartTimes[day]; saveAll(); renderAll(); }
  function renderTrain(){
    // Do-it: swipeable date strip; train the selected date's planned session
    buildDateStrip(els.trainDayButtons, selectedTrainDate, 'data-train-iso');
    ensureStripBehavior(els.trainDayButtons, 'data-train-iso', iso=>{ selectedTrainDate=iso; renderAll(); });
    const iso=selectedTrainDate;
    els.trainControls.classList.remove('done-state');
    els.trainControls.style.display = iso ? '' : 'none';
    if(!iso){ els.trainControls.innerHTML=''; els.trainList.innerHTML=`<div class="empty">${esc(t('selectDay'))}</div>`; setTrainSaveState(); return; }
    const open=!!trainStartTimes[iso]; const finished=savedWorkout?.date===iso; const done=journalForDate(iso);
    if(done && !activeDatePlans[iso] && !open && !finished){
      els.trainControls.classList.add('done-state');
      els.trainControls.style.display='none';
      els.trainControls.innerHTML='';
      els.trainList.innerHTML=doneRowHtml()+completedExerciseCardsHtml(done);
      setTrainSaveState();
      const saveRow=els.saveTrainingBtn.closest('.action-row'); if(saveRow) saveRow.style.display='none';
      return;
    }
    if(finished){
      els.trainControls.classList.add('done-state');
      els.trainControls.style.display='none';
      els.trainControls.innerHTML='';
      els.trainList.innerHTML=doneRowHtml()+completedExerciseCardsHtml(done);
      setTrainSaveState();
      const saveRow=els.saveTrainingBtn.closest('.action-row'); if(saveRow) saveRow.style.display='none';
      return;
    }
    if(!open && !finished && !(trainSessions[iso]||[]).length && isDatePlanValid(iso)){ seedTrainFromDate(iso); saveAll(); }
    const list=trainSessions[iso]||[];
    if(!list.length){
      els.trainControls.style.display='none'; els.trainControls.innerHTML='';
      els.trainList.innerHTML=`<div class="empty">${esc(t('noTrainingPlanned'))}</div>`;
      setTrainSaveState(); return;
    }
    const startText = open ? t('started') : t('startTraining');
    els.trainControls.innerHTML = `<button class="action small" id="addTrainExerciseBtn" type="button">${buttonHtml('add',t('addExercise'))}</button><button class="action small" id="startInlineBtn" ${open?'disabled':''}>${buttonHtml(open?'copied':'start',startText)}</button><span class="timer" id="liveTimer">${open?formatDuration(Date.now()-Number(trainStartTimes[iso])):''}</span><button class="action danger small disabled train-remove-end" id="removeTrainSelectedBtn" type="button" disabled>${buttonHtml('remove',t('remove'))}</button>`;
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
  function isTrainLocked(){return savedWorkout?.date===selectedTrainDate;}
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
    toast('Training activated');
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
  function setTrainSaveState(){ const iso=selectedTrainDate; const row=els.saveTrainingBtn.closest('.action-row'); const visible=!!(iso&&trainStartTimes[iso]) || isTrainLocked(); if(row) row.style.display=visible?'':'none'; if(!visible)return; const locked=isTrainLocked(); const can=canSaveTraining(); setButtonLabel(els.saveTrainingBtn, locked?'copied':'stop', locked ? t('saved') : t('stopSaveTraining')); els.saveTrainingBtn.disabled = locked || !can; els.saveTrainingBtn.classList.toggle('saved',locked); els.saveTrainingBtn.classList.toggle('disabled',!locked&&!can); }
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
    if(!canSaveTraining()||isTrainLocked())return;
    const iso=selectedTrainDate;
    const start=Number(trainStartTimes[iso])||Date.now();
    const end=Date.now();
    const plannedExercises=planSnapshotForDate(iso);
    const exercises=collectCompleted(plannedExercises);
    if(!exercises.length)return;
    journal.unshift({id:uid(),date:iso,day:weekdayOf(iso),startedAt:new Date(start).toISOString(),endedAt:new Date(end).toISOString(),durationMs:end-start,plannedExercises,exercises});
    savedDatePlans[iso]=true; activeDatePlans[iso]=false; savedWorkout={date:iso,durationMs:end-start}; delete trainStartTimes[iso]; saveAll(); renderAll(); toast(t('trainingSaved'));
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
  function reportDownloadHeaders(){
    const byLang={
      en:['Exercise','Planned KG','Done KG','Planned Reps','Done Reps','Planned Sets','Done Sets'],
      de:['Übung','Geplante KG','Gemachte KG','Geplante Wdh.','Gemachte Wdh.','Geplante Sätze','Gemachte Sätze'],
      fr:['Exercice','KG prévus','KG faits','Rép. prévues','Rép. faites','Séries prévues','Séries faites'],
      it:['Esercizio','KG pianificati','KG fatti','Rip. pianificate','Rip. fatte','Serie pianificate','Serie fatte'],
      es:['Ejercicio','KG planificados','KG hechos','Reps planificadas','Reps hechas','Series planificadas','Series hechas']
    };
    return byLang[currentLang] || byLang.en;
  }
  function reportDownloadHtml(){
    const groups=progressGroups();
    const headers=reportDownloadHeaders();
    const css=`
      body{font-family:Arial,Helvetica,sans-serif;color:#111827;margin:24px;background:#ffffff;}
      h2{font-size:16px;margin:18px 0 8px;text-align:center;}
      table{border-collapse:collapse;width:100%;margin:0 0 20px;table-layout:fixed;background:#ffffff;}
      th,td{border:1px solid #4b5563;padding:7px 8px;font-size:12px;line-height:1.25;vertical-align:middle;word-wrap:break-word;text-align:center;background:#ffffff;}
      th{background:#e5e7eb;font-weight:700;text-transform:uppercase;letter-spacing:.03em;}
      .meta th{background:#f3f4f6;color:#111827;}
      .meta td{background:#ffffff;font-weight:700;}
      .report th:first-child,.report td:first-child{text-align:center;width:32%;}
      .num,.digit{font-weight:700;text-align:center;}
      .exercise-summary td{background:#f9fafb;font-weight:700;text-align:center;}
      .done,.done-head{color:#008000!important;font-weight:700!important;}
      .done *,.done-head *{color:#008000!important;font-weight:700!important;}
      td.done,th.done-head{mso-color-alt:#008000;mso-style-textfill-fill-color:#008000;}
      .plan{color:#374151;}
      .empty{color:#6b7280;font-style:italic;text-align:center;}
    `;
    const tableForGroup=g=>{
      const meta=`<table class="meta"><tr><th>${esc(t('date'))}</th><th>${esc(t('startTime'))}</th><th>${esc(t('duration'))}</th><th>${esc(t('total'))}</th></tr><tr><td>${esc(g.date)}</td><td>${esc(g.startTime)}</td><td>${esc(g.duration)}</td><td>${esc(g.totalWeight)} kg</td></tr></table>`;
      const body=g.exercises.map(ex=>{
        const summary=`<tr class="exercise-summary"><td>${esc(displayExerciseName(ex.name))}</td><td colspan="3">${esc(t('everMax'))}: ${esc(ex.everMax)} kg</td><td colspan="3">${esc(t('maxToday'))}: ${esc(ex.todayMax)} kg</td></tr>`;
        const doneStyle='color:#008000!important;font-weight:700!important;text-align:center;mso-color-alt:#008000;mso-style-textfill-fill-color:#008000;';
        const doneSpan=v=>`<span style="${doneStyle}">${esc(reportCell(v))}</span>`;
        const rows=ex.rows.map(r=>`<tr><td>&nbsp;</td><td class="num digit plan">${esc(reportCell(r.pKg))}</td><td class="num digit done" style="${doneStyle}">${doneSpan(r.dKg)}</td><td class="num digit plan">${esc(reportCell(r.pReps))}</td><td class="num digit done" style="${doneStyle}">${doneSpan(r.dReps)}</td><td class="num digit plan">${esc(reportCell(r.pSets))}</td><td class="num digit done" style="${doneStyle}">${doneSpan(r.dSets)}</td></tr>`).join('');
        return summary+rows;
      }).join('');
      const head=`<tr>${headers.map((h,i)=>{ const done=[2,4,6].includes(i); return `<th class="${i?'num ':''}${done?'done-head':''}"${done?' style="color:#008000!important;font-weight:700!important;text-align:center;mso-color-alt:#008000;mso-style-textfill-fill-color:#008000;"':''}>${done?`<span style="color:#008000!important;font-weight:700!important;mso-color-alt:#008000;mso-style-textfill-fill-color:#008000;">${esc(h)}</span>`:esc(h)}</th>`; }).join('')}</tr>`;
      return `<h2>${esc(g.date)}</h2>${meta}<table class="report">${head}${body}</table>`;
    };
    const content=groups.length?groups.map(tableForGroup).join(''):`<p class="empty">${esc(t('noReport'))}</p>`;
    return `<!doctype html><html><head><meta charset="utf-8"><title>Report</title><style>${css}</style></head><body>${content}</body></html>`;
  }
  function downloadWord(){ downloadFile('easy-gym-report.doc','application/msword',reportDownloadHtml()); }
  function downloadPdf(){ const pdf=makeReportTablePdf(); downloadFile('easy-gym-report.pdf','application/pdf',pdf,true); }
  function pdfSafeText(value){
    return String(value==null?'':value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7E]/g,'?');
  }
  function pdfEsc(value){ return pdfSafeText(value).replace(/[\\()]/g,'\\$&'); }
  function makeReportTablePdf(){
    const groups=progressGroups();
    if(!groups.length) return makeSimplePdf(t('noReport'));
    const W=842, H=595, M=28;
    const colW=[226,76,76,96,96,92,92];
    const tableW=colW.reduce((a,b)=>a+b,0);
    const rowH=20;
    let pages=[];
    let stream='';
    let y=H-M;
    function newPage(){ if(stream) pages.push(stream); stream=''; y=H-M; }
    function ensure(h){ if(y-h<M) newPage(); }
    function drawRect(x,top,w,h,fill){ if(fill){ stream+=fill+' rg '+x.toFixed(1)+' '+(top-h).toFixed(1)+' '+w.toFixed(1)+' '+h.toFixed(1)+' re f\n'; } stream+='0.28 0.32 0.38 RG 0.6 w '+x.toFixed(1)+' '+(top-h).toFixed(1)+' '+w.toFixed(1)+' '+h.toFixed(1)+' re S\n'; }
    function text(value,x,base,size=8,bold=false,green=false,centerW=0){ const shown=pdfSafeText(value); const approx=shown.length*size*0.52; const tx=centerW?x+Math.max(2,(centerW-approx)/2):x; const color=green?'0.000 0.560 0.000 rg':'0.070 0.090 0.120 rg'; stream+='q '+color+' BT /F'+(bold?'2':'1')+' '+size+' Tf '+tx.toFixed(1)+' '+base.toFixed(1)+' Td ('+pdfEsc(shown)+') Tj ET Q\n'; }
    function fit(value,w,size=8){ const s=pdfSafeText(reportCell(value)); const max=Math.max(1,Math.floor((w-8)/(size*0.52))); return s.length>max?s.slice(0,Math.max(0,max-1))+'…':s; }
    function cell(x,top,w,h,value,opt={}){ drawRect(x,top,w,h,opt.fill||''); text(fit(value,w,opt.size||8),x,top-13,opt.size||8,!!opt.bold,!!opt.green,w); }
    function row(values,opt={}){ let x=M; ensure(opt.h||rowH); values.forEach((v,i)=>{ const isGreen=!!(opt.greenCols&&opt.greenCols.includes(i)); const bold=!!opt.bold || !!(opt.boldCols&&opt.boldCols.includes(i)); const fill=isGreen ? (opt.greenFill || '0.925 1.000 0.935') : opt.fill; cell(x,y,colW[i],opt.h||rowH,v,{bold,green:isGreen,fill,size:opt.size||8}); x+=colW[i]; }); y-=opt.h||rowH; }
    groups.forEach((g,gi)=>{
      ensure(110);
      text(g.date,M,y,12,true,false,tableW); y-=18;
      const mw=tableW/4;
      [[t('date'),t('startTime'),t('duration'),t('total')],[g.date,g.startTime,g.duration,g.totalWeight+' kg']].forEach((vals,ri)=>{ let x=M; ensure(rowH); vals.forEach(v=>{ cell(x,y,mw,rowH,v,{bold:true,fill:ri===0?'0.90 0.91 0.93':'',size:8}); x+=mw; }); y-=rowH; });
      y-=6;
      row(reportDownloadHeaders(),{bold:true,fill:'0.90 0.91 0.93',size:7.2,greenCols:[2,4,6]});
      g.exercises.forEach(ex=>{
        ensure(rowH*2);
        row([displayExerciseName(ex.name),t('everMax'),ex.everMax+' kg',t('maxToday'),ex.todayMax+' kg','',''],{bold:true,fill:'0.97 0.97 0.98',size:7.5});
        ex.rows.forEach(r=>row(['',reportCell(r.pKg),reportCell(r.dKg),reportCell(r.pReps),reportCell(r.dReps),reportCell(r.pSets),reportCell(r.dSets)],{greenCols:[2,4,6],boldCols:[1,2,3,4,5,6],size:8}));
      });
      if(gi<groups.length-1) y-=10;
    });
    if(stream) pages.push(stream);
    return buildPdfDocument(pages,W,H);
  }
  function makeSimplePdf(text){
    const W=612,H=792; const lines=String(text||'').split('\n').slice(0,80); const escPdf=s=>pdfEsc(s); let y=760; let stream='BT /F1 12 Tf 40 '+y+' Td '; lines.forEach((line,i)=>{ if(i){stream+='0 -16 Td ';} stream+='('+escPdf(line)+') Tj ';}); stream+='ET'; return buildPdfDocument([stream],W,H);
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
  function downloadSwissQR(){ const src=(els.qrImage&&els.qrImage.src)||''; if(!src)return; const a=document.createElement('a'); a.href=src; a.download='easy-gym-swiss-qr.png'; document.body.appendChild(a); a.click(); a.remove(); }
  function downloadFile(name,mime,content,binary=false){ if(window.AndroidDownload&&typeof window.AndroidDownload.saveFile==='function'){ const b64=btoa(unescape(encodeURIComponent(content))); window.AndroidDownload.saveFile(name,mime,b64); return;} const blob=new Blob([content],{type:mime}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},200); }

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
  function compactExerciseList(list){
    return (Array.isArray(list)?list:[]).filter(item=>item&&item.name).map(item=>{
      const sourceLines=(Array.isArray(item.lines)&&item.lines.length)?item.lines:[item];
      const lines=sourceLines.map(line=>[String(line.kg??1),String(line.reps??1),String(line.sets??1)]);
      return [String(item.name||'').trim(),lines];
    }).filter(entry=>entry[0]);
  }
  function compactPlanPayload(){
    const compact={t:'egp2',v:2};
    const d=Object.keys(datePlans||{}).sort().filter(iso=>Array.isArray(datePlans[iso])&&datePlans[iso].length).map(iso=>[iso,compactExerciseList(datePlans[iso])]).filter(entry=>entry[1].length);
    const w=DAYS.filter(day=>Array.isArray(weekPlans[day])&&weekPlans[day].length).map(day=>[day,compactExerciseList(weekPlans[day])]).filter(entry=>entry[1].length);
    if(d.length) compact.d=d;
    if(w.length) compact.w=w;
    return compact;
  }
  function expandCompactPlanPayload(data){
    if(!data||data.t!=='egp2') return data;
    const makeList=list=>(Array.isArray(list)?list:[]).map(entry=>{
      const name=String(Array.isArray(entry)?(entry[0]||''):'').trim();
      if(!name) return null;
      const rawLines=Array.isArray(entry[1])?entry[1]:[];
      const lines=rawLines.map(row=>({id:uid(),kg:String(row&&row[0]!==undefined?row[0]:1),reps:String(row&&row[1]!==undefined?row[1]:1),sets:String(row&&row[2]!==undefined?row[2]:1)}));
      if(!lines.length) lines.push({id:uid(),kg:'1',reps:'1',sets:'1'});
      const first=lines[0];
      return {id:uid(),name,kg:first.kg,reps:first.reps,sets:first.sets,lines};
    }).filter(Boolean);
    const expanded={type:'easy-gym-plan',version:143,weekPlans:emptyDays(),savedPlanDays:{},datePlans:{},savedDatePlans:{},activeDatePlans:{}};
    (Array.isArray(data.w)?data.w:[]).forEach(pair=>{
      const day=String(pair&&pair[0]||'');
      const list=makeList(pair&&pair[1]);
      if(DAYS.includes(day)&&list.length){ expanded.weekPlans[day]=list; expanded.savedPlanDays[day]=true; }
    });
    (Array.isArray(data.d)?data.d:[]).forEach(pair=>{
      const iso=String(pair&&pair[0]||'');
      const list=makeList(pair&&pair[1]);
      if(iso&&list.length){ expanded.datePlans[iso]=list; expanded.savedDatePlans[iso]=true; expanded.activeDatePlans[iso]=true; }
    });
    return expanded;
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
  function ultraCompactPlanPayload(){
    const names=[];
    const nameMap=new Map();
    const nameIndex=name=>{
      const clean=String(name||'').trim();
      if(!nameMap.has(clean)){ nameMap.set(clean,names.length); names.push(clean); }
      return nameMap.get(clean);
    };
    const packList=list=>(Array.isArray(list)?list:[]).filter(item=>item&&item.name).map(item=>{
      const sourceLines=(Array.isArray(item.lines)&&item.lines.length)?item.lines:[item];
      const flat=[];
      sourceLines.forEach(line=>{ flat.push(compactValue(line&&line.kg),compactValue(line&&line.reps),compactValue(line&&line.sets)); });
      return [nameIndex(item.name),flat];
    }).filter(row=>row[1]&&row[1].length);
    const dateIsos=Object.keys(datePlans||{}).sort().filter(iso=>Array.isArray(datePlans[iso])&&datePlans[iso].length&&isoDayNumber(iso)!==null);
    const baseNum=dateIsos.length?isoDayNumber(dateIsos[0]):0;
    const dateEntries=dateIsos.map(iso=>[isoDayNumber(iso)-baseNum,packList(datePlans[iso])]).filter(entry=>entry[1].length);
    const weekEntries=DAYS.map((day,i)=>Array.isArray(weekPlans[day])&&weekPlans[day].length?[i,packList(weekPlans[day])]:null).filter(Boolean).filter(entry=>entry[1].length);
    return ['egp4',baseNum,names,dateEntries,weekEntries];
  }
  function expandUltraCompactPlanPayload(data){
    if(!Array.isArray(data)||data[0]!=='egp4') return data;
    const baseNum=Number(data[1]||0);
    const names=Array.isArray(data[2])?data[2]:[];
    const makeList=rows=>(Array.isArray(rows)?rows:[]).map(row=>{
      const name=String(names[Number(row&&row[0])]||'').trim();
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
  async function buildPlanLinkFromSignature(signature){
    let encoded=await gzipBase64UrlEncode(signature);
    let link='';
    if(encoded){
      link=`${cleanAppPath()}#p4=${encoded}`;
    }else{
      const payload=compactPlanPayload();
      encoded=base64UrlEncodeUnicode(JSON.stringify(payload));
      link=`${cleanAppPath()}#p2=${encoded}`;
    }
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
    toast(t('directLinkComingSoon'));
  }
  async function handleIncomingPlanLink(){
    const source=(location.hash||'')+'&'+(location.search||'').replace(/^\?/,'#');
    const p4=source.match(/[#&]p4=([^&]+)/);
    const p3=source.match(/[#&]p3=([^&]+)/);
    const p2=source.match(/[#&]p2=([^&]+)/);
    const legacy=source.match(/[#&]plan=([^&]+)/);
    const m=p4||p3||p2||legacy;
    if(!m)return;
    let data=null;
    try{
      if(p4){ data=JSON.parse(await gzipBase64UrlDecode(m[1])); data=expandUltraCompactPlanPayload(data); }
      else if(p3){ data=JSON.parse(await gzipBase64UrlDecode(m[1])); data=expandCompactPlanPayload(data); }
      else { data=JSON.parse(base64UrlDecodeUnicode(m[1])); if(p2) data=expandCompactPlanPayload(data); }
    }catch(e){ history.replaceState(null,'',location.pathname); toast(t('importFailed')); return; }
    if(confirm(t('confirmInsert'))){
      try{ importPlanData(data); }catch(e){ toast(t('insertFailed')); }
    }
    history.replaceState(null,'',location.pathname);
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

  window.addEventListener('DOMContentLoaded', init);
})();
