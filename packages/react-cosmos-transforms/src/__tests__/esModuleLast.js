// @flow

import { addComponentToFixture } from '../addComponentToFixture';

const fixtureBefore = `import 'polyfill';
import configureStore from '/path/to/configureStore';

export default {
  props: {}
};`;

const fixtureAfter = `import 'polyfill';
import configureStore from '/path/to/configureStore';
import Button from '/path/to/component';

export default {
  component: Button,
  props: {}
};`;

it('adds component as last import', async () => {
  const newFixture = await addComponentToFixture({
    fixtureCode: fixtureBefore,
    componentPath: '/path/to/component.js',
    componentName: 'Button'
  });

  expect(newFixture).toBe(fixtureAfter);
});
