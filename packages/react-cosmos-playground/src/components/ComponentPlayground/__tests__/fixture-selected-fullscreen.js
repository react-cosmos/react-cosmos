import until from 'async-until';
import { createContext } from '../../../utils/enzyme';
import FixtureList from '../../FixtureList';
import fixture from '../__fixtures__/selected-fullscreen';

const postMessage = jest.fn();
const { mount, getWrapper, getRef } = createContext({
  fixture,
  async beforeInit() {
    await until(() => getRef().previewIframeEl);
    getRef().previewIframeEl = {
      contentWindow: {
        postMessage
      }
    };
  }
});

describe('CP with fixture already selected in full screen', () => {
  beforeEach(mount);

  test('should not render fixture list', () => {
    expect(getWrapper(FixtureList).length).toEqual(0);
  });

  test('should render loader iframe', () => {
    expect(getWrapper('iframe')).toHaveLength(1);
  });
});
