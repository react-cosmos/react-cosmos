// @flow

import type { ComponentType } from 'react';

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
  fixtureIndex: number | null,
  name: string,
  namespace: string
};

export type Fixtures = Array<Fixture>;

export type FixturesByComponent = Map<ComponentType<*>, Fixtures>;

export type Component = {
  filePath: string | null,
  name: string,
  namespace: string,
  type: ComponentType<*>,
  fixtures: Fixtures
};

export type Components = Array<Component>;

type ComponentNode = {
  component: Component
};

type FixtureNode = {
  fixture: Fixture
};

export type TreeNode = (ComponentNode | FixtureNode) & {
  children: Array<TreeNode>
};
