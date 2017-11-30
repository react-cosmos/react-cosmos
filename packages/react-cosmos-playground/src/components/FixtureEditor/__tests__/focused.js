import merge from 'lodash.merge';
import { createContext } from '../../../utils/enzyme';
import CodeMirror from '@skidding/react-codemirror';
import fixture from '../__fixtures__/focused';

const stringify = value => JSON.stringify(value, null, 2);

const { getWrapper, getRootWrapper, mount } = createContext({ fixture });

describe('FixtureEditor focused', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await mount();

    getRootWrapper().setProps({
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

  it('does not send new value to editor', () => {
    expect(getWrapper(CodeMirror).prop('value')).toBe(
      stringify({
        props: {
          foo: 'bar'
        }
      })
    );
  });
});
