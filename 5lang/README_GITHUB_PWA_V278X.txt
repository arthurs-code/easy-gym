Easy Gym PWA v278X — GitHub Pages package

Built directly from PWA v277X.

Changes in v278X:
- Share Plan now uses one direct navigator.share({files:[Plan.json]}) call from the original user tap.
- The shared attachment is named exactly Plan.json.
- The File uses the same text/plain file-sharing route proven by Share LOG, while retaining the .json extension and valid JSON content.
- Removed MIME probing, text-only fallback, Blob navigation and any download fallback from Share Plan.
- Added cache-bypassed service-worker update registration so installed PWAs fetch this build more reliably.
- Save Plan remains the only local-download action.
- Share Plan as Link remains disabled and marked as available in the App Store version.
- Custom Easy Gym confirmation dialogs remain unchanged.
- All other PLAN/GO/LOG, report, storage, donation, translation, icon and layout behavior is preserved.

Upload the contents of this ZIP directly to the GitHub Pages publishing root.
