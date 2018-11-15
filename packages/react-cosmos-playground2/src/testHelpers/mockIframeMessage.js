// @flow

export async function mockIframeMessage(
  iframe: HTMLIFrameElement,
  children: ({ onMessage: Function }) => Promise<mixed>
) {
  const { contentWindow } = iframe;
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
