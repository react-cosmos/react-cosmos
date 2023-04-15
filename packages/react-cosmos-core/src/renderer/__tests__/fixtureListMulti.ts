import { uuid } from '../../utils/uuid.js';
import { testRenderer } from '../testHelpers/testRenderer.js';

const rendererId = uuid();
const fixtures = {
  first: { a: null, b: null, c: null },
  second: null,
};

testRenderer(
  'posts ready response on mount',
  { rendererId, fixtures },
  async ({ rendererReady }) => {
    await rendererReady({
      rendererId,
      fixtures: {
        first: { type: 'multi', fixtureNames: ['a', 'b', 'c'] },
        second: { type: 'single' },
      },
    });
  }
);
