import { renderHook } from '@testing-library/react';
import { isInsideWindowIframe } from 'react-cosmos-core';
import { createWebSocketsConnect } from 'react-cosmos-renderer';
import { useDomRendererConnect } from './useDomRendererConnect.js';

jest.mock('react-cosmos-core');
jest.mock('react-cosmos-renderer');

const mockIsInsideWindowIframe = jest.mocked(isInsideWindowIframe);

afterEach(() => {
  jest.clearAllMocks();
});

it('uses "ws" websocket protocol when not on HTTPS', () => {
  mockIsInsideWindowIframe.mockReturnValue(false);
  renderHook(() => useDomRendererConnect('http://example.com/playground'));
  expect(createWebSocketsConnect).toHaveBeenCalledWith(
    'ws://example.com/playground'
  );
});

it('uses "wss" websocket protocol when on HTTPS', () => {
  mockIsInsideWindowIframe.mockReturnValue(false);
  renderHook(() => useDomRendererConnect('https://example.com/playground'));
  expect(createWebSocketsConnect).toHaveBeenCalledWith(
    'wss://example.com/playground'
  );
});
