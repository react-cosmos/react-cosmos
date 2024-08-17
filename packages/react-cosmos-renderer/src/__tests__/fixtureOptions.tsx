import retry from '@skidding/async-retry';
import React from 'react';
import { DecoratorProps, uuid } from 'react-cosmos-core';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

type FixtureOptions = {
  viewport: { width: number; height: number };
};

const rendererId = uuid();
const fixtures = {
  'fixture1.js': {
    default: 'Hello World',
    options: {
      viewport: { width: 320, height: 240 },
    },
  },
};
const decorators = wrapDefaultExport({
  'cosmos.decorator.js': ({ options }: DecoratorProps<FixtureOptions>) => (
    <>{JSON.stringify(options?.viewport)}</>
  ),
});

testRenderer(
  'renders selected fixture',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'fixture1.js' },
      fixtureState: {},
    });
    await retry(() => expect(renderer.toJSON()).toBe('Hello World'));
  }
);

testRenderer(
  'passes fixture options to decorator',
  { rendererId, fixtures, decorators },
  async ({ renderer, selectFixture }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'fixture1.js' },
      fixtureState: {},
    });
    await retry(() =>
      expect(renderer.toJSON()).toBe('{"width":320,"height":240}')
    );
  }
);

testRenderer(
  'returns fixture options in fixtureLoaded response',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureLoaded }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'fixture1.js' },
      fixtureState: {},
    });
    await fixtureLoaded({
      rendererId,
      fixture: { type: 'single' },
      fixtureOptions: {
        viewport: { width: 320, height: 240 },
      },
    });
  }
);
