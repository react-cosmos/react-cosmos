import merge from 'lodash.merge';
import { createContext } from '../../../utils/enzyme';
import CodeMirror from '@skidding/react-codemirror';
import fixture from '../__fixtures__/erred';

const stringify = value => JSON.stringify(value, null, 2);

const { getWrapper, getRootWrapper, mount } = createContext({ fixture });

describe('FixtureEditor error', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await mount();
  });

  it('displays error', () => {
    expect(getWrapper('.error').text()).toBe(
      'Unexpected token x in JSON at position 37'
    );
  });

  describe('on editor onChange', () => {
    beforeEach(() => {
      getWrapper(CodeMirror).prop('onChange')(
        stringify({
          props: { baz: 'qux' }
        })
      );
    });

    it('clears error state', () => {
      expect(getWrapper('.error')).toHaveLength(0);
    });
  });

  describe('on value prop change', () => {
    beforeEach(() => {
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

    it('sends new value to editor', () => {
      expect(getWrapper(CodeMirror).prop('value')).toBe(
        stringify({
          props: {
            foo: 'baz'
          }
        })
      );
    });

    it('clears error state', () => {
      expect(getWrapper('.error')).toHaveLength(0);
    });
  });
});
