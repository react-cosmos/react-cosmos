import retry from '@skidding/async-retry';
import { render } from '@testing-library/react';
import React from 'react';
import { wrapActSetTimeout } from '../../../testHelpers/wrapActSetTimeout.js';
import { RendererOverlay } from './RendererOverlay.js';

it('does not immediately render anything when status runtime status is "pending"', () => {
  const { container } = render(<RendererOverlay runtimeStatus="pending" />);
  expect(container).toMatchInlineSnapshot(`<div />`);
});

it('renders "waiting for renderer" state after some time', async () => {
  wrapActSetTimeout();
  const { getByText } = render(<RendererOverlay runtimeStatus="pending" />);
  await retry(() => getByText(/waiting for renderer/i));
});

it('does not render anything when runtime status is "error"', () => {
  const { container } = render(<RendererOverlay runtimeStatus="error" />);
  expect(container).toMatchInlineSnapshot(`<div />`);
});
