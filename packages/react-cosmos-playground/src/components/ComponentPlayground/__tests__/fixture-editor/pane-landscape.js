import until from 'async-until';
import localForage from 'localforage';
import { createContext } from '../../../../utils/enzyme';
import DragHandle from '../../../DragHandle';
import { FIXTURE_EDITOR_PANE_SIZE } from '../..';
import fixture from '../../__fixtures__/selected-editor';

jest.mock('localforage');

const postMessage = jest.fn();
const { mount, getWrapper, getRef } = createContext({
  fixture,
  async beforeInit() {
    // Fake node width/height
    getRef().contentNode = {
      // Landscape
      offsetWidth: 300,
      offsetHeight: 200
    };

    await until(() => getRef().loaderFrame);
    getRef().loaderFrame = {
      contentWindow: {
        postMessage
      }
    };
  }
});

describe('Landscape fixture editor pane', () => {
  describe('default size', () => {
    beforeEach(mount);

    it('should set landscape class to content', () => {
      expect(getWrapper('.content.contentLandscape')).toHaveLength(1);
    });

    it('should render fixture editor pane', () => {
      expect(getWrapper('.fixtureEditorPane')).toHaveLength(1);
    });

    it('should set default fixture editor pane width', () => {
      expect(getWrapper('.fixtureEditorPane').prop('style').width).toBe(250);
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
          clientX: 3
        });
        dragHandleElement.dispatchEvent(downEvent);

        const moveEvent = new MouseEvent('mousemove', {
          clientX: 204
        });
        document.dispatchEvent(moveEvent);

        const upEvent = new MouseEvent('mouseup');
        document.dispatchEvent(upEvent);
      });

      it('should resize fixture editor pane', () => {
        expect(getWrapper('.fixtureEditorPane').prop('style').width).toBe(201);
      });

      it('should update cache', () => {
        expect(localForage.setItem).toHaveBeenCalledWith(
          FIXTURE_EDITOR_PANE_SIZE,
          201
        );
      });
    });

    describe('loader frame overlay', () => {
      it('is visible while dragging', () => {
        const dragHandleElement = getWrapper('.fixtureEditorPane')
          .find(DragHandle)
          .getDOMNode();

        // We can't use Enzyme's simulate to trigger native events
        const downEvent = new MouseEvent('mousedown', {
          clientX: 0
        });
        dragHandleElement.dispatchEvent(downEvent);

        expect(getWrapper('.loaderFrameOverlay').prop('style').display).toBe(
          'block'
        );
      });

      it('is not visible after dragging', () => {
        const dragHandleElement = getWrapper('.fixtureEditorPane')
          .find(DragHandle)
          .getDOMNode();

        // We can't use Enzyme's simulate to trigger native events
        const downEvent = new MouseEvent('mousedown', {
          clientX: 0
        });
        dragHandleElement.dispatchEvent(downEvent);

        const upEvent = new MouseEvent('mouseup');
        document.dispatchEvent(upEvent);

        expect(getWrapper('.loaderFrameOverlay').prop('style').display).toBe(
          'none'
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

    it('should set cached fixture editor pane width', () => {
      expect(getWrapper('.fixtureEditorPane').prop('style').width).toBe(
        cachedSize
      );
    });
  });
});
