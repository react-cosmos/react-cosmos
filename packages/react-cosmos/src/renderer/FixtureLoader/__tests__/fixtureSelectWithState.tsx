import retry from '@skidding/async-retry';
import React from 'react';
import { createValues } from '../../../core/fixtureState/createValues';
import { createFixtureStateProps } from '../../../core/fixtureState/props';
import { uuid } from '../../../utils/uuid';
import { testFixtureLoader } from '../testHelpers';
import { HelloMessage } from '../testHelpers/components';
import { wrapFixtures } from '../testHelpers/wrapFixture';

const rendererId = uuid();
const fixtures = wrapFixtures({
  first: <HelloMessage name="Bianca" />,
});
const fixtureId = { path: 'first' };

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
          componentName: 'HelloMessage',
        }),
      },
    });
    await retry(() => expect(renderer.toJSON()).toBe('Hello B'));
  }
);
