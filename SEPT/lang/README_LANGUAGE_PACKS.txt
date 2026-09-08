EASY GYM v225 — LANGUAGE PACKAGES

The app version remains v225.

FILES
- config.js: selects the visible languages, their order, and the default language.
- en.js / de.js / fr.js / it.js / es.js: independent interface packages loaded directly by the app.
- _template.js: copy this file when adding a new language.
- loader.js: loads additional enabled language packages. Do not edit it.

CHANGE AN EXISTING LANGUAGE
1. Open the relevant file, for example de.js.
2. Change text values only.
3. Keep all object keys and punctuation unchanged.
4. Upload the edited file to GitHub in the same lang folder.

ENABLE, DISABLE, OR REORDER LANGUAGES
Edit config.js only.
Example — English and German only:
  enabled: ["en", "de"]

Example — German first and used by default:
  defaultLanguage: "de",
  enabled: ["de", "en"]

ADD A NEW LANGUAGE
1. Copy _template.js and rename it, for example pt.js.
2. Replace the package code "xx" with "pt" in the copied file.
3. Translate the text values.
4. Add "pt" to enabled[] in config.js.
5. Upload pt.js together with the updated config.js.

The five included languages are loaded directly, so they remain available even if dynamic local-file loading is restricted by the browser. English is also retained internally as an emergency fallback.
