// @flow

import type { ComponentType } from 'react';

const disallowedNames = ['_class', 'component'];

function filterName(name: ?string): ?string {
  return name && disallowedNames.indexOf(name) === -1 ? name : null;
}

/**
 * Infer name from Component type (Class or function)
 */
export function inferComponentName(componentType: ComponentType<*>): ?string {
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
