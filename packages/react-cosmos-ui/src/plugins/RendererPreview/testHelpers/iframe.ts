import type { RenderResult } from '@testing-library/react';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

export async function mockIframeMessage(
  iframe: HTMLIFrameElement,
  children: (args: { onMessage: Mock }) => Promise<unknown>
) {
  const { contentWindow } = iframe;
  if (!contentWindow) {
    throw new Error('iframe contentWindow missing');
  }

  const onMessage = vi.fn();
  try {
    contentWindow.addEventListener('message', onMessage, false);
    await children({ onMessage });
  } finally {
    contentWindow.removeEventListener('message', onMessage);
  }
}

export function getIframe({ getByTestId }: RenderResult) {
  return getByTestId('previewIframe') as HTMLIFrameElement;
}
