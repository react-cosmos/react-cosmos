'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.log = log;
exports.warn = warn;

// TODO: Cache per message/type
var alreadyLogged = false;

function log(msg) {
  var type =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'log';

  if (!alreadyLogged) {
    console[type](msg);
    alreadyLogged = true;
  }
}

function warn(msg) {
  log(msg, 'warn');
}
