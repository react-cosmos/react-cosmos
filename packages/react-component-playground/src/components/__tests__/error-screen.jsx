import React from 'react';
import { shallow } from 'enzyme';
import ErrorScreen from '../error-screen';

describe('ErrorScreen', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = shallow(
      <ErrorScreen componentName="Flatris" fixtureName="WithState" />
    );
  });

  describe('for users without valid fixture or component', () => {
    it('should render paragraphs', () => {
      expect(wrapper.find('p').length).toBe(2);
    });

    it('should render correct component name', () => {
      expect(wrapper.text()).toMatch(/Flatris/);
    });

    it('should render correct fixture name', () => {
      expect(wrapper.text()).toMatch(/WithState/);
    });
  });
});
