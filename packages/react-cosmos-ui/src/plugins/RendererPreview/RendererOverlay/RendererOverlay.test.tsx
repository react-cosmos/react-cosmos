import { render } from '@testing-library/react';
import React from 'react';
import { RendererOverlay } from './RendererOverlay.js';

it('does not render anything when status is "unknown"', () => {
  const { container } = render(
    <RendererOverlay rendererPreviewUrlStatus="unknown" />
  );
  expect(container).toMatchInlineSnapshot(`<div />`);
});

it('does not render anything when status is "ok"', () => {
  const { container } = render(
    <RendererOverlay rendererPreviewUrlStatus="ok" />
  );
  expect(container).toMatchInlineSnapshot(`<div />`);
});

it('renders "error" message', () => {
  const { getByText } = render(
    <RendererOverlay rendererPreviewUrlStatus="error" />
  );
  getByText(/renderer/i);
  getByText(/not responding/i);
});

it('renders "error" message', () => {
  const { getByText } = render(
    <RendererOverlay rendererPreviewUrlStatus="error" />
  );
  const helpLink = getByText(/ask for help/i) as HTMLAnchorElement;
  expect(helpLink.href).toMatch('https://discord.gg/3X95VgfnW5');
});
