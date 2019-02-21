// @flow

import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { HelloMessage } from '../testHelpers/components';
import { createCompFxState, createFxValues } from '../testHelpers/fixtureState';
import { runTests, mount } from '../testHelpers';
import { FixtureCapture } from '..';

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
          <FixtureCapture decoratorId="mockDecoratorId">
            <HelloMessage name="B" />
          </FixtureCapture>
        )}
      </Wrap>
    </>
  )
};
const decorators = {};

runTests(mockConnect => {
  it('captures props from render callback', async () => {
    await mockConnect(async ({ getElement, selectFixture, untilMessage }) => {
      await mount(
        getElement({ rendererId, fixtures, decorators }),
        async renderer => {
          await selectFixture({
            rendererId,
            fixtureId: { path: 'first', name: null },
            fixtureState: null
          });

          expect(renderer.toJSON()).toEqual(['Hello Bianca', 'Hello B']);

          await untilMessage({
            type: 'fixtureStateChange',
            payload: {
              rendererId,
              fixtureId: { path: 'first', name: null },
              fixtureState: {
                components: [
                  createCompFxState({
                    decoratorId: 'mockDecoratorId',
                    props: createFxValues({ name: 'B' })
                  })
                ]
              }
            }
          });
        }
      );
    });
  });
});
