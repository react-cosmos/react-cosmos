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

export class HelloMessage extends Component<{ name?: string }> {
  render() {
    return `Hello ${this.props.name || 'Stranger'}`;
  }
}

const rendererId = uuid();
const fixtures = {
  first: (
    <>
      <HelloMessage name="Bianca" />
      <HelloMessage name="B" />
    </>
  )
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('captures multiple props instances', async () => {
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
              props: updateFixtureStateProps(fixtureState, instanceId, [
                createNamePropValue('Petec')
              ])
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

function createNamePropValue(name) {
  return {
    serializable: true,
    key: 'name',
    stringified: `"${name}"`
  };
}

function getPropsInstanceShape(suffix) {
  return {
    instanceId: expect.any(Number),
    componentName: 'HelloMessage',
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        stringified: `"${suffix}"`
      }
    ]
  };
}
