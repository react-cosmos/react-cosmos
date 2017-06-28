import React from 'react';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import createStateProxy from 'react-cosmos-state-proxy';
import readyFixture from '../__fixtures__/ready';
import DragHandle from '../../DragHandle';
import ComponentPlayground, { LEFT_NAV_SIZE } from '../';
import localForage from 'localforage';

jest.mock('localforage');

// Vars populated in beforeEach blocks
let wrapper;

describe('CP left nav drag', () => {
  describe('default size', () => {
    beforeEach(() => {
      return new Promise(resolve => {
        // Mount component in order for ref and lifecycle methods to be called
        wrapper = mount(
          <Loader
            proxies={[createStateProxy]}
            component={ComponentPlayground}
            fixture={readyFixture}
            onComponentRef={() => {
              resolve();
            }}
          />
        );
      });
    });

    it('should set default left nav width', () => {
      expect(wrapper.find('.leftNav').prop('style').width).toBe(250);
    });
  });

  describe('cached size', () => {
    const cachedSize = 220;

    beforeEach(() => {
      localForage.__setItemMocks({
        [LEFT_NAV_SIZE]: cachedSize,
      });

      return new Promise(resolve => {
        // Mount component in order for ref and lifecycle methods to be called
        wrapper = mount(
          <Loader
            proxies={[createStateProxy]}
            component={ComponentPlayground}
            fixture={readyFixture}
            onComponentRef={() => {
              resolve();
            }}
          />
        );
      });
    });

    it('should set cached left nav width', () => {
      expect(wrapper.find('.leftNav').prop('style').width).toBe(cachedSize);
    });

    it('should render DragHandle in left nav', () => {
      expect(wrapper.find('.leftNav').find(DragHandle)).toHaveLength(1);
    });
  });

  describe('on drag', () => {
    let dragHandleElement;

    beforeEach(() => {
      localForage.setItem.mockClear();

      dragHandleElement = wrapper
        .find('.leftNav')
        .find(DragHandle)
        .getDOMNode();

      // We can't use Enzyme's simulate to trigger native events
      const downEvent = new MouseEvent('mousedown', {
        clientX: 2,
      });
      dragHandleElement.dispatchEvent(downEvent);

      const moveEvent = new MouseEvent('mousemove', {
        clientX: 202,
      });
      document.dispatchEvent(moveEvent);

      const upEvent = new MouseEvent('mouseup');
      document.dispatchEvent(upEvent);
    });

    it('should resize left nav', () => {
      expect(wrapper.find('.leftNav').prop('style').width).toBe(200);
    });

    it('should update cache', () => {
      expect(localForage.setItem).toHaveBeenCalledWith(LEFT_NAV_SIZE, 200);
    });
  });

  describe('loader frame overlay', () => {
    it('is visible while dragging', () => {
      const dragHandleElement = wrapper
        .find('.leftNav')
        .find(DragHandle)
        .getDOMNode();

      // We can't use Enzyme's simulate to trigger native events
      const downEvent = new MouseEvent('mousedown', {
        clientX: 0,
      });
      dragHandleElement.dispatchEvent(downEvent);

      expect(wrapper.find('.loaderFrameOverlay').prop('style').display).toBe(
        'block'
      );
    });

    it('is not visible after dragging', () => {
      const dragHandleElement = wrapper
        .find('.leftNav')
        .find(DragHandle)
        .getDOMNode();

      // We can't use Enzyme's simulate to trigger native events
      const downEvent = new MouseEvent('mousedown', {
        clientX: 0,
      });
      dragHandleElement.dispatchEvent(downEvent);

      const upEvent = new MouseEvent('mouseup');
      document.dispatchEvent(upEvent);

      expect(wrapper.find('.loaderFrameOverlay').prop('style').display).toBe(
        'none'
      );
    });
  });
});
