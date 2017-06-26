import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import selectedEditorFixture from '../../__fixtures__/selected-editor';
import DragHandle from '../../../DragHandle';
import ComponentPlayground, { FIXTURE_EDITOR_PANE_SIZE } from '../../';
import localForage from 'localforage';

jest.mock('localforage');

// Vars populated in beforeEach blocks
let wrapper;
let instance;

const mockContentNodeSize = () => {
  // Fake node width/height
  instance.contentNode = {
    // Portrait
    offsetWidth: 200,
    offsetHeight: 300,
  };
};

describe('Portrait fixture editor pane', () => {
  describe('default size', () => {
    beforeEach(() => {
      return new Promise(resolve => {
        // Mount component in order for ref and lifecycle methods to be called
        wrapper = mount(
          <Loader
            proxies={[createStateProxy]}
            component={ComponentPlayground}
            fixture={selectedEditorFixture}
            onComponentRef={i => {
              instance = i;
              resolve();
            }}
          />
        );
      }).then(mockContentNodeSize);
    });

    it('should set landscape class to content', () => {
      expect(wrapper.find('.content.contentPortrait').length).toBe(1);
    });

    it('should render fixture editor pane', () => {
      expect(wrapper.find('.fixtureEditorPane').length).toBe(1);
    });

    it('should set default fixture editor pane height', () => {
      expect(wrapper.find('.fixtureEditorPane').prop('style').height).toBe(250);
    });

    describe('on drag', () => {
      let dragHandleElement;

      beforeEach(() => {
        localForage.setItem.mockClear();

        dragHandleElement = wrapper
          .find('.fixtureEditorPane')
          .find(DragHandle)
          .getDOMNode();

        // We can't use Enzyme's simulate to trigger native events
        const downEvent = new MouseEvent('mousedown', {
          clientY: 3,
        });
        dragHandleElement.dispatchEvent(downEvent);

        const moveEvent = new MouseEvent('mousemove', {
          clientY: 204,
        });
        document.dispatchEvent(moveEvent);

        const upEvent = new MouseEvent('mouseup');
        document.dispatchEvent(upEvent);
      });

      it('should resize fixture editor pane', () => {
        expect(wrapper.find('.fixtureEditorPane').prop('style').height).toBe(
          201
        );
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

    beforeEach(() => {
      localForage.__setItemMocks({
        [FIXTURE_EDITOR_PANE_SIZE]: cachedSize,
      });

      return new Promise(resolve => {
        // Mount component in order for ref and lifecycle methods to be called
        wrapper = mount(
          <Loader
            proxies={[createStateProxy]}
            component={ComponentPlayground}
            fixture={selectedEditorFixture}
            onComponentRef={i => {
              instance = i;
              resolve();
            }}
          />
        );
      }).then(mockContentNodeSize);
    });

    it('should set cached fixture editor pane height', () => {
      expect(wrapper.find('.fixtureEditorPane').prop('style').height).toBe(
        cachedSize
      );
    });
  });
});
