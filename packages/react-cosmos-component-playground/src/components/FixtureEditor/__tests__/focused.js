import React from 'react';
import merge from 'lodash.merge';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import CodeMirror from '@skidding/react-codemirror';
import FixtureEditor from '../';
import focusedFixture from '../__fixtures__/focused';

const stringify = value => JSON.stringify(value, null, 2);

describe('FixtureEditor focused', () => {
  let wrapper;

  beforeEach(() => {
    const fixture = merge({}, focusedFixture, {
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
      />
    );

    Promise.resolve().then(() => {
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
  });

  it('does not send new value to editor', () => {
    expect(wrapper.find(CodeMirror).prop('value')).toBe(
      stringify({
        props: {
          foo: 'bar'
        }
      })
    );
  });
});
