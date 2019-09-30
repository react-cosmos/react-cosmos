export function mockWindowOpen() {
  const windowOpen = window.open;
  const mock = jest.fn();
  window.open = mock;
  return {
    value: mock,
    unmock: () => {
      window.open = windowOpen;
    }
  };
}
