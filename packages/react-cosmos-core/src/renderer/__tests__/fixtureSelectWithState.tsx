import retry from '@skidding/async-retry';
import React from 'react';
import { createValues } from '../../fixtureState/createValues.js';
import { createFixtureStateProps } from '../../fixtureState/props.js';
import { uuid } from '../../utils/uuid.js';
import { HelloMessage } from '../testHelpers/components.js';
import { testFixtureLoader } from '../testHelpers/testFixtureLoader.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

const rendererId = uuid();
const fixtures = wrapFixtures({
  first: <HelloMessage name="Bianca" />,
});
const fixtureId = { path: 'first' };

testFixtureLoader(
  'renders selected fixture with fixture state',
  { rendererId, fixtures },
  async ({ renderer, selectFixture }) => {
    selectFixture({
      rendererId,
      fixtureId,
      fixtureState: {
        props: createFixtureStateProps({
          fixtureState: {},
          elementId: { decoratorId: 'root', elPath: '' },
          values: createValues({ name: 'B' }),
          componentName: 'HelloMessage',
        }),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('Hello B'));
  }
);
