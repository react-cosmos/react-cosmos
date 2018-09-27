// @flow

import type { ComponentType, ElementType } from 'react';

const componentNames: WeakMap<ComponentType<any>, string> = new WeakMap();

export function getComponentName(type: ElementType): string {
  if (typeof type === 'string') {
    return type;
  }

  if (componentNames.has(type)) {
    // $FlowFixMe https://github.com/facebook/flow/issues/2751
    return componentNames.get(type);
  }

  // TODO: Improve name detection
  // See packages/react-cosmos-voyager2/src/client/utils/infer-component-name.js
  const { name } = type;
  componentNames.set(type, name);

  return name;
}
