import retry from '@skidding/async-retry';
import { render } from '@testing-library/react';
import React from 'react';
import { wrapActSetTimeout } from '../../../testHelpers/wrapActSetTimeout.js';
import { RemoteRendererOverlay } from './RemoteRendererOverlay.js';

it('does not immediately render anything before renderer is connected', () => {
  const { container } = render(
    <RemoteRendererOverlay rendererConnected={false} />
  );
  expect(container).toMatchInlineSnapshot(`<div />`);
});

it('renders "waiting for renderer" state after waiting for some time', async () => {
  wrapActSetTimeout();
  const { getByText } = render(
    <RemoteRendererOverlay rendererConnected={false} />
  );
  await retry(() => getByText(/waiting for renderer/i));
});

it('renders "remote renderer connected" after renderer is connected', () => {
  const { getByText } = render(
    <RemoteRendererOverlay rendererConnected={true} />
  );
  getByText(/remote renderer connected/i);
});
