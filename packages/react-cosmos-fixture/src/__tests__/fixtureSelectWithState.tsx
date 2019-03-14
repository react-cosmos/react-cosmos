import * as React from 'react';
import retry from '@skidding/async-retry';
import { uuid } from 'react-cosmos-shared2/util';
import { createCompFixtureState } from 'react-cosmos-shared2/fixtureState';
import { HelloMessage } from '../testHelpers/components';
import { createFxValues } from '../testHelpers/fixtureState';
import { runFixtureConnectTests } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: <HelloMessage name="Bianca" />
};
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureConnectTests(mount => {
  it('renders selected fixture with fixture state', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ renderer, selectFixture }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {
            components: createCompFixtureState({
              fixtureState: {},
              decoratorId: 'root',
              elPath: '',
              componentName: 'HelloMessage',
              props: createFxValues({ name: 'B' }),
              state: null
            })
          }
        });
        await retry(() => expect(renderer.toJSON()).toBe('Hello B'));
      }
    );
  });
});
