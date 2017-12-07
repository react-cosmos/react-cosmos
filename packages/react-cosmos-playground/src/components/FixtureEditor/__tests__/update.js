import { createContext } from '../../../utils/enzyme';
import CodeMirror from '@skidding/react-codemirror';
import fixture from '../__fixtures__/props';

const stringify = value => JSON.stringify(value, null, 2);

const { getWrapper, mount } = createContext({ fixture });

const getProps = () =>
  getWrapper()
    .find(CodeMirror)
    .props();
const getValue = () => JSON.parse(getProps().value);
const onChange = value => {
  getProps().onChange(stringify(value));
};

beforeEach(async () => {
  jest.clearAllMocks();
  await mount();
});

describe('FixtureEditor update', () => {
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
