import React from 'react';
import { create } from 'react-test-renderer';
import Fixture from './index.fixture';

it('Cosmonaut renders correctly', () => {
  const renderer = create(<Fixture />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
