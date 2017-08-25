import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import readyFixture from '../__fixtures__/ready';
import FixtureList from '../../FixtureList';
import WelcomeScreen from '../../WelcomeScreen';
import ComponentPlayground from '../';

// Vars populated in beforeEach blocks
let messageHandlers;
let wrapper;

const handleMessage = e => {
  const { type } = e.data;
  if (!messageHandlers[type]) {
    throw new Error('Unexpected message event');
  }
  messageHandlers[type](e.data);
};

const waitForPostMessage = type =>
  new Promise(resolve => {
    messageHandlers[type] = resolve;
  });

describe('CP fixture list update', () => {
  beforeEach(() => {
    messageHandlers = {};
    window.addEventListener('message', handleMessage, false);

    const onFixtureListUpdate = waitForPostMessage('fixtureListUpdate');

    return new Promise(resolve => {
      // Mount component in order for ref and lifecycle methods to be called
      wrapper = mount(
        <Loader
          proxies={[createStateProxy]}
          component={ComponentPlayground}
          fixture={readyFixture}
          onComponentRef={() => {
            resolve();
          }}
        />
      );
    }).then(() => {
      window.postMessage(
        {
          type: 'fixtureListUpdate',
          fixtures: {
            ComponentA: ['foo', 'bar'],
            ComponentB: ['baz', 'qux', 'quux']
          }
        },
        '*'
      );

      return onFixtureListUpdate;
    });
  });

  afterEach(() => {
    window.removeEventListener('message', handleMessage);
  });

  test('should send fixtures to fixture list', () => {
    expect(wrapper.find(FixtureList).prop('fixtures')).toEqual({
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux', 'quux']
    });
  });

  test('should send fixtures to welcome screen', () => {
    expect(wrapper.find(WelcomeScreen).prop('fixtures')).toEqual({
      ComponentA: ['foo', 'bar'],
      ComponentB: ['baz', 'qux', 'quux']
    });
  });
});
