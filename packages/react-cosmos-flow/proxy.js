// @flow

import type { ComponentType } from 'react';
import type { LinkedItem } from './linked-list';

export type ProxyProps = {
  nextProxy: LinkedItem<ComponentType<ProxyProps>>,
  fixture: Object,
  onComponentRef: Function,
  onFixtureUpdate: Function
};

// $Subtype allows us to type proxy components that have additional props with
// the Proxy type.
export type Proxy = ComponentType<$Subtype<ProxyProps>>;
