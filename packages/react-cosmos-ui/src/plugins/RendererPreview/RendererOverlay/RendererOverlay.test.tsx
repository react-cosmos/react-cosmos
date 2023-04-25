import retry from '@skidding/async-retry';
import { render } from '@testing-library/react';
import React from 'react';
import { wrapActSetTimeout } from '../../../testHelpers/wrapActSetTimeout.js';
import { RendererOverlay } from './RendererOverlay.js';

it('does not render anything before URL status is known', () => {
  const { container } = render(
    <RendererOverlay
      rendererPreviewUrlStatus="unknown"
      rendererPreviewRuntimeStatus="pending"
    />
  );
  expect(container).toMatchInlineSnapshot(`<div />`);
});

it('does not render anything when status runtime status is "pending" (initially)', () => {
  const { container } = render(
    <RendererOverlay
      rendererPreviewUrlStatus="ok"
      rendererPreviewRuntimeStatus="pending"
    />
  );
  expect(container).toMatchInlineSnapshot(`<div />`);
});

it('renders "waiting for renderer" state after a bit', async () => {
  wrapActSetTimeout();
  const { getByText } = render(
    <RendererOverlay
      rendererPreviewUrlStatus="ok"
      rendererPreviewRuntimeStatus="pending"
    />
  );
  await retry(() => getByText(/waiting for renderer/i));
});

it('renders error state when URL status is "error"', () => {
  const { getByText } = render(
    <RendererOverlay
      rendererPreviewUrlStatus="error"
      rendererPreviewRuntimeStatus="pending"
    />
  );

  getByText(/renderer/i);
  getByText(/not responding/i);

  const helpLink = getByText(/ask for help/i) as HTMLAnchorElement;
  expect(helpLink.href).toMatch('https://discord.gg/3X95VgfnW5');
});

it('does not render anything when runtime status is "error"', () => {
  const { container } = render(
    <RendererOverlay
      rendererPreviewUrlStatus="ok"
      rendererPreviewRuntimeStatus="error"
    />
  );
  expect(container).toMatchInlineSnapshot(`<div />`);
});
