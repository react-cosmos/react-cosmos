// @flow

import { mount as mountEnzyme } from 'enzyme';
import { createContext as createLoaderContext } from 'react-cosmos-loader';
import { createContext } from '../enzyme';

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: jest.fn(() => ({
    proxiesPath: require.resolve('./__fsmocks__/cosmos.proxies')
  }))
}));

const mockInnerChildWrapper = {};
const mockInnerWrapper = {
  find: jest.fn(() => mockInnerChildWrapper)
};
const mockWrapper = {
  update: jest.fn(),
  setProps: jest.fn(),
  find: jest.fn(() => mockInnerWrapper)
};
const mockContext = {
  mount: jest.fn(),
  getWrapper: jest.fn(() => mockWrapper)
};

jest.mock('react-cosmos-loader', () => ({
  createContext: jest.fn(() => mockContext)
}));

const fixture = { component: () => {} };

function getLastContextArgs() {
  return createLoaderContext.mock.calls[0][0];
}

beforeEach(() => {
  jest.clearAllMocks();
});

it('sends Enzyme renderer to generic createContext', () => {
  createContext({ fixture });

  expect(getLastContextArgs().renderer).toEqual(mountEnzyme);
});

it('returns original wrapper via getRootWrapper', async () => {
  const { mount, getRootWrapper } = createContext({ fixture });
  await mount();

  expect(getRootWrapper()).toBe(mockWrapper);
});

it('calls wrapper.update on every getRootWrapper', async () => {
  const { mount, getRootWrapper } = createContext({ fixture });
  await mount();

  getRootWrapper();
  expect(mockWrapper.update).toHaveBeenCalled();
});

it('finds inner wrapper via getWrapper', async () => {
  const { mount, getWrapper } = createContext({ fixture });
  await mount();

  const w = getWrapper();
  expect(mockWrapper.find).toHaveBeenCalledWith(fixture.component);
  expect(w).toBe(mockInnerWrapper);
});

it('finds child inner wrapper via getWrapper with selector', async () => {
  const { mount, getWrapper } = createContext({ fixture });
  await mount();

  const w = getWrapper('.class');
  expect(mockWrapper.find).toHaveBeenCalledWith(fixture.component);
  expect(mockInnerWrapper.find).toHaveBeenCalledWith('.class');
  expect(w).toBe(mockInnerChildWrapper);
});

it('calls setProps on rootWrapper when setProps is called', async () => {
  const { mount, setProps } = createContext({ fixture });
  await mount();
  const propsToSet = { propName: 'propValue' };
  setProps(propsToSet);
  expect(mockWrapper.setProps).toHaveBeenCalled();
});

it('calls setProps on rootWrapper with updated fixture that sets props', async () => {
  const { mount, setProps } = createContext({ fixture });
  await mount();
  const propsToSet = { propName: 'propValue' };
  setProps(propsToSet);
  const mockCall = mockWrapper.setProps.mock.calls[0][0];
  expect(mockCall.fixture.props).toEqual(propsToSet);
});

it('calls setProps on rootWrapper with updated fixture that merges props', async () => {
  const fixtureWithExistingProps = {
    ...fixture,
    props: { existingKey: 'existingProp' }
  };
  const { mount, setProps } = createContext({
    fixture: fixtureWithExistingProps
  });
  await mount();
  const propsToSet = { propName: 'propValue' };
  setProps(propsToSet);
  const mockCall = mockWrapper.setProps.mock.calls[0][0];
  expect(mockCall.fixture.props).toEqual({
    existingKey: 'existingProp',
    propName: 'propValue'
  });
});

it('overwrites part of fixture via set', async () => {
  const { mount, set } = createContext({ fixture });
  await mount();
  const propsToSet = { propName: 'propValue' };
  set('props', propsToSet);
  const mockCall = mockWrapper.setProps.mock.calls[0][0];
  expect(mockCall.fixture.props).toEqual(propsToSet);
});

it('can overwrite any part of the fixture via set', async () => {
  const updatedFixture = { ...fixture, reduxStore: { foo: 'bar' } };
  const { mount, set } = createContext({ fixture: updatedFixture });
  await mount();
  const newStore = { baz: 'buzz' };
  set('reduxStore', newStore);
  const mockCall = mockWrapper.setProps.mock.calls[0][0];
  expect(mockCall.fixture.reduxStore).toEqual(newStore);
});
