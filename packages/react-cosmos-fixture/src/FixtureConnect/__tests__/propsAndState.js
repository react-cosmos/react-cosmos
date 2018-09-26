// @flow

import React, { Component } from 'react';
import {
  getPropsFixtureState,
  getStateFixtureState,
  updatePropsFixtureState,
  updateStateFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from '../../shared/uuid';
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
  first: <Counter suffix="times" />
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
        await mount(getElement({ rendererId, fixtures }), async renderer => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [props] = getPropsFixtureState(fixtureState);
          const [state] = getStateFixtureState(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              state: updateStateFixtureState({
                fixtureState,
                elPath: state.elPath,
                decoratorId: state.decoratorId,
                values: [createCountStateValue(5)]
              })
            }
          });

          expect(renderer.toJSON()).toBe('5 times');

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: updatePropsFixtureState({
                fixtureState,
                decoratorId: props.decoratorId,
                elPath: props.elPath,
                values: [createSuffixPropValue('timez')],
                resetInstance: true
              })
            }
          });

          expect(renderer.toJSON()).toBe('5 timez');

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
        await mount(getElement({ rendererId, fixtures }), async renderer => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [props] = getPropsFixtureState(fixtureState);
          const [state] = getStateFixtureState(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              state: updateStateFixtureState({
                fixtureState,
                decoratorId: state.decoratorId,
                elPath: state.elPath,
                values: [createCountStateValue(5)]
              })
            }
          });

          expect(renderer.toJSON()).toBe('5 times');

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: updatePropsFixtureState({
                fixtureState,
                decoratorId: props.decoratorId,
                elPath: props.elPath,
                values: [createSuffixPropValue('timez')]
              })
            }
          });

          expect(renderer.toJSON()).toBe('5 timez');

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

  it('updates props on fixture change', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(getElement({ rendererId, fixtures }), async renderer => {
        await selectFixture({
          rendererId,
          fixturePath: 'first'
        });

        renderer.update(
          getElement({
            rendererId,
            fixtures: {
              first: <Counter suffix="timez" />
            }
          })
        );

        expect(renderer.toJSON()).toBe('0 timez');

        await untilMessage({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              props: [getPropsInstanceShape('timez')],
              state: [getStateInstanceShape(0)]
            }
          }
        });
      });
    });
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
    decoratorId: expect.any(Number),
    elPath: expect.any(String),
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
