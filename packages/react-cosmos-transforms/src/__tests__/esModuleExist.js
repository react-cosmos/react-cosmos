// @flow

import { addComponentToFixture } from '../addComponentToFixture';

const fixtureBefore = `import 'polyfill';
import configureStore from '/path/to/configureStore';
import Button from '/path/to/component.js';

export default {
  component: Button,
  props: {}
};`;

const fixtureAfter = `import 'polyfill';
import configureStore from '/path/to/configureStore';
import Button from '/path/to/component.js';

export default {
  component: Button,
  props: {}
};`;

it('only adds fixture prop when component import path exists', async () => {
  const newFixture = await addComponentToFixture({
    fixtureCode: fixtureBefore,
    componentPath: '/path/to/component.js',
    componentName: 'Button'
  });

  expect(newFixture).toBe(fixtureAfter);
});
