// @flow

import React, { Component } from 'react';
import {
  getFixtureStateProps,
  getFixtureStateState,
  updateFixtureStateProps,
  updateFixtureStateState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from '../../shared/uuid';
import { ComponentState } from '../../ComponentState';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

class Counter extends Component<{ suffix: string }, { count: number }> {
  state = { count: 0 };

  render() {
    return `${this.state.count} ${this.props.suffix}`;
  }
}

const rendererId = uuid();
const fixtures = {
  first: (
    <ComponentState>
      <Counter suffix="times" />
    </ComponentState>
  )
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('keeps state when resetting props', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        untilMessage,
        lastFixtureState,
        setFixtureState
      }) => {
        await mount(getElement({ rendererId, fixtures }), async instance => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [props] = getFixtureStateProps(fixtureState);
          const [state] = getFixtureStateState(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              state: updateFixtureStateState(fixtureState, state.instanceId, [
                createCountStateValue(5)
              ])
            }
          });

          expect(instance.toJSON()).toBe('5 times');

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: updateFixtureStateProps(
                fixtureState,
                props.instanceId,
                [createSuffixPropValue('timez')],
                true
              )
            }
          });

          expect(instance.toJSON()).toBe('5 timez');

          await untilMessage({
            type: 'fixtureState',
            payload: {
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                props: [getPropsInstanceShape('timez')],
                state: [getStateInstanceShape(5)]
              }
            }
          });
        });
      }
    );
  });

  it('keeps state when transitioning props', async () => {
    await mockConnect(
      async ({
        getElement,
        selectFixture,
        untilMessage,
        lastFixtureState,
        setFixtureState
      }) => {
        await mount(getElement({ rendererId, fixtures }), async instance => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [props] = getFixtureStateProps(fixtureState);
          const [state] = getFixtureStateState(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              state: updateFixtureStateState(fixtureState, state.instanceId, [
                createCountStateValue(5)
              ])
            }
          });

          expect(instance.toJSON()).toBe('5 times');

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: updateFixtureStateProps(fixtureState, props.instanceId, [
                createSuffixPropValue('timez')
              ])
            }
          });

          expect(instance.toJSON()).toBe('5 timez');

          await untilMessage({
            type: 'fixtureState',
            payload: {
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                props: [getPropsInstanceShape('timez')],
                state: [getStateInstanceShape(5)]
              }
            }
          });
        });
      }
    );
  });
}

function createSuffixPropValue(suffix) {
  return {
    serializable: true,
    key: 'suffix',
    stringified: `"${suffix}"`
  };
}

function getPropsInstanceShape(suffix) {
  return {
    instanceId: expect.any(Number),
    componentName: 'Counter',
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'suffix',
        stringified: `"${suffix}"`
      }
    ]
  };
}

function createCountStateValue(count: number) {
  return {
    serializable: true,
    key: 'count',
    stringified: `${count}`
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
