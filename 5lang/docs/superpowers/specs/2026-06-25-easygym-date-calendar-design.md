# Easy Gym — Version 4: Date Calendar Planning

Date: 2026-06-25
Status: Approved (design), pending implementation

## Goal

Two changes on top of Version 3:

1. **Today section:** when there is no saved/planned training, place the
   "Add Exercise" button immediately **beside** the "Create Training" label
   (adjacent, not pushed to the far edge of the row).

2. **Plan section:** replace the fixed current-week weekday strip with a
   **navigable calendar** that moves left/right one week at a time across the
   whole year (and beyond), so the user can **plan trainings in advance** on
   specific dates and **look back** at older trainings.

Decisions (from brainstorming):
- Plans are **date-specific** (each calendar date has its own plan), not a
  weekday template.
- Navigating to a **past date that was trained** shows the **actual completed
  training, read-only** (from the journal).
- **Do-it trains *today's* planned session** (the weekday picker is removed).

## Data model

New `localStorage` keys (added — existing keys are never renamed):
- `easyGym.datePlans.v1` → `{ "YYYY-MM-DD": [ {id,name,sets,kg,reps}, … ] }`
- `easyGym.savedDatePlans.v1` → `{ "YYYY-MM-DD": true }`

Retained unchanged:
- `easyGym.journal.v1` — completed sessions, already date-stamped
  (`{id,date,day,durationMs,exercises:[{name,sets:[{sets,kg,reps}]}]}`).
- `easyGym.trainSessions.v1` / `easyGym.trainStartTimes.v1` — transient live
  training state, keyed by today's weekday (only ever "today").
- Legacy `easyGym.weekPlans.v1` / `easyGym.savedPlans.v1` remain (not deleted),
  used only for one-time migration seeding.

Helpers:
- `hasDatePlan(iso)` = `savedDatePlans[iso] && datePlans[iso].length>0 && isDatePlanValid(iso)`
- `isDatePlanValid(iso)` = every exercise has a name and positive sets/kg/reps.
- `journalForDate(iso)` = journal entry whose `date === iso` (or null).

Migration (on load, once): if `datePlans` is empty and legacy weekday plans
exist, seed the **current week's** seven dates from the matching saved weekday
plans, so existing users keep their plans. Backup/restore/reset and
`hasAnyData()` include the two new keys.

## Plan section UI

State: `planWeekOffset` (int, 0 = current week), `selectedPlanDate` (ISO|null).

Navigation row + week strip:

```
        ◀     13 – 19 Jul 2026     ▶        [Today]
   Mon    Tue    Wed    Thu    Fri    Sat    Sun
   13     14     15     16     17     18     19
```

- `◀`/`▶` change `planWeekOffset` by ±1 (unbounded). `[Today]` resets to 0.
- Each day button shows weekday + day-of-month; today and the selected date are
  highlighted. Clicking sets `selectedPlanDate` to that ISO date.

Per selected date:
- **Has journal entry** → read-only "Completed" view: the exercises actually
  done that day (name · sets · kg · reps), like a Progress group.
- **Past date, no journal** → that date's plan, read-only (or "No training
  planned for this day").
- **Today or future** → editable plan editor on `datePlans[iso]`:
  Add Exercise (opens the exercise picker), per-row name/sets/kg/reps inputs,
  Remove (checkbox-selected), and Save. Title shows the date.

## Today section

Binds to `todayISO`:
- `hasDatePlan(todayISO)` → show today's plan read-only + **Start training**.
- else → inline create editor on `datePlans[todayISO]` with **"Add Exercise"
  beside "Create Training"**, plus Start training.
- **Start training**: if today's plan is valid, mark it saved, seed the live
  session from `datePlans[todayISO]`, start the timer, and switch to Do-it.

## Do-it section

- Always trains **today**. `selectedTrainDay` is forced to today's weekday on
  entry; the multi-weekday picker is replaced by a single today/date label.
- The live session is seeded from `datePlans[todayISO]` (unless one is already
  in progress). Timer, set buttons, add/remove-during-training, and
  **Stop & Save** are unchanged. Saving pushes a journal entry with
  `date = todayISO` — which then surfaces as the read-only completed view in the
  Plan calendar and Today.
- If today has no valid plan and no session in progress, show a hint linking to
  Today/Plan to plan first.

## Progress section

Unchanged.

## Out of scope (YAGNI)

- Applying a saved weekday template to an arbitrary date via UI (migration seeds
  the current week only).
- Month/grid calendar view (week strip + arrows is enough).
- Editing/Training on a date other than today.

## Verification

Headless-Chrome render + same-origin click harness (as used for v3):
- Today: "Add Exercise" sits beside "Create Training".
- Plan: `◀`/`▶` move the week and dates; selecting a future date edits an
  independent plan; a past trained date shows the completed session read-only.
- Start training from Today seeds today's plan and starts the timer in Do-it.
- Saving a training makes that date show as completed in the Plan calendar.

Service worker `CACHE` bumped to `easy-gym-v59`.
