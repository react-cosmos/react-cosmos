'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.inferComponentName = inferComponentName;

var disallowedNames = ['_class', 'component'];

function filterName(name) {
  return name && disallowedNames.indexOf(name) === -1 ? name : null;
}

/**
 * Infer name from Component type (Class or function)
 */
function inferComponentName(componentType) {
  return (
    // .displayName property can be added on all types of components.
    // Warnings: displayName needs to be a static property on ES classes (not
    // an instance property!)
    filterName(componentType.displayName) ||
    // .name works automatically for:
    // - Named ES classes
    // - Named arrow functions
    filterName(componentType.name)
  );
}
