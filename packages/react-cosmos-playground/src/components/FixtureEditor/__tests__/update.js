import React from 'react';
import merge from 'lodash.merge';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import CodeMirror from '@skidding/react-codemirror';
import propsFixture from '../__fixtures__/props';

const stringify = value => JSON.stringify(value, null, 2);

describe('FixtureEditor update', () => {
  let fixture;
  let wrapper;

  const getProps = () => wrapper.find(CodeMirror).props();
  const getValue = () => JSON.parse(getProps().value);
  const onChange = value => {
    getProps().onChange(stringify(value));
    wrapper.update();
  };

  beforeEach(() => {
    fixture = merge({}, propsFixture, {
      props: {
        onChange: jest.fn(),
        onFocusChange: jest.fn()
      },
      state: {
        isFocused: true
      }
    });
    wrapper = mount(
      <Loader proxies={[createStateProxy()]} fixture={fixture} />
    );
  });

  test('updates value on change', () => {
    onChange({
      props: {
        foo: 'barbar'
      }
    });
    expect(getValue()).toEqual({ props: { foo: 'barbar' } });

    // Edge case: Going back to original value
    onChange({
      props: {
        foo: 'bar'
      }
    });
    expect(getValue()).toEqual({ props: { foo: 'bar' } });
  });
});
