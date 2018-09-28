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
  // See https://github.com/react-cosmos/react-cosmos/blob/6214636c2e7e86f633be2fb79133c784dcf58f60/packages/react-cosmos-voyager2/src/client/utils/infer-component-name.js
  const { name } = type;
  componentNames.set(type, name);

  return name;
}
