/* Easy Gym v225 — language-package loader.
   Loads the enabled language files before the app starts.
   Works from GitHub Pages, normal web hosting, and direct local file opening. */
(function (root, doc) {
  'use strict';

  var config = root.EASY_GYM_LANGUAGE_CONFIG || {};
  var enabled = Array.isArray(config.enabled) ? config.enabled : ['en'];
  enabled = enabled
    .map(function (code) { return String(code || '').trim().toLowerCase(); })
    .filter(function (code, index, list) {
      return /^[a-z0-9-]+$/.test(code) && list.indexOf(code) === index;
    });
  if (!enabled.length) enabled = ['en'];

  root.EASY_GYM_ENABLED_LANGUAGES = enabled;
  root.EASY_GYM_LANGUAGE_PACKS = root.EASY_GYM_LANGUAGE_PACKS || {};

  var versionSuffix = (root.location && root.location.protocol === 'file:')
    ? ''
    : '?v=' + encodeURIComponent(config.version || 'v225');

  function loadLanguage(code) {
    if (root.EASY_GYM_LANGUAGE_PACKS[code]) return Promise.resolve(true);

    return new Promise(function (resolve) {
      var script = doc.createElement('script');
      script.src = './lang/' + code + '.js' + versionSuffix;
      script.async = false;
      script.onload = function () {
        resolve(Boolean(root.EASY_GYM_LANGUAGE_PACKS[code]));
      };
      script.onerror = function () {
        console.error('Easy Gym: language package could not be loaded:', code);
        resolve(false);
      };
      (doc.head || doc.documentElement).appendChild(script);
    });
  }

  root.EASY_GYM_LANGUAGE_READY = enabled.reduce(function (chain, code) {
    return chain.then(function () { return loadLanguage(code); });
  }, Promise.resolve());
})(window, document);
