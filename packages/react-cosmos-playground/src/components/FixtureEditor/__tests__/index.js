import { createContext } from '../../../utils/enzyme';
import CodeMirror from '@skidding/react-codemirror';
import fixture from '../__fixtures__/props';

const stringify = value => JSON.stringify(value, null, 2);

const { getWrapper, mount } = createContext({ fixture });

const getCodeMirrorProps = () => getWrapper(CodeMirror).props();

describe('FixtureEditor', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await mount();
  });

  it('renders CodeMirror', () => {
    expect(getWrapper(CodeMirror)).toHaveLength(1);
  });

  describe('CodeMirror props', () => {
    it('have stringified value', () => {
      expect(getCodeMirrorProps().value).toBe(
        stringify({
          props: { foo: 'bar' }
        })
      );
    });

    it('have preserveScrollPosition flag', () => {
      expect(getCodeMirrorProps().preserveScrollPosition).toBe(true);
    });

    it('trigger onChange prop on valid input', () => {
      getCodeMirrorProps().onChange(
        stringify({
          props: { baz: 'qux' }
        })
      );
      expect(getWrapper().props().onChange).toHaveBeenCalledWith({
        props: {
          baz: 'qux'
        }
      });
    });

    describe('invalid change', () => {
      beforeEach(() => {
        getCodeMirrorProps().onChange('xxxxx');
      });

      it('does not trigger onChange prop on invalid input', () => {
        expect(getWrapper().props().onChange).not.toHaveBeenCalled();
      });

      it('displays error on invalid input', () => {
        expect(getWrapper('.error').text()).toBe(
          'Unexpected token x in JSON at position 0'
        );
      });
    });
  });
});
