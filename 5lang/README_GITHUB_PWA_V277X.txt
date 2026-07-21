Easy Gym PWA v277X — GitHub Pages package

Built directly from PWA v276X.

Changes in v277X:
- Share Plan now always opens the native system share environment when navigator.share is available.
- The app first tries to attach the exact Plan.json file using multiple compatible MIME declarations.
- On browser/OS combinations that reject .json attachments, it shares the complete plan JSON as text through the same native share sheet instead of showing the unavailable dialog or downloading locally.
- Save Plan remains the only local-download action.
- Share Plan as Link remains visible, disabled, and labeled as available in the App Store version.
- The custom Easy Gym confirmation dialogs from v276X remain unchanged.
- Preserved PLAN/GO/LOG, reports, storage, donation, translations, icons and all other behavior.

Upload the contents of this ZIP directly to the GitHub Pages publishing root.
