import retry from '@skidding/async-retry';
import React from 'react';
import { CosmosDecoratorProps, uuid } from 'react-cosmos-core';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtures = wrapDefaultExport({
  'src/foo/__fixtures__/default.js': 'Hello!',
});
const decorators = wrapDefaultExport({
  'src/decorator.js': ({ children }: CosmosDecoratorProps) => (
    <>Decorated at src{children}</>
  ),
  'src/foo/decorator.js': ({ children }: CosmosDecoratorProps) => (
    <>Decorated at src/foo{children}</>
  ),
  'src/bar/decorator.js': ({ children }: CosmosDecoratorProps) => (
    <>Decorated at src/bar{children}</>
  ),
});

testRenderer(
  'renders selected fixture inside decorator',
  { rendererId, fixtures, decorators },
  async ({ renderer, selectFixture }) => {
    const [path] = Object.keys(fixtures);
    selectFixture({
      rendererId,
      fixtureId: { path },
      fixtureState: {},
    });
    // "src/bar/decorator" should be omitted because it's not a placed in
    // a parent directory of the selected fixture
    await retry(() =>
      expect(renderer.toJSON()).toEqual([
        'Decorated at src',
        'Decorated at src/foo',
        'Hello!',
      ])
    );
  }
);
