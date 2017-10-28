import React from 'react';
import { mount } from 'enzyme';
import createErrorCatchProxy from '../';

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

const onFixtureUpdate = jest.fn();

// Vars populated from scratch before each test
let wrapper;

const mountProxy = props => {
  onFixtureUpdate.mockClear();

  const ErrorCatchProxy = createErrorCatchProxy();

  // Mouting is more useful because it calls lifecycle methods and enables
  // DOM interaction
  wrapper = mount(
    <ErrorCatchProxy
      nextProxy={{
        // Besides rendering the next proxy, we also need to ensure the 2nd
        // next proxy is passed to the next proxy for further chaining. It
        // might take a few reads to grasp this...
        value: NextProxy,
        next: () => ({
          value: LastProxy,
          next: () => {}
        })
      }}
      fixture={{
        component: Component,
        props
      }}
      onComponentRef={() => {}}
      onFixtureUpdate={onFixtureUpdate}
    />
  );
};

describe('Sane component', () => {
  beforeEach(() => {
    mountProxy({ user: { name: 'Arthur' } });
  });

  it('renders next proxy', () => {
    expect(wrapper.find(NextProxy)).toHaveLength(1);
  });

  it('renders component', () => {
    expect(wrapper.text()).toEqual('Arthur');
  });

  describe('next proxy props', () => {
    let nextProxyProps;

    beforeEach(() => {
      nextProxyProps = wrapper.find(NextProxy).props();
    });

    it('sends fixture to next proxy', () => {
      expect(nextProxyProps.fixture).toEqual({
        component: Component,
        props: { user: { name: 'Arthur' } }
      });
    });

    it('passes 2nd next proxy to next proxy', () => {
      expect(nextProxyProps.nextProxy.value).toBe(LastProxy);
    });

    it('bubbles up fixture updates', () => {
      nextProxyProps.onFixtureUpdate({});
      expect(onFixtureUpdate.mock.calls).toHaveLength(1);
    });
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

  it('renders error', () => {
    expect(wrapper.text()).toEqual(
      'Something went wrong. Check console for errors.'
    );
  });

  it('logs error', () => {
    expect(mockConsoleLog.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});
