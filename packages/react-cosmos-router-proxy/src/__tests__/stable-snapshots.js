import createTestContext from 'react-cosmos-test/enzyme';
import fixture from '../__fixtures__/stableKeys';
import { createRouterProxy } from '..';
import toJson from 'enzyme-to-json';

const proxies = [createRouterProxy()];

const { mount, getWrapper } = createTestContext({ fixture, proxies });

test('props are stable', () => {
  mount();
  const componentOneLocationPropKey = getWrapper()
    .find('MyComponent')
    .props().location.key;

  mount();
  const componentTwoLocationPropKey = getWrapper()
    .find('MyComponent')
    .props().location.key;

  expect(componentOneLocationPropKey).toEqual(componentTwoLocationPropKey);
});

test('snapshot is stable', () => {
  mount();
  expect(toJson(getWrapper())).toMatchSnapshot();
});
