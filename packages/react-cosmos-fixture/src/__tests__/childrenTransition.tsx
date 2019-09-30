import React from 'react';
import { createValue, createValues } from 'react-cosmos-shared2/fixtureState';
import { uuid } from 'react-cosmos-shared2/util';
import { testFixtureLoader } from '../testHelpers';
import { Wrapper } from '../testHelpers/components';
import { anyProps } from '../testHelpers/fixtureState';

const rendererId = uuid();
const fixtures = {
  first: <Wrapper>yo</Wrapper>
};
const fixtureId = { path: 'first', name: null };

testFixtureLoader(
  'transitions string children into an element with children',
  { rendererId, fixtures },
  async ({ update, selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
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
      }
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

testFixtureLoader(
  'transitions string children into an element with children',
  { rendererId, fixtures },
  async ({ update, selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
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
      }
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

testFixtureLoader(
  'transitions string children into an element with multiple children',
  { rendererId, fixtures },
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
      }
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
