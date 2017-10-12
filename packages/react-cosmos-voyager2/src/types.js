// @flow

import type { ComponentType } from 'react';

export type Modules = {
  [string]: Object
};

// Component info is gathered via static analysis (AST) and can fail. Real
// time meta data is used to cover up for these hopes on the client side
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
  source: Object
};

export type Component = {
  filePath: string | null,
  name: string,
  namespace: string,
  type: ComponentType<*>,
  fixtures: Array<Fixture>
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
