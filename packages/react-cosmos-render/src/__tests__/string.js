// @flow

import React from 'react';
import { create } from 'react-test-renderer';
import { FixtureProvider } from '../FixtureProvider';

it('renders string node', () => {
  expect(
    create(
      <FixtureProvider fixtureState={{}} setFixtureState={() => {}}>
        Hello world!
      </FixtureProvider>
    ).toJSON()
  ).toBe('Hello world!');
});
