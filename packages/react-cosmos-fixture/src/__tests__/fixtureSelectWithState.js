// @flow

import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { createCompFixtureState } from 'react-cosmos-shared2/fixtureState';
import { HelloMessage } from '../testHelpers/components';
import { createFxValues } from '../testHelpers/fixtureState';
import { runTests, mount } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: <HelloMessage name="Bianca" />
};
const decorators = {};

runTests(mockConnect => {
  it('renders selected fixture with fixture state', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          await selectFixture({
            rendererId,
            fixtureId: { path: 'first', name: null },
            fixtureState: {
              components: createCompFixtureState({
                fixtureState: null,
                decoratorId: 'root',
                elPath: '',
                componentName: 'HelloMessage',
                renderKey: 0,
                props: createFxValues({ name: 'B' }),
                state: null
              })
            }
          });

          expect(renderer.toJSON()).toBe('Hello B');
        }
      );
    });
  });
});
