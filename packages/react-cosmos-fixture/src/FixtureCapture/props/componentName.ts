import React from 'react';

const componentNames: WeakMap<React.ComponentType<any>, string> = new WeakMap();

export function getComponentName(
  type: string | React.ComponentType<any>
): string {
  if (typeof type === 'string') {
    return type;
  }

  if (componentNames.has(type)) {
    return componentNames.get(type) as string;
  }

  // TODO: Improve name detection
  // See https://github.com/react-cosmos/react-cosmos/blob/6214636c2e7e86f633be2fb79133c784dcf58f60/packages/react-cosmos-voyager2/src/client/utils/infer-component-name.js
  const name = type.name || '';
  componentNames.set(type, name);

  return name;
}
