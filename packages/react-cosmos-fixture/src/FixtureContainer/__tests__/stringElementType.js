// @flow

import React from 'react';
import { create } from 'react-test-renderer';
import { FixtureContainer } from '../../FixtureContainer';

it('renders string element type', () => {
  expect(
    create(
      <FixtureContainer>
        <div>Hello world!</div>
      </FixtureContainer>
    ).toJSON()
  ).toEqual({ type: 'div', props: {}, children: ['Hello world!'] });
});
