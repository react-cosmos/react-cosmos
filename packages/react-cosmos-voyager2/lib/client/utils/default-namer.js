'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createDefaultNamer = createDefaultNamer;

/**
 * Generate unique, consecutive default names
 * E.g. default, default (1), default (2), etc.
 */
function createDefaultNamer(baseName) {
  var count = 0;

  return function defaultNamer() {
    var name = count > 0 ? baseName + ' (' + count + ')' : baseName;
    count += 1;

    return name;
  };
}
