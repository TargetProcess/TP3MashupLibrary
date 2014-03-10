var serviceUrl = 'https://tauboard.com';
require([serviceUrl + '/mashup/main.js', 'app.bus'], function (fnStart, $d) {
      fnStart(serviceUrl, {}, $d);
});