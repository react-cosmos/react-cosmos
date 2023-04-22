import retry from '@skidding/async-retry';
import { render } from '@testing-library/react';
import React from 'react';
import { wrapActSetTimeout } from '../../../testHelpers/wrapActSetTimeout.js';
import { RendererOverlay } from './RendererOverlay.js';

it('does not render anything when status is "unknown"', () => {
  const { container } = render(
    <RendererOverlay
      rendererPreviewUrlStatus="unknown"
      rendererConnected={false}
    />
  );
  expect(container).toMatchInlineSnapshot(`<div />`);
});

it('does not render anything when status is "ok"', () => {
  const { container } = render(
    <RendererOverlay rendererPreviewUrlStatus="ok" rendererConnected={true} />
  );
  expect(container).toMatchInlineSnapshot(`<div />`);
});

it('renders "waiting" message', async () => {
  wrapActSetTimeout();
  const { getByText } = render(
    <RendererOverlay rendererPreviewUrlStatus="ok" rendererConnected={false} />
  );
  await retry(() => getByText(/waiting for renderer/i));
});

it('renders "error" message', () => {
  const { getByText } = render(
    <RendererOverlay
      rendererPreviewUrlStatus="error"
      rendererConnected={false}
    />
  );
  getByText(/renderer/i);
  getByText(/not responding/i);
});

it('renders "error" message', () => {
  const { getByText } = render(
    <RendererOverlay
      rendererPreviewUrlStatus="error"
      rendererConnected={false}
    />
  );
  const helpLink = getByText(/ask for help/i) as HTMLAnchorElement;
  expect(helpLink.href).toMatch('https://discord.gg/3X95VgfnW5');
});
