// @flow

import { addComponentToFixture } from '../addComponentToFixture';

const fixtureBefore = `import 'polyfill';
import configureStore from '/path/to/configureStore';
import Button from '../component';

export default {
  props: {}
};`;

const fixtureAfter = `import 'polyfill';
import configureStore from '/path/to/configureStore';
import Button from '../component';

export default {
  component: Button,
  props: {}
};`;

it('only adds fixture prop when component import exists', async () => {
  const newFixture = await addComponentToFixture({
    fixtureCode: fixtureBefore,
    componentPath: '/path/to/component.js',
    componentName: 'Button'
  });

  expect(newFixture).toBe(fixtureAfter);
});
