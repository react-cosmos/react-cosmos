import React from 'react';
import { mount } from 'enzyme';
import afterOngoingPromises from 'after-ongoing-promises';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import createFetchProxy from 'react-cosmos-fetch-proxy';
import selectedFullScreenFixture from '../__fixtures__/selected-fullscreen';
import FixtureList from '../../FixtureList';

const StateProxy = createStateProxy();
const FetchProxy = createFetchProxy();

// Vars populated in beforeEach blocks
let wrapper;

describe('CP with fixture already selected in full screen', () => {
  beforeEach(async () => {
    // Mount component in order for ref and lifecycle methods to be called
    wrapper = mount(
      <Loader
        proxies={[StateProxy, FetchProxy]}
        fixture={selectedFullScreenFixture}
      />
    );
    // Wait for Loader status to be confirmed
    await afterOngoingPromises();
    wrapper.update();
  });

  test('should not render fixture list', () => {
    expect(wrapper.find(FixtureList).length).toEqual(0);
  });

  test('should render loader iframe', () => {
    expect(wrapper.find('iframe')).toHaveLength(1);
  });
});
