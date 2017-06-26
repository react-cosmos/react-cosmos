import React from 'react';
import { shallow } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import CodeMirror from '@skidding/react-codemirror';
import FixtureEditor from '../';
import propsFixture from '../__fixtures__/props';

const stringify = value => JSON.stringify(value, null, 2);

const shallowLoader = element =>
  shallow(element)
    .dive() // Loader
    .dive(); // PropsProxy

describe('FixtureEditor', () => {
  let fixture;
  let wrapper;

  beforeEach(() => {
    fixture = {
      props: {
        ...propsFixture.props,
        onChange: jest.fn(),
        onFocusChange: jest.fn(),
      },
    };
    wrapper = shallowLoader(
      <Loader component={FixtureEditor} fixture={fixture} />
    );
  });

  it('renders CodeMirror', () => {
    expect(wrapper.find(CodeMirror).length).toBe(1);
  });

  describe('CodeMirror props', () => {
    let props;

    beforeEach(() => {
      props = wrapper.find(CodeMirror).props();
    });

    it('have stringified value', () => {
      expect(props.value).toBe(
        stringify({
          props: { foo: 'bar' },
        })
      );
    });

    it('have preserveScrollPosition flag', () => {
      expect(props.preserveScrollPosition).toBe(true);
    });

    it('trigger onChange prop on valid input', () => {
      props.onChange(
        stringify({
          props: { baz: 'qux' },
        })
      );
      expect(fixture.props.onChange).toHaveBeenCalledWith({
        props: {
          baz: 'qux',
        },
      });
    });

    it('bubble up onFocusChange event', () => {
      props.onFocusChange(true);
      expect(fixture.props.onFocusChange).toHaveBeenCalledWith(true);
    });

    describe('invalid change', () => {
      beforeEach(() => {
        props.onChange('xxxxx');
      });

      it('does not trigger onChange prop on invalid input', () => {
        expect(fixture.props.onChange).not.toHaveBeenCalled();
      });

      it('displays error on invalid input', () => {
        expect(wrapper.find('.error').text()).toBe(
          'Unexpected token x in JSON at position 0'
        );
      });
    });
  });
});
