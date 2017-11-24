import localForage from 'localforage';
import { createContext } from '../../../../utils/enzyme';
import DragHandle from '../../../DragHandle';
import { FIXTURE_EDITOR_PANE_SIZE } from '../../';
import fixture from '../../__fixtures__/selected-editor';

jest.mock('localforage');

const { mount, getWrapper } = createContext({
  fixture,
  async mockRefs(compInstance) {
    // Fake node width/height
    compInstance.contentNode = {
      // Landscape
      offsetWidth: 200,
      offsetHeight: 300
    };
  }
});

describe('Portrait fixture editor pane', () => {
  describe('default size', () => {
    beforeEach(mount);

    it('should set landscape class to content', () => {
      expect(getWrapper('.content.contentPortrait')).toHaveLength(1);
    });

    it('should render fixture editor pane', () => {
      expect(getWrapper('.fixtureEditorPane')).toHaveLength(1);
    });

    it('should set default fixture editor pane height', () => {
      expect(getWrapper('.fixtureEditorPane').prop('style').height).toBe(250);
    });

    describe('on drag', () => {
      let dragHandleElement;

      beforeEach(() => {
        localForage.setItem.mockClear();

        dragHandleElement = getWrapper('.fixtureEditorPane')
          .find(DragHandle)
          .getDOMNode();

        // We can't use Enzyme's simulate to trigger native events
        const downEvent = new MouseEvent('mousedown', {
          clientY: 3
        });
        dragHandleElement.dispatchEvent(downEvent);

        const moveEvent = new MouseEvent('mousemove', {
          clientY: 204
        });
        document.dispatchEvent(moveEvent);

        const upEvent = new MouseEvent('mouseup');
        document.dispatchEvent(upEvent);
      });

      it('should resize fixture editor pane', () => {
        expect(getWrapper('.fixtureEditorPane').prop('style').height).toBe(201);
      });

      it('should update cache', () => {
        expect(localForage.setItem).toHaveBeenCalledWith(
          FIXTURE_EDITOR_PANE_SIZE,
          201
        );
      });
    });
  });

  describe('cached size', () => {
    const cachedSize = 270;

    beforeEach(async () => {
      localForage.__setItemMocks({
        [FIXTURE_EDITOR_PANE_SIZE]: cachedSize
      });

      await mount();
    });

    it('should set cached fixture editor pane height', () => {
      expect(getWrapper('.fixtureEditorPane').prop('style').height).toBe(
        cachedSize
      );
    });
  });
});
