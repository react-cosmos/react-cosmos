// @flow
// This file is populated with user data at compile-time

import type { Node } from 'react';

type NodesByPath = {
  [path: string]: Node
};

declare var __COSMOS_FIXTURES: NodesByPath;
declare var __COSMOS_DECORATORS: NodesByPath;

export const fixtures = __COSMOS_FIXTURES;
export const decorators = __COSMOS_DECORATORS;
