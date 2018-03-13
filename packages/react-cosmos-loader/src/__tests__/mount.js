// @flow

import { getMock } from 'react-cosmos-shared/src/jest';
import { connectLoader } from '../connect-loader';
import { createDomRenderer } from '../dom-renderer';
import { mount } from '../mount';

const mockFixture = { component: () => {} };
const mockProxy = () => {};
const mockLoaderOpts = { containerQuerySelector: '#app123' };

const mockRenderer = {};
const mockStateProxy = {};
const mockErrorCatchProxy = {};
const mockDismissRuntimeErrors = () => {};

jest.mock('../components/ErrorCatchProxy', () =>
  jest.fn(() => mockErrorCatchProxy)
);
jest.mock('../dom-renderer', () => ({
  createDomRenderer: jest.fn(() => mockRenderer)
}));
jest.mock('../connect-loader', () => ({
  connectLoader: jest.fn()
}));

function getArgsFromLastCall() {
  const { calls } = getMock(connectLoader);
  return calls[calls.length - 1][0];
}

function getProxiesFromLastCall() {
  return getArgsFromLastCall().proxies;
}

beforeEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  mount({
    proxies: [mockProxy],
    fixtures: {
      Foo: {
        bar: mockFixture
      }
    },
    loaderOpts: mockLoaderOpts,
    dismissRuntimeErrors: mockDismissRuntimeErrors
  });
});

it('passes user proxies to loaderConnect', () => {
  expect(getProxiesFromLastCall()).toContain(mockProxy);
});

it('includes ErrorCatchProxy', () => {
  expect(getProxiesFromLastCall()).toContain(mockErrorCatchProxy);
});

it('passes fixtures to loaderConnect', () => {
  expect(getArgsFromLastCall().fixtures.Foo.bar).toBe(mockFixture);
});

it('passes renderer to loaderConnect', () => {
  expect(getArgsFromLastCall().renderer).toBe(mockRenderer);
});

it('calls renderer creator with loader options', () => {
  expect(createDomRenderer).toHaveBeenCalledWith(mockLoaderOpts);
});

it('passes dismissRuntimeErrors to loaderConnect', () => {
  expect(getArgsFromLastCall().dismissRuntimeErrors).toBe(
    mockDismissRuntimeErrors
  );
});
