import React from 'react';
import { mount } from 'enzyme';
import WelcomeScreen from '../welcome-screen';

describe('WelcomeScreen', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(
      <WelcomeScreen hasFixtures={false} hasComponents={false} />
    );
  });

  describe('for users without fixtures and components', () => {
    it('should render paragraphs', () => {
      expect(wrapper.find('p').length).toBe(2);
    });

    it('should render list items', () => {
      expect(wrapper.find('li').length).toBe(2);
    });

    it('should render correct text', () => {
      expect(wrapper.text()).toMatch(/Congratulations!/);
    });
  });

  describe('for users with fixtures and components', () => {
    beforeEach(() => {
      wrapper.setProps({
        hasFixtures: true,
        hasComponents: true,
      });
    });

    it('should render paragraphs', () => {
      expect(wrapper.find('p').length).toBe(2);
    });

    it('should render list items', () => {
      expect(wrapper.find('li').length).toBe(3);
    });

    it('should render correct text', () => {
      expect(wrapper.text()).toMatch(/contributor/);
    });
  });

  describe('for users with components and without fixtures', () => {
    beforeEach(() => {
      wrapper.setProps({
        hasFixtures: false,
        hasComponents: true,
      });
    });

    it('should render paragraphs', () => {
      expect(wrapper.find('p').length).toBe(5);
    });

    it('should render correct text', () => {
      expect(wrapper.text()).toMatch(/fixtures/);
    });
  });
});
