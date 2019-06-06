import { RenderResult } from '@testing-library/react';

export async function mockIframeMessage(
  iframe: HTMLIFrameElement,
  children: (args: { onMessage: jest.Mock }) => Promise<unknown>
) {
  const { contentWindow } = iframe;
  if (!contentWindow) {
    throw new Error('iframe contentWindow missing');
  }

  const onMessage = jest.fn();
  try {
    contentWindow.addEventListener('message', onMessage, false);
    await children({ onMessage });
  } catch (err) {
    // Make errors visible
    throw err;
  } finally {
    contentWindow.removeEventListener('message', onMessage);
  }
}

export function getIframe({ getByTestId }: RenderResult) {
  return getByTestId('previewIframe') as HTMLIFrameElement;
}
