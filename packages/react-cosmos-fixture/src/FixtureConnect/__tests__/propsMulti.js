// @flow

import React from 'react';
import {
  getCompFixtureStates,
  updateCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { HelloMessage } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { mockConnect as mockPostMessage } from '../testHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../testHelpers/webSockets';
import { mount } from '../testHelpers/mount';

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
              components: [
                createCompFxState({
                  componentName: 'HelloMessage',
                  elPath: 'props.children[0]',
                  props: createFxValues({ name: 'Bianca' })
                }),
                createCompFxState({
                  componentName: 'HelloMessage',
                  elPath: 'props.children[1]',
                  props: createFxValues({ name: 'B' })
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
          const [, { decoratorId, elPath }] = getCompFixtureStates(
            fixtureState
          );
          await setFixtureState({
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              components: updateCompFixtureState({
                fixtureState,
                decoratorId,
                elPath,
                props: createFxValues({ name: 'Petec' })
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
                components: [
                  createCompFxState({
                    elPath: 'props.children[0]',
                    props: createFxValues({ name: 'Bianca' })
                  }),
                  createCompFxState({
                    elPath: 'props.children[1]',
                    props: createFxValues({ name: 'Petec' })
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
