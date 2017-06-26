import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import CodeMirror from '@skidding/react-codemirror';
import FixtureEditor from '../';
import erredFixture from '../__fixtures__/erred';

const stringify = value => JSON.stringify(value, null, 2);

describe('FixtureEditor error', () => {
  let wrapper;

  beforeEach(() => {
    return new Promise(resolve => {
      // Mount component in order for ref and lifecycle methods to be called
      wrapper = mount(
        <Loader
          proxies={[createStateProxy]}
          component={FixtureEditor}
          fixture={erredFixture}
          onComponentRef={() => {
            resolve();
          }}
        />
      );
    });
  });

  it('displays error', () => {
    expect(wrapper.find('.error').text()).toBe(
      'Unexpected token x in JSON at position 36'
    );
  });

  describe('on value prop change', () => {
    beforeEach(() => {
      wrapper.setProps({
        fixture: {
          props: {
            ...erredFixture.props,
            value: {
              baz: 'qux',
            },
          },
        },
      });
    });

    it('sends new value to editor', () => {
      expect(wrapper.find(CodeMirror).prop('value')).toBe(
        stringify({
          baz: 'qux',
        })
      );
    });

    it('clears error state', () => {
      expect(wrapper.find('.error').length).toBe(0);
    });
  });
});
