/* eslint-disable import/extensions */
import { MessageHandlerContext } from './shared.js';
import { initSocket } from './socket'

jest.mock('react-cosmos-core')
jest.mock('react-cosmos-renderer')
jest.mock('./shared.js')

const createMockContext = () => ({
  getMethodsOf: () => {
    return {
      isDevServerOn: () => true,
    }
  },
  messageHandler: () => {},
  pluginName: () => {}
})

const createMockWebSocket = () => (() => ({
    addEventListener: jest.fn(),
    close: jest.fn(),
    removeEventListener: jest.fn()
  }) as unknown as WebSocket)

const originalWindowLocation = window.location

beforeEach(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    enumerable: true,
    value: {
      origin: 'http://example.com'
    },
  })
})

afterEach(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    enumerable: true,
    value: originalWindowLocation,
  })

  jest.clearAllMocks()
})

it('initializes a websocket using "ws" protocol when not on HTTPS', () => {
  Object.defineProperty(window.location, 'origin', {
    value: 'http://example.com'
  })

  const websocketMock = jest.spyOn(global, 'WebSocket')
    .mockImplementation(createMockWebSocket())
  const context = createMockContext() as unknown as MessageHandlerContext
  initSocket(context)
  expect(websocketMock).toHaveBeenCalledWith('ws://example.com')
})

it('initializes a websocket using "wss" protocol when on HTTPS', () => {
  Object.defineProperty(window.location, 'origin', {
    value: 'https://example.com'
  })
  const websocketMock = jest.spyOn(global, 'WebSocket')
    .mockImplementation(createMockWebSocket())
  const context = createMockContext() as unknown as MessageHandlerContext
  initSocket(context)
  expect(websocketMock).toHaveBeenCalledWith('wss://example.com')
})
