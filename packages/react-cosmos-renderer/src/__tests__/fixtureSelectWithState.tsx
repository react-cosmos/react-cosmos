import retry from '@skidding/async-retry';
import React from 'react';
import {
  createPropsFixtureStateItem,
  createValues,
  uuid,
} from 'react-cosmos-core';
import { HelloMessage } from '../testHelpers/components.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtures = wrapDefaultExport({
  first: <HelloMessage name="Blanca" />,
});
const fixtureId = { path: 'first' };

// Skipped because of https://github.com/react-cosmos/react-cosmos/pull/1614
testRenderer(
  'renders selected fixture with fixture state',
  { rendererId, fixtures, skip: true },
  async ({ renderer, selectFixture }) => {
    selectFixture({
      rendererId,
      fixtureId,
      fixtureState: {
        props: createPropsFixtureStateItem({
          propsFs: undefined,
          elementId: { decoratorId: 'root', elPath: '' },
          values: createValues({ name: 'B' }),
          componentName: 'HelloMessage',
        }),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('Hello B'));
  }
);
