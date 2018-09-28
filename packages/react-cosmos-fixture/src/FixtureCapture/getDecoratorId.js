// @flow

import { Component } from 'react';

import type { ElementRef } from 'react';
import type { FixtureDecoratorId } from 'react-cosmos-shared2/fixtureState';

const decoratorIds: WeakMap<
  ElementRef<typeof Component>,
  FixtureDecoratorId
> = new WeakMap();

let lastInstanceId = 0;

export function getDecoratorId(
  instance: ElementRef<typeof Component>
): FixtureDecoratorId {
  if (decoratorIds.has(instance)) {
    // $FlowFixMe https://github.com/facebook/flow/issues/2751
    return decoratorIds.get(instance);
  }

  const componentId = ++lastInstanceId;
  decoratorIds.set(instance, componentId);

  return componentId;
}
