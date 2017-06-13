import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import selectedFullScreenFixture from '../__fixtures__/selected-fullscreen';
import FixtureList from '../../FixtureList';
import ComponentPlayground from '../';

// Vars populated in beforeEach blocks
let wrapper;

describe('CP with fixture already selected in full screen', () => {
  beforeEach(() => {
    return new Promise(resolve => {
      // Mount component in order for ref and lifecycle methods to be called
      wrapper = mount(
        <Loader
          proxies={[createStateProxy()]}
          component={ComponentPlayground}
          fixture={selectedFullScreenFixture}
          onComponentRef={() => {
            resolve();
          }}
        />
      );
    });
  });

  test('should not render fixture list', () => {
    expect(wrapper.find(FixtureList).length).toEqual(0);
  });

  test('should render loader iframe', () => {
    expect(wrapper.find('iframe').length).toBe(1);
  });
});
