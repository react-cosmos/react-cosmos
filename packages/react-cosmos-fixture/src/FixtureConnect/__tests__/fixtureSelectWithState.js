// @flow

import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { createCompFixtureState } from 'react-cosmos-shared2/fixtureState';
import { HelloMessage } from '../testHelpers/components';
import { createFxValues } from '../testHelpers/fixtureState';
import { mockConnect as mockPostMessage } from '../testHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../testHelpers/webSockets';
import { mount } from '../testHelpers/mount';

const rendererId = uuid();
const fixtures = {
  first: <HelloMessage name="Bianca" />
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('renders selected fixture with fixture state', async () => {
    await mockConnect(async ({ getElement, selectFixture }) => {
      await mount(getElement({ rendererId, fixtures }), async renderer => {
        await selectFixture({
          rendererId,
          fixturePath: 'first',
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
      });
    });
  });
}
