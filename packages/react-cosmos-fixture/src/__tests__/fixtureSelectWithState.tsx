import retry from '@skidding/async-retry';
import React from 'react';
import {
  createFixtureStateProps,
  createValues
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { testFixtureLoader } from '../testHelpers';
import { HelloMessage } from '../testHelpers/components';

const rendererId = uuid();
const fixtures = {
  first: <HelloMessage name="Bianca" />
};
const fixtureId = { path: 'first', name: null };

testFixtureLoader(
  'renders selected fixture with fixture state',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    await selectFixture({
      rendererId,
      fixtureId,
      fixtureState: {
        props: createFixtureStateProps({
          fixtureState: {},
          elementId: { decoratorId: 'root', elPath: '' },
          values: createValues({ name: 'B' }),
          componentName: 'HelloMessage'
        })
      }
    });
    await retry(() => expect(renderer.toJSON()).toBe('Hello B'));
  }
);
