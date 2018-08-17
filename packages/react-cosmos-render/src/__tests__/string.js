// @flow

import { render } from './_shared';

it('renders string node', () => {
  expect(render('Hello world!')).toBe('Hello world!');
});
