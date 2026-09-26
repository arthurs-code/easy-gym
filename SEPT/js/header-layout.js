/* v322X: measure the natural fixed header; no workout state changes. */
(function () {
  'use strict';
  var header = document.querySelector('.eg-system-header-anchor');
  if (!header) return;
  var previous = -1;
  function sync() {
    var style = window.getComputedStyle(header);
    // Top padding is safe-area inset + the authored 8px.
    var safeTop = Math.max(0, parseFloat(style.paddingTop) - 8);
    var height = Math.ceil(header.getBoundingClientRect().height - safeTop);
    if (height > 0 && height !== previous) {
      previous = height;
      document.documentElement.style.setProperty('--x-header-h', height + 'px');
    }
  }
  if (window.ResizeObserver) new ResizeObserver(sync).observe(header);
  window.addEventListener('resize', sync, {passive:true});
  window.addEventListener('pageshow', sync);
  header.querySelectorAll('img').forEach(function (img) { img.addEventListener('load', sync); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
  sync();
}());
