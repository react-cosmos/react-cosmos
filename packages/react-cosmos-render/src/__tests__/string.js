// @flow

import React from 'react';
import { create as render } from 'react-test-renderer';
import { FixtureProvider } from '../FixtureProvider';

it('renders string node', () => {
  expect(render(<FixtureProvider>Hello world!</FixtureProvider>).toJSON()).toBe(
    'Hello world!'
  );
});
