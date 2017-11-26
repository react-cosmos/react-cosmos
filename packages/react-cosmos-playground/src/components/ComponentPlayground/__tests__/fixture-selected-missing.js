import until from 'async-until';
import { createContext } from '../../../utils/enzyme';
import MissingScreen from '../../screens/MissingScreen';
import fixture from '../__fixtures__/selected-missing';

const postMessage = jest.fn();

const { mount, getWrapper, getRef } = createContext({
  fixture,
  async beforeInit() {
    await until(() => getRef().loaderFrame);
    getRef().loaderFrame = {
      contentWindow: {
        postMessage
      }
    };
  }
});

describe('CP with missing fixture already selected', () => {
  beforeEach(mount);

  test('does not send fixture select message to loader', () => {
    expect(postMessage).not.toHaveBeenCalled();
  });

  test('renders MissingScreen', () => {
    expect(getWrapper(MissingScreen)).toHaveLength(1);
  });

  test('sends component name to MissingScreen', () => {
    const { componentName } = getWrapper(MissingScreen).props();
    expect(componentName).toBe('ComponentA');
  });

  test('sends fixture name to MissingScreen', () => {
    const { fixtureName } = getWrapper(MissingScreen).props();
    expect(fixtureName).toBe('foot');
  });
});
