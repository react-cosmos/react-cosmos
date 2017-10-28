// @flow

import type { ComponentType } from 'react';
import type { LinkedItem } from '../linked-list';

export type ProxyProps = {
  nextProxy: LinkedItem<ComponentType<ProxyProps>>,
  fixture: Object,
  onComponentRef: Function,
  onFixtureUpdate: Function
};
