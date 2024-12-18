import { act, waitFor } from '@testing-library/react';
import until from 'async-until';
import { setTimeout } from 'node:timers/promises';
import React from 'react';
import { FixtureStatePrimitiveValue, uuid } from 'react-cosmos-core';
import { ClassStateMock } from '../fixture/ClassStateMock.js';
import { Counter } from '../testHelpers/components.js';
import { getClassState } from '../testHelpers/fixtureState.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

let counterRef: null | Counter = null;
beforeEach(() => {
  counterRef = null;
});

const rendererId = uuid();
const getFixtures = () =>
  wrapDefaultExport({
    first: (
      <ClassStateMock state={{ count: 5 }}>
        <Counter
          ref={elRef => {
            if (elRef) {
              counterRef = elRef;
            }
          }}
        />
      </ClassStateMock>
    ),
  });
const fixtureId = { path: 'first' };

testRenderer(
  'captures component state changes',
  { rendererId, fixtures: getFixtures() },
  async ({ selectFixture, getLastFixtureState }) => {
    selectFixture({
      rendererId,
      fixtureId,
      fixtureState: {},
    });
    await until(() => counterRef, { timeout: 1000 });
    await act(async () => counterRef!.setState({ count: 7 }));
    await waitFor(async () => expect(await getCount()).toBe(7));

    // Simulate a small pause between updates
    await setTimeout(500);

    await act(async () => counterRef!.setState({ count: 13 }));
    await waitFor(async () => expect(await getCount()).toBe(13));

    async function getCount(): Promise<null | number> {
      const fixtureState = await getLastFixtureState();
      const [{ values }] = getClassState(fixtureState);
      if (!values) return null;
      const countValue = values.count as FixtureStatePrimitiveValue;
      return countValue.data as number;
    }
  }
);
