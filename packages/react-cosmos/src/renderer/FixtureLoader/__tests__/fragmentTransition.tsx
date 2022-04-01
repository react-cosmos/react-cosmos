import { StateMock } from '@react-mock/state';
import React from 'react';
import { createValues } from '../../../core/fixtureState/createValues.js';
import { uuid } from '../../../utils/uuid.js';
import { Counter } from '../testHelpers/components.js';
import { anyClassState, anyProps } from '../testHelpers/fixtureState.js';
import { testFixtureLoader } from '../testHelpers/index.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

const rendererId = uuid();
const fixtures = wrapFixtures({
  first: (
    <>
      <StateMock state={{ count: 5 }}>
        <Counter />
      </StateMock>
    </>
  ),
});
const fixtureId = { path: 'first' };

testFixtureLoader(
  'transitions Fragment from single to multi children',
  { rendererId, fixtures },
  async ({ update, selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    update({
      rendererId,
      fixtures: wrapFixtures({
        // This is a very tricky case. When fragments have one child,
        // props.children will be that child. But when fragments have
        // two or more children, props.children will be an array. When
        // transitioning from one Fragment child to more (or viceversa)
        // the first child's path changes
        //   - from: props.children
        //   - to: props.children[0]
        // This leads to a messy situation if we don't do proper cleanup.
        first: (
          <>
            <StateMock state={{ count: 5 }}>
              <Counter />
            </StateMock>
            <StateMock state={{ count: 10 }}>
              <Counter />
            </StateMock>
          </>
        ),
      }),
    });
    // Do not remove this line: It captures a regression regarding an error
    // that occurred when component state was read asynchronously
    await new Promise(res => setTimeout(res, 500));
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [
          anyProps({ values: createValues({}) }),
          anyProps({ values: createValues({}) }),
        ],
        classState: [
          anyClassState({
            values: createValues({ count: 5 }),
          }),
          anyClassState({
            values: createValues({ count: 10 }),
          }),
        ],
      },
    });
  }
);
