import React from 'react';

const componentNames: WeakMap<React.ComponentType, string> = new WeakMap();

export function getComponentName(type: string | React.ComponentType): string {
  if (typeof type === 'string') {
    return type;
  }

  if (!componentNames.has(type)) {
    const name = type.displayName || type.name || '';
    componentNames.set(type, name);
  }

  return componentNames.get(type) as string;
}
