// @flow

import type { ComponentType } from 'react';
import type { FixtureType } from './fixture';

export type Modules = {
  [string]: Object | Array<Object>
};

// Component info is gathered via static analysis (AST) and can fail. But the
// name is primarily read at run time, with this as a backup plan.
export type ComponentInfo = {
  name: string | null,
  filePath: string | null
};

export type FixtureFile = {
  filePath: string,
  components: Array<ComponentInfo>
};

export type Fixture = {
  filePath: string,
  name: string,
  namespace: string,
  source: FixtureType<*>
};

export type Component = {
  filePath: string | null,
  name: string,
  namespace: string,
  type: ComponentType<*>,
  fixtures: Array<Fixture>
};

export type Fixtures = {
  [componentName: string]: {
    [fixtureName: string]: FixtureType<*>
  }
};

export type FixtureNames = {
  [componentName: string]: Array<string>
};

// TODO: Future UI types
//
// type ComponentNode = {
//   component: Component
// };
//
// type FixtureNode = {
//   fixture: Fixture
// };
//
// export type TreeNode = (ComponentNode | FixtureNode) & {
//   children: Array<TreeNode>
// };
