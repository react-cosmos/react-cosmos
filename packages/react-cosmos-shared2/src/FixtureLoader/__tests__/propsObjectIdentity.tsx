import retry from '@skidding/async-retry';
import React from 'react';
import { uuid } from '../../util';
import { testFixtureLoader } from '../testHelpers';

const rendererId = uuid();
const fixtureId = { path: 'first', name: null };

type Props = {
  obj: {};
  arr: [];
  cb: (obj: {}, arr: []) => unknown;
};

function TestComponent({ obj, arr, cb }: Props) {
  cb(obj, arr);
  return null;
}

testFixtureLoader(
  'preserves object reference',
  { rendererId, fixtures: {} },
  async ({ update, selectFixture }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const obj = {};
    const cb = jest.fn();
    update({
      rendererId,
      fixtures: {
        first: <TestComponent obj={obj} arr={[]} cb={cb} />
      }
    });
    await retry(() => expect(getLastMockCall(cb)[0]).toBe(obj));
  }
);

testFixtureLoader(
  'preserves array reference',
  { rendererId, fixtures: {} },
  async ({ update, selectFixture }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    const arr: [] = [];
    const cb = jest.fn();
    update({
      rendererId,
      fixtures: {
        first: <TestComponent obj={{}} arr={arr} cb={cb} />
      }
    });
    await retry(() => expect(getLastMockCall(cb)[1]).toBe(arr));
  }
);

function getLastMockCall(mockFn: jest.Mock) {
  // This helper is required mockFn.lastCalledWith check deep equality instead
  // of reference equality, which we need in this test.
  const { calls } = mockFn.mock;
  return calls[calls.length - 1];
}
