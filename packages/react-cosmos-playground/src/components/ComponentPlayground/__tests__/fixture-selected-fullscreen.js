import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import selectedFullScreenFixture from '../__fixtures__/selected-fullscreen';
import FixtureList from '../../FixtureList';

// Vars populated in beforeEach blocks
let wrapper;

describe('CP with fixture already selected in full screen', () => {
  beforeEach(() => {
    // Mount component in order for ref and lifecycle methods to be called
    wrapper = mount(
      <Loader
        proxies={[createStateProxy()]}
        fixture={selectedFullScreenFixture}
      />
    );
  });

  test('should not render fixture list', () => {
    expect(wrapper.find(FixtureList).length).toEqual(0);
  });

  test('should render loader iframe', () => {
    expect(wrapper.find('iframe')).toHaveLength(1);
  });
});
