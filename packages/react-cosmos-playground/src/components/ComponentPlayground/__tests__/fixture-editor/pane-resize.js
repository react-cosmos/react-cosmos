import localForage from 'localforage';
import createInitCallbackProxy from 'react-cosmos-loader/lib/components/InitCallbackProxy';
import createFetchProxy from 'react-cosmos-fetch-proxy';
import { createContext } from '../../../../utils/enzyme';
import { FIXTURE_EDITOR_PANE_SIZE } from '../../';
import fixture from '../../__fixtures__/selected-editor';

jest.mock('localforage');

const InitCallbackProxy = createInitCallbackProxy();
const FetchProxy = createFetchProxy();

const { mount, getWrapper, getCompInstance } = createContext({
  proxies: [InitCallbackProxy, FetchProxy],
  fixture,
  async mockRefs(compInstance) {
    // Fake node width/height
    compInstance.contentNode = {
      // Landscape
      offsetWidth: 300,
      offsetHeight: 200
    };
  }
});

const cachedSize = 270;

describe('Resize fixture editor pane', () => {
  beforeEach(async () => {
    localForage.__setItemMocks({
      [FIXTURE_EDITOR_PANE_SIZE]: cachedSize
    });

    await mount();
  });

  it('should set landscape class to content', () => {
    expect(getWrapper('.content.contentLandscape')).toHaveLength(1);
  });

  it('should set cached fixture editor pane width', () => {
    expect(getWrapper('.fixtureEditorPane').prop('style').width).toBe(
      cachedSize
    );
  });

  describe('from landscape to portrait', () => {
    beforeEach(() => {
      getCompInstance().contentNode = {
        // Portrait
        offsetWidth: 200,
        offsetHeight: 300
      };
      getCompInstance().onResize();
    });

    it('should set portrait class to content', () => {
      expect(getWrapper('.content.contentPortrait')).toHaveLength(1);
    });

    it('should set cached fixture editor pane height', () => {
      expect(getWrapper('.fixtureEditorPane').prop('style').height).toBe(
        cachedSize
      );
    });
  });
});
