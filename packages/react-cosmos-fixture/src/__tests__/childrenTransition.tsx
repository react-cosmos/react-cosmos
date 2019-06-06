import React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { createValues, createValue } from 'react-cosmos-shared2/fixtureState';
import { anyProps } from '../testHelpers/fixtureState';
import { Wrapper } from '../testHelpers/components';
import { runFixtureLoaderTests } from '../testHelpers';

const rendererId = uuid();
const fixtures = {
  first: <Wrapper>yo</Wrapper>
};
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureLoaderTests(mount => {
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
                values: {
                  children: {
                    type: 'unserializable',
                    stringifiedValue: `<Wrapper>\n  brah\n</Wrapper>`
                  }
                }
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

  it('transitions string children into an element with multiple children', async () => {
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
                values: {
                  children: {
                    type: 'array',
                    values: [
                      createValue(<Wrapper>brah</Wrapper>),
                      createValue(<Wrapper>brah</Wrapper>)
                    ]
                  }
                }
              }),
              anyProps({
                values: createValues({ children: 'brah' })
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
