if (window.self !== window.top) {
  return; // do not execute mashup in IFrame
}

tau.mashups
  .addDependency('libs/jquery/jquery')
  .addDependency('https://raw.github.com/bestiejs/xstats.js/master/xstats.js')
  .addMashup(function ($, dummy, config) {
    var stats = new xStats();
    $.extend(stats.element.style, {position: 'fixed', left: '0', top: '0', 'zIndex': 1000});
    document.body.appendChild(stats.element);
  });