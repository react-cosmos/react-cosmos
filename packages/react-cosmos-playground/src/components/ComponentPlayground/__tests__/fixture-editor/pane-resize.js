import localForage from 'localforage';
import { createContext } from '../../../../utils/enzyme';
import { FIXTURE_EDITOR_PANE_SIZE } from '../../';
import fixture from '../../__fixtures__/selected-editor';

jest.mock('localforage');

const { mount, getWrapper, getRef } = createContext({
  fixture,
  beforeInit: () => {
    // Fake node width/height
    getRef().contentNode = {
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
      getRef().contentNode = {
        // Portrait
        offsetWidth: 200,
        offsetHeight: 300
      };
      getRef().onResize();
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
