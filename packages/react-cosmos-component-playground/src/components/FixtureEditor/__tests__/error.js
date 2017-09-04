import React from 'react';
import merge from 'lodash.merge';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import CodeMirror from '@skidding/react-codemirror';
import FixtureEditor from '../';
import erredFixture from '../__fixtures__/erred';

const stringify = value => JSON.stringify(value, null, 2);

describe('FixtureEditor error', () => {
  let wrapper;
  let fixture;

  beforeEach(() => {
    return new Promise(resolve => {
      fixture = merge({}, erredFixture, {
        props: {
          onChange: jest.fn()
        }
      });

      // Mount component in order for ref and lifecycle methods to be called
      wrapper = mount(
        <Loader
          proxies={[createStateProxy()]}
          component={FixtureEditor}
          fixture={fixture}
          onComponentRef={() => {
            resolve();
          }}
        />
      );
    });
  });

  it('displays error', () => {
    expect(wrapper.find('.error').text()).toBe(
      'Unexpected token x in JSON at position 37'
    );
  });

  describe('on editor onChange', () => {
    beforeEach(() => {
      wrapper.find(CodeMirror).prop('onChange')(
        stringify({
          props: { baz: 'qux' }
        })
      );
    });

    it('clears error state', () => {
      expect(wrapper.find('.error')).toHaveLength(0);
    });
  });

  describe('on value prop change', () => {
    beforeEach(() => {
      wrapper.setProps({
        fixture: merge({}, fixture, {
          props: {
            value: {
              props: {
                foo: 'baz'
              }
            }
          }
        })
      });
    });

    it('sends new value to editor', () => {
      expect(wrapper.find(CodeMirror).prop('value')).toBe(
        stringify({
          props: {
            foo: 'baz'
          }
        })
      );
    });

    it('clears error state', () => {
      expect(wrapper.find('.error')).toHaveLength(0);
    });
  });
});
