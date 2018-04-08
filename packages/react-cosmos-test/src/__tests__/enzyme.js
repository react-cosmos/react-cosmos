// @flow

import { mount as mountEnzyme } from 'enzyme';
import { createContext as createLoaderContext } from 'react-cosmos-loader';
import { getMock } from 'react-cosmos-flow/jest';
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
  return getMock(createLoaderContext).calls[0][0];
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

  const newProps = { propName: 'propValue' };
  setProps(newProps);

  expect(mockWrapper.setProps).toHaveBeenCalled();
});

it('calls setProps on rootWrapper with fixture props', async () => {
  const { mount, setProps } = createContext({ fixture });
  await mount();

  const props = { propName: 'propValue' };
  setProps(props);

  const mockCall = mockWrapper.setProps.mock.calls[0][0];
  expect(mockCall.fixture.props).toEqual(props);
});

it('calls setProps on rootWrapper with merged fixture props', async () => {
  const fixtureWithExistingProps = {
    ...fixture,
    props: { existingKey: 'existingProp' }
  };
  const { mount, setProps } = createContext({
    fixture: fixtureWithExistingProps
  });
  await mount();

  const newProps = { propName: 'propValue' };
  setProps(newProps);

  const mockCall = mockWrapper.setProps.mock.calls[0][0];
  expect(mockCall.fixture.props).toEqual({
    existingKey: 'existingProp',
    propName: 'propValue'
  });
});

it('overwrites props via set', async () => {
  const { mount, set } = createContext({ fixture });
  await mount();

  const newProps = { propName: 'propValue' };
  set('props', newProps);

  const mockCall = mockWrapper.setProps.mock.calls[0][0];
  expect(mockCall.fixture.props).toEqual(newProps);
});

it('overwrites any fixture part via set', async () => {
  const updatedFixture = { ...fixture, reduxState: { foo: 'bar' } };
  const { mount, set } = createContext({ fixture: updatedFixture });
  await mount();

  const newState = { baz: 'buzz' };
  set('reduxState', newState);

  const mockCall = mockWrapper.setProps.mock.calls[0][0];
  expect(mockCall.fixture.reduxState).toEqual(newState);
});
