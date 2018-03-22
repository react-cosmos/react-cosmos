import React from 'react';
import { mount } from 'enzyme';
import { createLinkedList } from 'react-cosmos-shared';
import createErrorCatchProxy from '..';

// The final responsibility of proxies is to render the user's component at
// the end of the proxy chain. While it goes beyond unit testing, testing a
// complete proxy chain provides a clearer picture than solely dissecting the
// props that the tested proxy passes to the next.
const Component = props => <span>{props.user.name}</span>;

const NextProxy = props => {
  const { nextProxy } = props;
  return <nextProxy.value {...props} nextProxy={nextProxy.next()} />;
};

const LastProxy = ({ fixture }) => <fixture.component {...fixture.props} />;

// Fixture updates from inner proxies need to bubble up to the root proxy
const onFixtureUpdate = jest.fn();

// Vars populated from scratch before each test
let wrapper;

const mountProxy = props => {
  const ErrorCatchProxy = createErrorCatchProxy();

  // Mouting is more useful because it calls lifecycle methods and enables
  // DOM interaction
  wrapper = mount(
    <ErrorCatchProxy
      // Ensure the chain of proxies is properly propagated
      nextProxy={createLinkedList([NextProxy, LastProxy])}
      fixture={{
        component: Component,
        props
      }}
      onComponentRef={() => {}}
      onFixtureUpdate={onFixtureUpdate}
    />
  );
};

const getNextProxy = () => wrapper.find(NextProxy);
const getNextProxyProps = () => wrapper.find(NextProxy).props();

describe('Sane component', () => {
  beforeEach(() => {
    onFixtureUpdate.mockClear();
    mountProxy({ user: { name: 'Arthur' } });
  });

  it('renders next proxy', () => {
    expect(getNextProxy()).toHaveLength(1);
  });

  it('sends fixture to next proxy', () => {
    expect(getNextProxyProps().fixture).toEqual({
      component: Component,
      props: { user: { name: 'Arthur' } }
    });
  });

  it('passes 2nd next proxy to next proxy', () => {
    expect(getNextProxyProps().nextProxy.value).toBe(LastProxy);
  });

  it('bubbles up fixture updates', () => {
    getNextProxyProps().onFixtureUpdate({});
    expect(onFixtureUpdate.mock.calls).toHaveLength(1);
  });

  it('renders component', () => {
    expect(wrapper.text()).toEqual('Arthur');
  });
});

describe('Broken component', () => {
  const origConsoleLog = console.log;
  const origConsoleError = console.log;
  const mockConsoleLog = jest.fn();
  const mockConsoleError = jest.fn();

  beforeEach(() => {
    // Don't spam successful test logs with errors
    console.log = mockConsoleLog;
    console.error = mockConsoleError;
    mountProxy({ user: undefined });
  });

  afterEach(() => {
    console.log = origConsoleLog;
    console.error = origConsoleError;
  });

  it('renders error header', () => {
    expect(wrapper.text()).toContain('Ouch, something wrong');
  });

  it('renders error footer', () => {
    expect(wrapper.text()).toContain('Check console for more info.');
  });

  it('renders error message', () => {
    expect(wrapper.text()).toContain(
      `Cannot read property 'name' of undefined`
    );
  });

  it('logs error', () => {
    expect(mockConsoleLog.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});
