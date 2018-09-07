// @flow

import React, { Component } from 'react';
import {
  getFixtureStateProps,
  updateFixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from '../../shared/uuid';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('posts fixture state with props instances', async () => {
    const rendererId = uuid();
    const fixtures = {
      first: (
        <>
          <MyComponent name="Bianca" />
          <MyComponent name="B" />
        </>
      )
    };

    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(getElement({ rendererId, fixtures }), async instance => {
        await selectFixture({
          rendererId,
          fixturePath: 'first'
        });

        expect(instance.toJSON()).toEqual(['Hello Bianca', 'Hello B']);

        await untilMessage({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              props: [
                getPropsInstanceShape('Bianca'),
                getPropsInstanceShape('B')
              ]
            }
          }
        });
      });
    });
  });

  it('overwrites prop in second instance', async () => {
    const rendererId = uuid();
    const fixtures = {
      first: (
        <>
          <MyComponent name="Bianca" />
          <MyComponent name="B" />
        </>
      )
    };

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
          const [, { instanceId }] = getFixtureStateProps(fixtureState);

          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: updateFixtureStateProps(fixtureState, instanceId, {
                name: 'Petec'
              })
            }
          });

          expect(instance.toJSON()).toEqual(['Hello Bianca', 'Hello Petec']);

          await untilMessage({
            type: 'fixtureState',
            payload: {
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                props: [
                  getPropsInstanceShape('Bianca'),
                  getPropsInstanceShape('Petec')
                ]
              }
            }
          });
        });
      }
    );
  });
}

class MyComponent extends Component<{ name?: string }> {
  render() {
    return `Hello ${this.props.name || 'Stranger'}`;
  }
}

function getPropsInstanceShape(name) {
  return {
    instanceId: expect.any(Number),
    componentName: 'MyComponent',
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: name
      }
    ]
  };
}
