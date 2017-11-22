import until from 'async-until';
import createInitCallbackProxy from 'react-cosmos-loader/lib/components/InitCallbackProxy';
import createFetchProxy from 'react-cosmos-fetch-proxy';
import { createContext } from '../../../utils/enzyme';
import MissingScreen from '../../screens/MissingScreen';
import fixture from '../__fixtures__/selected-missing';

const InitCallbackProxy = createInitCallbackProxy();
const FetchProxy = createFetchProxy();

const postMessage = jest.fn();

const { mount, getWrapper } = createContext({
  proxies: [InitCallbackProxy, FetchProxy],
  fixture,
  async mockRefs(compInstance) {
    await until(() => compInstance.loaderFrame);
    compInstance.loaderFrame = {
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
    expect(getWrapper().find(MissingScreen)).toHaveLength(1);
  });

  test('sends component name to MissingScreen', () => {
    const { componentName } = getWrapper()
      .find(MissingScreen)
      .props();
    expect(componentName).toBe('ComponentA');
  });

  test('sends fixture name to MissingScreen', () => {
    const { fixtureName } = getWrapper()
      .find(MissingScreen)
      .props();
    expect(fixtureName).toBe('foot');
  });
});
