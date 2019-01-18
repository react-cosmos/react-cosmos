// @flow
// This file is populated with user data at compile-time

import type { Fixtures, DecoratorsByPath } from 'react-cosmos-fixture';

// Global imports used to be added as bundle entry points but they were moved
// here to make them hot reload-able, which works because the file that imports
// this file knows how to accept hot reload patches
/* __INJECT_GLOBAL_IMPORTS__ */

declare var __COSMOS_FIXTURES: Fixtures;
declare var __COSMOS_DECORATORS: DecoratorsByPath;

export const fixtures = __COSMOS_FIXTURES;
export const decorators = __COSMOS_DECORATORS;
