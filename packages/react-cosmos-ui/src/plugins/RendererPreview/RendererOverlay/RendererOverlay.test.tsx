import { render } from '@testing-library/react';
import React from 'react';
import { RendererOverlay } from './RendererOverlay.js';

it('does not immediately render anything when status runtime status is "pending"', () => {
  const { container } = render(<RendererOverlay runtimeStatus="pending" />);
  expect(container).toMatchInlineSnapshot(`<div />`);
});

it('renders "waiting for renderer" state after waiting for some time', async () => {
  const { findByText } = render(<RendererOverlay runtimeStatus="pending" />);
  await findByText(/waiting for renderer/i);
});

it('does not render anything when runtime status is "error"', () => {
  const { container } = render(<RendererOverlay runtimeStatus="error" />);
  expect(container).toMatchInlineSnapshot(`<div />`);
});

it('does not render anything when runtime status is "connected"', () => {
  const { container } = render(<RendererOverlay runtimeStatus="connected" />);
  expect(container).toMatchInlineSnapshot(`<div />`);
});
