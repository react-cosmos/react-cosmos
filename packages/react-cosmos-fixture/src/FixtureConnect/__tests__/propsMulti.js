// @flow

import React, { Component } from 'react';
import {
  getPropsFixtureState,
  updatePropsFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from '../../shared/uuid';
import { mockConnect as mockPostMessage } from '../jestHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../jestHelpers/webSockets';
import { mount } from '../jestHelpers/mount';

class HelloMessage extends Component<{ name?: string }> {
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
      await mount(getElement({ rendererId, fixtures }), async renderer => {
        await selectFixture({
          rendererId,
          fixturePath: 'first'
        });

        expect(renderer.toJSON()).toEqual(['Hello Bianca', 'Hello B']);

        await untilMessage({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              props: [
                getPropsInstanceShape({
                  name: 'Bianca',
                  elPath: 'props.children[0]'
                }),
                getPropsInstanceShape({
                  name: 'B',
                  elPath: 'props.children[1]'
                })
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
        await mount(getElement({ rendererId, fixtures }), async renderer => {
          await selectFixture({
            rendererId,
            fixturePath: 'first'
          });

          const fixtureState = await lastFixtureState();
          const [, { decoratorId, elPath }] = getPropsFixtureState(
            fixtureState
          );
          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: updatePropsFixtureState({
                fixtureState,
                decoratorId,
                elPath,
                values: [createNamePropValue('Petec')]
              })
            }
          });

          expect(renderer.toJSON()).toEqual(['Hello Bianca', 'Hello Petec']);

          await untilMessage({
            type: 'fixtureState',
            payload: {
              rendererId,
              fixturePath: 'first',
              fixtureState: {
                props: [
                  getPropsInstanceShape({
                    name: 'Bianca',
                    elPath: 'props.children[0]'
                  }),
                  getPropsInstanceShape({
                    name: 'Petec',
                    elPath: 'props.children[1]'
                  })
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

function getPropsInstanceShape({ name, elPath }) {
  return {
    decoratorId: expect.any(Number),
    elPath,
    componentName: 'HelloMessage',
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        stringified: `"${name}"`
      }
    ]
  };
}
