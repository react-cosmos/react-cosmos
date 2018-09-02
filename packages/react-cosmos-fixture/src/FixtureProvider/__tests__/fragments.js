// @flow

import React from 'react';
import { create } from 'react-test-renderer';
import { FixtureProvider } from '../../FixtureProvider';

it('renders fragment with multiple children', () => {
  expect(
    create(
      <FixtureProvider fixtureState={null} setFixtureState={() => {}}>
        <>
          <Hello />
          <Hello />
        </>
      </FixtureProvider>
    ).toJSON()
  ).toEqual(['Hello!', 'Hello!']);
});

it('renders fragment with single child', () => {
  expect(
    create(
      <FixtureProvider fixtureState={null} setFixtureState={() => {}}>
        <>
          <Hello />
        </>
      </FixtureProvider>
    ).toJSON()
  ).toBe('Hello!');
});

// End of tests

function Hello() {
  return 'Hello!';
}
