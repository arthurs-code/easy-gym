/* v315X: modal viewport geometry only. Compatible with iOS 15.0+. */
(function () {
  'use strict';
  var pending = false;
  function update() {
    pending = false;
    var viewport = window.visualViewport;
    // Preserve the user's pinch zoom instead of resizing the document to it.
    if (viewport && Math.abs(viewport.scale - 1) > 0.01) return;
    var height = viewport ? viewport.height : window.innerHeight;
    var top = viewport ? viewport.offsetTop : 0;
    document.documentElement.style.setProperty('--eg-viewport-height', height + 'px');
    document.documentElement.style.setProperty('--eg-viewport-top', top + 'px');
  }
  function schedule() {
    if (!pending) { pending = true; window.requestAnimationFrame(update); }
  }
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', schedule, { passive: true });
    window.visualViewport.addEventListener('scroll', schedule, { passive: true });
  }
  update();
}());
