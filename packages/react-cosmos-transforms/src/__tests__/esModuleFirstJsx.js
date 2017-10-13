// @flow

import { addComponentToFixture } from '../addComponentToFixture';

const fixtureBefore = `export default {
  props: {}
};`;

const fixtureAfter = `import Button from '/path/to/component.jsx';

export default {
  component: Button,
  props: {}
};`;

it('adds JSX component as first import', async () => {
  const newFixture = await addComponentToFixture({
    fixtureCode: fixtureBefore,
    componentPath: '/path/to/component.jsx',
    componentName: 'Button'
  });

  expect(newFixture).toBe(fixtureAfter);
});
