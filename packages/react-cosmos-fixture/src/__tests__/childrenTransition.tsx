import * as React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { createValues } from 'react-cosmos-shared2/fixtureState';
import { anyProps } from '../testHelpers/fixtureState';
import { Wrapper } from '../testHelpers/components';
import { runFixtureConnectTests } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: <Wrapper>yo</Wrapper>
};
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureConnectTests(mount => {
  it('transitions string children into an element with children', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ update, selectFixture, fixtureStateChange }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: [
              anyProps({
                values: createValues({ children: 'yo' })
              })
            ]
          }
        });
        update({
          rendererId,
          fixtures: {
            first: (
              <Wrapper>
                <Wrapper>brah</Wrapper>
              </Wrapper>
            )
          },
          decorators
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: [
              anyProps({
                values: [
                  {
                    key: 'children',
                    serializable: false,
                    stringified: `<Wrapper>\n  brah\n</Wrapper>`
                  }
                ]
              }),
              anyProps({
                values: createValues({ children: 'brah' })
              })
            ]
          }
        });
      }
    );
  });
});
