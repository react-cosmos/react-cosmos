import React from 'react';
import {
  createValue,
  createValues,
} from '../../../fixtureState/createValues.js';
import { uuid } from '../../../utils/uuid.js';
import { Wrapper } from '../testHelpers/components.js';
import { anyProps } from '../testHelpers/fixtureState.js';
import { testFixtureLoader } from '../testHelpers/index.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

const rendererId = uuid();
const fixtures = wrapFixtures({
  first: <Wrapper>yo</Wrapper>,
});
const fixtureId = { path: 'first' };

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
            values: createValues({ children: 'yo' }),
          }),
        ],
      },
    });
    update({
      rendererId,
      fixtures: wrapFixtures({
        first: (
          <Wrapper>
            <Wrapper>brah</Wrapper>
          </Wrapper>
        ),
      }),
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
                stringifiedData: `<Wrapper>\n  brah\n</Wrapper>`,
              },
            },
          }),
          anyProps({
            values: createValues({ children: 'brah' }),
          }),
        ],
      },
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
            values: createValues({ children: 'yo' }),
          }),
        ],
      },
    });
    update({
      rendererId,
      fixtures: wrapFixtures({
        first: (
          <Wrapper>
            <Wrapper>brah</Wrapper>
          </Wrapper>
        ),
      }),
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
                stringifiedData: `<Wrapper>\n  brah\n</Wrapper>`,
              },
            },
          }),
          anyProps({
            values: createValues({ children: 'brah' }),
          }),
        ],
      },
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
      fixtureState: {},
    });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [
          anyProps({
            values: createValues({ children: 'yo' }),
          }),
        ],
      },
    });
    update({
      rendererId,
      fixtures: wrapFixtures({
        first: (
          <Wrapper>
            <Wrapper>brah</Wrapper>
            <Wrapper>brah</Wrapper>
          </Wrapper>
        ),
      }),
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
                  createValue(<Wrapper>brah</Wrapper>),
                ],
              },
            },
          }),
          anyProps({
            values: createValues({ children: 'brah' }),
          }),
          anyProps({
            values: createValues({ children: 'brah' }),
          }),
        ],
      },
    });
  }
);
