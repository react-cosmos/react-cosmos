// @flow

import React, { Component } from 'react';
import {
  getFixtureStateState,
  updateFixtureStateState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from '../../shared/uuid';
import { ComponentState } from '../../ComponentState';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

export class Counter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    const { count } = this.state;

    return typeof count === 'number' ? `${count} times` : 'Missing count';
  }
}

const rendererId = uuid();
const fixtures = {
  first: (
    <>
      <ComponentState state={{ count: 5 }}>
        <Counter />
      </ComponentState>
      <ComponentState state={{ count: 10 }}>
        <Counter />
      </ComponentState>
    </>
  )
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('captures mocked state from multiple instances', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(getElement({ rendererId, fixtures }), async () => {
        await selectFixture({
          rendererId,
          fixturePath: 'first'
        });

        await untilMessage({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              props: [
                getEmptyPropsInstanceShape(),
                getEmptyPropsInstanceShape()
              ],
              state: [getStateInstanceShape(5), getStateInstanceShape(10)]
            }
          }
        });
      });
    });
  });

  it('overwrites mocked state in second instances', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        lastFixtureState,
        setFixtureState
      }) => {
        await mount(getElement({ rendererId, fixtures }), async renderer => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [, { instanceId }] = getFixtureStateState(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              state: updateFixtureStateState(fixtureState, instanceId, [
                createCountStateValue(100)
              ])
            }
          });

          expect(renderer.toJSON()).toEqual(['5 times', '100 times']);
        });
      }
    );
  });
}

function createCountStateValue(count: number) {
  return {
    serializable: true,
    key: 'count',
    stringified: `${count}`
  };
}

function getEmptyPropsInstanceShape() {
  return {
    instanceId: expect.any(Number),
    componentName: 'Counter',
    renderKey: expect.any(Number),
    values: []
  };
}

function getStateInstanceShape(count: number) {
  return {
    instanceId: expect.any(Number),
    componentName: 'Counter',
    values: [
      {
        serializable: true,
        key: 'count',
        stringified: `${count}`
      }
    ]
  };
}
