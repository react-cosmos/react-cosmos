// @flow

import type { ComponentType } from 'react';
import type { ComponentMetadata } from '../types';

const componentIds: WeakMap<ComponentType<any>, mixed> = new WeakMap();
let lastComponentId = 0;

export function getComponentMetadata(
  type: ComponentType<any>
): ComponentMetadata {
  return {
    id: getComponentId(type),
    name: getComponentName(type)
  };
}

export function getComponentId(type: ComponentType<any>): number {
  if (componentIds.has(type)) {
    // $FlowFixMe https://github.com/facebook/flow/issues/2751
    return componentIds.get(type);
  }

  const componentId = ++lastComponentId;
  componentIds.set(type, componentId);

  return componentId;
}

function getComponentName(type: ComponentType<any>): string {
  // TODO: Improve name detection
  // See packages/react-cosmos-voyager2/src/client/utils/infer-component-name.js
  return type.name;
}
