import React from 'react';
import { shallow } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import WelcomeScreen from '../';
import noComponents from '../__fixtures__/no-components';
import componentsWithoutFixtures from '../__fixtures__/components-without-fixtures';
import componentsWithFixtures from '../__fixtures__/components-with-fixtures';

const shallowLoader = element =>
  shallow(element)
    .dive() // Loader
    .dive(); // PropsProxy

describe('WelcomeScreen', () => {
  let wrapper;

  describe('for users without fixtures and components', () => {
    beforeEach(() => {
      wrapper = shallowLoader(
        <Loader component={WelcomeScreen} fixture={noComponents} />
      ).dive();
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
      wrapper = shallowLoader(
        <Loader component={WelcomeScreen} fixture={componentsWithoutFixtures} />
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
      wrapper = shallowLoader(
        <Loader component={WelcomeScreen} fixture={componentsWithFixtures} />
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
