// @flow

import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { FixtureCapture } from '../../FixtureCapture';
import { HelloMessage } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { mockConnect as mockPostMessage } from '../testHelpers/postMessage';
import { mockConnect as mockWebSockets } from '../testHelpers/webSockets';
import { mount } from '../testHelpers/mount';

function Wrap({ children }) {
  return children();
}

Wrap.cosmosCapture = false;

const rendererId = uuid();
const fixtures = {
  first: (
    <>
      <Wrap>{() => <HelloMessage name="Bianca" />}</Wrap>
      <Wrap>
        {() => (
          <FixtureCapture>
            <HelloMessage name="B" />
          </FixtureCapture>
        )}
      </Wrap>
    </>
  )
};

tests(mockPostMessage);
tests(mockWebSockets);

function tests(mockConnect) {
  it('captures props from render callback', async () => {
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
                  props: createFxValues({ name: 'B' })
                })
              ]
            }
          }
        });
      });
    });
  });
}
