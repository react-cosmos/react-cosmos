// @flow
/* eslint-env browser */

import React from 'react';
import {
  render,
  cleanup,
  waitForElement,
  fireEvent
} from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../PlaygroundProvider';
import { ReceiveRendererResponse } from '../../jestHelpers/ReceiveRendererResponse';
import { getUrlParams, pushUrlParams } from '../../jestHelpers/url';

// Plugins have side-effects: they register themselves
import '.';

afterEach(cleanup);

it('renders content from "root" slot', async () => {
  const { getByText } = renderPlayground();

  await waitForElement(() =>
    getByText(/content that will be shown alongside navigation/i)
  );
});

const fixtureListMsg = {
  type: 'fixtureList',
  payload: {
    rendererId: 'foo-renderer',
    fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
  }
};

it('renders fixture list received from renderer', async () => {
  const { getByText } = renderPlayground();

  await waitForElement(() => getByText(/ein/i));
  await waitForElement(() => getByText(/zwei/i));
  await waitForElement(() => getByText(/drei/i));
});

it('pushes fixture path to URL on fixture click', async () => {
  const { getByText } = renderPlayground();

  // waitForElement is needed because the fixture list isn't shown immediately
  fireEvent.click(await waitForElement(() => getByText(/zwei/i)));

  expect(getUrlParams().fixture).toEqual('fixtures/zwei.js');
});

it('removes fixture path from URL on home button click', async () => {
  pushUrlParams({ fixture: 'fixtures/zwei.js' });

  const { getByText } = renderPlayground();

  fireEvent.click(getByText(/home/i));

  expect(getUrlParams().fixture).toEqual(undefined);
});

it('only renders content in full screen mode', async () => {
  pushUrlParams({ fixture: 'fixtures/zwei.js' });

  const { getByText, getByTestId, queryByTestId } = renderPlayground();

  fireEvent.click(getByText(/fullscreen/i));

  await waitForElement(() => getByTestId('content'));
  expect(queryByTestId('nav')).toBeNull();
});

function renderPlayground() {
  return render(
    <PlaygroundProvider
      options={{
        rendererUrl: 'foo-renderer'
      }}
    >
      <Slot name="root">Content that will be shown alongside navigation</Slot>
      {/* Fake a plugin that receives renderer responses */}
      <ReceiveRendererResponse msg={fixtureListMsg} />
    </PlaygroundProvider>
  );
}
