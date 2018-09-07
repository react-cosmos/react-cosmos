// @flow

import React from 'react';
import { create } from 'react-test-renderer';
import { FixtureContainer } from '../../FixtureContainer';

it('renders string node', () => {
  expect(
    create(<FixtureContainer>Hello world!</FixtureContainer>).toJSON()
  ).toBe('Hello world!');
});
