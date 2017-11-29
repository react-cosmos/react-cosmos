import React from 'react';
import { mount } from 'enzyme';
import afterOngoingPromises from 'after-ongoing-promises';
import { createLinkedList } from 'react-cosmos-shared';
import createRefCallbackProxy from '../';

jest.useFakeTimers();

// The final responsibility of proxies is to render the user's component at
// the end of the proxy chain. While it goes beyond unit testing, testing a
// complete proxy chain provides a clearer picture than solely dissecting the
// props that the tested proxy passes to the next.
// This needs to be a Class component for refs to work
class Component extends React.Component {
  render() {
    return '__COMPONENT_MOCK__';
  }
}

const NextProxy = props => {
  const { nextProxy } = props;
  return <nextProxy.value {...props} nextProxy={nextProxy.next()} />;
};

const LastProxy = ({ onComponentRef, fixture }) => (
  <fixture.component
    ref={() => onComponentRef('MOCK_REF')}
    {...fixture.props}
  />
);

// Fixture updates from inner proxies need to bubble up to the root proxy
const onFixtureUpdate = jest.fn();
const onComponentRef = jest.fn();

const ref = jest.fn(async () => {
  await new Promise(resolve => setTimeout(resolve, 5000));
});

// Vars populated from scratch before each test
let wrapper;

const mountProxy = () => {
  // Create Proxy with default options
  const RefCallbackProxy = createRefCallbackProxy();

  // Mouting is more useful because it calls lifecycle methods and enables
  // DOM interaction
  wrapper = mount(
    <RefCallbackProxy
      // Ensure the chain of proxies is properly propagated
      nextProxy={createLinkedList([NextProxy, LastProxy])}
      fixture={{
        component: Component,
        // Except for some rare cases, the proxy needs to pass along the
        // fixture without changing it
        foo: 'bar',
        ref
      }}
      onComponentRef={onComponentRef}
      onFixtureUpdate={onFixtureUpdate}
    />
  );
};

const getNextProxy = () => wrapper.find(NextProxy);
const getNextProxyProps = () => wrapper.find(NextProxy).props();

beforeEach(() => {
  jest.clearAllMocks();
  mountProxy();
});

it('renders next proxy', () => {
  expect(getNextProxy()).toHaveLength(1);
});

it('sends fixture to next proxy', () => {
  expect(getNextProxyProps().fixture).toEqual({
    component: Component,
    foo: 'bar',
    ref
  });
});

it('passes 2nd next proxy to next proxy', () => {
  expect(getNextProxyProps().nextProxy.value).toBe(LastProxy);
});

it('bubbles up fixture updates', () => {
  getNextProxyProps().onFixtureUpdate({});
  expect(onFixtureUpdate.mock.calls).toHaveLength(1);
});

it('it calls onComponentRef after 5 seconds', async () => {
  expect(onComponentRef).not.toHaveBeenCalled();
  jest.runTimersToTime(5000);
  await afterOngoingPromises();
  expect(onComponentRef).toHaveBeenCalledWith('MOCK_REF');
});
