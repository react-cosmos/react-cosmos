import { act, render } from '@testing-library/react';

export async function renderAsync(element: React.ReactElement) {
  const renderer = render(element);
  // Wait for async updates caused by plugin load handlers
  await act(async () => {});
  return renderer;
}
