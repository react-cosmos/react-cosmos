// @flow

import React from 'react';
import { create } from 'react-test-renderer';
import { FixtureProvider } from '../../FixtureProvider';

it('renders string element type', () => {
  expect(
    create(
      <FixtureProvider fixtureState={null} setFixtureState={() => {}}>
        <div>Hello world!</div>
      </FixtureProvider>
    ).toJSON()
  ).toEqual({ type: 'div', props: {}, children: ['Hello world!'] });
});
