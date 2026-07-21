Easy Gym PWA v276X — GitHub Pages package

Built directly from PWA v275X.

Changes in v276X:
- Share Plan now uses the native share sheet directly and attaches one real file named Plan.json.
- Share Plan uses the proven text/plain file-sharing path used successfully by Share LOG, while retaining the .json filename and JSON content.
- Share Plan never falls back to a local download; unsupported browsers receive an Easy Gym in-app notice and can use Save Plan separately.
- Replaced browser confirm() dialogs with one reusable Easy Gym dialog for Insert Plan, incoming Plan-Link import, Restore and Delete Data.
- Delete confirmation uses the destructive red action; Insert and Restore use gold actions.
- Added translated dialog text for EN, DE, FR, IT and ES.
- Added keyboard focus trapping, Escape cancellation, backdrop cancellation, focus restoration and ARIA dialog semantics.
- Preserved all underlying import, restore, deletion, PLAN/GO/LOG, report, storage, donation and language behavior.

Upload the contents of this ZIP directly to the GitHub Pages publishing root.
