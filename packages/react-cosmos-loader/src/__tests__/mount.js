import { createElement } from 'react';
import { render } from 'react-dom';
import createStateProxy from 'react-cosmos-state-proxy';
import RemoteLoader from '../components/RemoteLoader';
import mountLoader from '../mount';

jest.mock('react', () => ({
  Component: jest.fn(),
  createElement: jest.fn(() => '__mock_element__'),
}));
jest.mock('react-dom', () => ({
  render: jest.fn(),
}));
jest.mock('react-cosmos-state-proxy', () => jest.fn());

const mockComponent = () => {};
const mockFixture = {};
const mockProxy = () => {};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('without container query selector', () => {
  beforeEach(() => {
    mountLoader({
      proxies: [mockProxy],
      components: {
        foo: mockComponent,
      },
      fixtures: {
        foo: {
          bar: mockFixture,
        },
      },
    });
  });

  it('creates RemoteLoader element', () => {
    const args = createElement.mock.calls[0];
    expect(args[0]).toBe(RemoteLoader);
  });

  it('passes proxies to loader element', () => {
    const { proxies } = createElement.mock.calls[0][1];
    expect(proxies).toContain(mockProxy);
  });

  it('appends state proxy', () => {
    const { proxies } = createElement.mock.calls[0][1];
    expect(proxies).toContain(createStateProxy);
  });

  it('passes components to loader element', () => {
    const { components } = createElement.mock.calls[0][1];
    expect(components.foo).toBe(mockComponent);
  });

  it('passes fixtures to loader element', () => {
    const { fixtures } = createElement.mock.calls[0][1];
    expect(fixtures.foo.bar).toBe(mockFixture);
  });

  it('renders React element', () => {
    const renderArgs = render.mock.calls[0];
    expect(renderArgs[0]).toBe('__mock_element__');
  });

  it('uses element inside document body for render container', () => {
    const container = render.mock.calls[0][1];
    expect(container.parentNode).toBe(document.body);
  });
});

describe('with container query selector and class name', () => {
  let rootEl;

  beforeEach(() => {
    rootEl = window.document.createElement('div', { id: 'root' });
    rootEl.id = 'app123';
    document.body.appendChild(rootEl);

    mountLoader({
      proxies: [mockProxy],
      components: {
        foo: mockComponent,
      },
      fixtures: {
        foo: {
          bar: mockFixture,
        },
      },
      containerQuerySelector: '#app123',
    });
  });

  afterAll(() => {
    document.body.removeChild(rootEl);
  });

  it('creates RemoteLoader element', () => {
    const args = createElement.mock.calls[0];
    expect(args[0]).toBe(RemoteLoader);
  });

  it('passes proxies to loader element', () => {
    const { proxies } = createElement.mock.calls[0][1];
    expect(proxies).toContain(mockProxy);
  });

  it('appends state proxy', () => {
    const { proxies } = createElement.mock.calls[0][1];
    expect(proxies).toContain(createStateProxy);
  });

  it('passes components to loader element', () => {
    const { components } = createElement.mock.calls[0][1];
    expect(components.foo).toBe(mockComponent);
  });

  it('passes fixtures to loader element', () => {
    const { fixtures } = createElement.mock.calls[0][1];
    expect(fixtures.foo.bar).toBe(mockFixture);
  });

  it('renders React element', () => {
    const renderArgs = render.mock.calls[0];
    expect(renderArgs[0]).toBe('__mock_element__');
  });

  it('uses queried element for render container', () => {
    const container = render.mock.calls[0][1];
    expect(container.id).toBe('app123');
  });
});
