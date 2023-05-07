import { uuid } from 'react-cosmos-core';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtures = wrapDefaultExport({ first: null, second: null });

testRenderer(
  'renders blank state message',
  { rendererId, fixtures },
  async ({ renderer }) => {
    expect(renderer.toJSON()).toEqual('No fixture selected.');
  }
);

testRenderer(
  'posts renderer ready and fixture list on mount',
  { rendererId, fixtures },
  async ({ rendererReady, fixtureListUpdate }) => {
    await rendererReady({
      rendererId,
    });
    await fixtureListUpdate({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
      },
    });
  }
);

testRenderer(
  'posts ready response and fixture list again on ping request',
  { rendererId, fixtures },
  async ({
    rendererReady,
    fixtureListUpdate,
    pingRenderers,
    clearResponses,
  }) => {
    await rendererReady({
      rendererId,
    });
    await fixtureListUpdate({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
      },
    });
    clearResponses();
    pingRenderers();
    await rendererReady({
      rendererId,
    });
    await fixtureListUpdate({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
      },
    });
  }
);

testRenderer(
  'posts fixture list on "fixtures" prop change',
  { rendererId, fixtures },
  async ({ update, rendererReady, fixtureListUpdate }) => {
    await rendererReady({
      rendererId,
    });
    await fixtureListUpdate({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
      },
    });
    update({
      rendererId,
      fixtures: { ...fixtures, ...wrapDefaultExport({ third: null }) },
    });
    await fixtureListUpdate({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
        third: { type: 'single' },
      },
    });
  }
);
