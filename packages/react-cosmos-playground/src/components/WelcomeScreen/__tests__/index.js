import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import noComponents from '../__fixtures__/no-components';
import componentsWithoutFixtures from '../__fixtures__/components-without-fixtures';
import componentsWithFixtures from '../__fixtures__/components-with-fixtures';

describe('WelcomeScreen', () => {
  let wrapper;

  describe('for users without fixtures and components', () => {
    beforeEach(() => {
      wrapper = mount(<Loader fixture={noComponents} />);
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
      wrapper = mount(<Loader fixture={componentsWithoutFixtures} />);
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
      wrapper = mount(<Loader fixture={componentsWithFixtures} />);
    });

    it('should render title', () => {
      expect(wrapper.text()).toMatch(/You're all set/);
    });

    it('should render text', () => {
      expect(wrapper.text()).toMatch(/Be a part of React Cosmos/);
    });
  });
});
