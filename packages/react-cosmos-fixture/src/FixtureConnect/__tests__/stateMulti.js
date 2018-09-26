// @flow

import React, { Component } from 'react';
import {
  getStateFixtureState,
  updateStateFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { StateMock } from '@react-mock/state';
import { uuid } from '../../shared/uuid';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

class Counter extends Component<{}, { count: number }> {
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
      <StateMock state={{ count: 5 }}>
        <Counter />
      </StateMock>
      <StateMock state={{ count: 10 }}>
        <Counter />
      </StateMock>
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
          const [, { decoratorId, elPath }] = getStateFixtureState(
            fixtureState
          );

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              state: updateStateFixtureState({
                fixtureState,
                decoratorId,
                elPath,
                values: [createCountStateValue(100)]
              })
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
    decoratorId: expect.any(Number),
    elPath: expect.any(String),
    componentName: 'Counter',
    renderKey: expect.any(Number),
    values: []
  };
}

function getStateInstanceShape(count: number) {
  return {
    decoratorId: expect.any(Number),
    elPath: expect.any(String),
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
