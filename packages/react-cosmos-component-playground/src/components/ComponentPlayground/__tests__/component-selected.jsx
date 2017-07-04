import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import selectedComponentFixture from '../__fixtures__/selected-component';
import ComponentPage from '../../ComponentPage';
import ComponentPlayground from '../';

// Vars populated in beforeEach blocks
let wrapper;

describe('CP with component already selected', () => {
  beforeEach(() => {
    wrapper = mount(
      <Loader
        proxies={[createStateProxy]}
        component={ComponentPlayground}
        fixture={selectedComponentFixture}
      />
    );
  });

  describe('main menu', () => {
    it('should render home button', () => {
      expect(wrapper.find('a[href="/"].button')).toHaveLength(1);
    });

    it('should not render selected home button', () => {
      expect(wrapper.find('a[href="/"].selectedButton')).toHaveLength(0);
    });
  });

  describe('component page init', () => {
    test('should render grid', () => {
      expect(wrapper.find(ComponentPage)).toHaveLength(1);
    });
  });
});
