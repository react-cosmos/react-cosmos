// @flow

import { Component } from 'react';

import type { ComponentType, ElementRef } from 'react';
import type { ComponentMetadata } from '../types';

const componentNames: WeakMap<ComponentType<any>, string> = new WeakMap();
const instanceIds: WeakMap<
  ElementRef<typeof Component>,
  number
> = new WeakMap();

let lastInstanceId = 0;

export function getComponentMetadata(
  type: ComponentType<any>,
  instance: ElementRef<typeof Component>
): ComponentMetadata {
  return {
    instanceId: getInstanceId(instance),
    name: getComponentName(type)
  };
}

export function getInstanceId(instance: ElementRef<typeof Component>): number {
  if (instanceIds.has(instance)) {
    // $FlowFixMe https://github.com/facebook/flow/issues/2751
    return instanceIds.get(instance);
  }

  const componentId = ++lastInstanceId;
  instanceIds.set(instance, componentId);

  return componentId;
}

function getComponentName(type: ComponentType<any>): string {
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
