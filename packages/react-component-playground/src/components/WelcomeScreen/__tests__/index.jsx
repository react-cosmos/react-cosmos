import React from 'react';
import { shallow } from 'enzyme';
import WelcomeScreen from '../';

describe('WelcomeScreen', () => {
  let wrapper;

  describe('for users without fixtures and components', () => {
    beforeEach(() => {
      wrapper = shallow(<WelcomeScreen fixtures={{}} />).dive();
    });

    it('should render title', () => {
      expect(wrapper.text()).toMatch(/Congratulations/);
    });

    it('should render text', () => {
      expect(wrapper.text()).toMatch(/Adjust componentPaths/);
    });
  });

  describe('for users with components without fixtures', () => {
    beforeEach(() => {
      wrapper = shallow(
        <WelcomeScreen
          fixtures={{
            ComponentA: [],
            ComponentB: [],
          }}
        />
      ).dive();
    });

    it('should render title', () => {
      expect(wrapper.text()).toMatch(/Almost there/);
    });

    it('should render text', () => {
      expect(wrapper.text()).toMatch(/Read the creating fixtures guide/);
    });
  });

  describe('for users with components and fixtures', () => {
    beforeEach(() => {
      wrapper = shallow(
        <WelcomeScreen
          fixtures={{
            ComponentA: ['foo'],
            ComponentB: ['bar'],
          }}
        />
      ).dive();
    });

    it('should render title', () => {
      expect(wrapper.text()).toMatch(/You're all set/);
    });

    it('should render text', () => {
      expect(wrapper.text()).toMatch(/Be a part of React Cosmos/);
    });
  });
});
