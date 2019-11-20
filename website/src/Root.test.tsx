import React from 'react';
import { create } from 'react-test-renderer';
import { Root } from './Root';

it('renders correctly', () => {
  const renderer = create(<Root />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
