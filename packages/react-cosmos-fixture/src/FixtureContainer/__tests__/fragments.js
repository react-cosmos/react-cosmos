// @flow

import React from 'react';
import { create } from 'react-test-renderer';
import { FixtureContainer } from '../../FixtureContainer';

it('renders fragment with multiple children', () => {
  expect(
    create(
      <FixtureContainer>
        <>
          <Hello />
          <Hello />
        </>
      </FixtureContainer>
    ).toJSON()
  ).toEqual(['Hello!', 'Hello!']);
});

it('renders fragment with single child', () => {
  expect(
    create(
      <FixtureContainer>
        <>
          <Hello />
        </>
      </FixtureContainer>
    ).toJSON()
  ).toBe('Hello!');
});

// End of tests

function Hello() {
  return 'Hello!';
}
