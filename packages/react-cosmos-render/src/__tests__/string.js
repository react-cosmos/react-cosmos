// @flow

import React from 'react';
import { create as render } from 'react-test-renderer';
import { Fixture } from '../Fixture';

it('renders string node', () => {
  expect(render(<Fixture>Hello world!</Fixture>).toJSON()).toBe('Hello world!');
});
