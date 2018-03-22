import localForage from 'localforage';
import { createContext } from '../../../utils/enzyme';
import DragHandle from '../../DragHandle';
import { LEFT_NAV_SIZE } from '..';
import fixture from '../__fixtures__/ready';

jest.mock('localforage');

const { mount, getWrapper } = createContext({ fixture });

describe('CP left nav drag', () => {
  describe('default size', () => {
    beforeEach(mount);

    it('should set default left nav width', () => {
      expect(getWrapper('.leftNav').prop('style').width).toBe(250);
    });
  });

  describe('cached size', () => {
    const cachedSize = 220;

    beforeEach(async () => {
      localForage.__setItemMocks({
        [LEFT_NAV_SIZE]: cachedSize
      });

      await mount();
    });

    it('should set cached left nav width', () => {
      expect(getWrapper('.leftNav').prop('style').width).toBe(cachedSize);
    });

    it('should render DragHandle in left nav', () => {
      expect(getWrapper('.leftNav').find(DragHandle)).toHaveLength(1);
    });
  });

  describe('on drag', () => {
    let dragHandleElement;

    beforeEach(() => {
      localForage.setItem.mockClear();

      dragHandleElement = getWrapper('.leftNav')
        .find(DragHandle)
        .getDOMNode();

      // We can't use Enzyme's simulate to trigger native events
      const downEvent = new MouseEvent('mousedown', {
        clientX: 2
      });
      dragHandleElement.dispatchEvent(downEvent);

      const moveEvent = new MouseEvent('mousemove', {
        clientX: 202
      });
      document.dispatchEvent(moveEvent);

      const upEvent = new MouseEvent('mouseup');
      document.dispatchEvent(upEvent);
    });

    it('should resize left nav', () => {
      expect(getWrapper('.leftNav').prop('style').width).toBe(200);
    });

    it('should update cache', () => {
      expect(localForage.setItem).toHaveBeenCalledWith(LEFT_NAV_SIZE, 200);
    });
  });

  describe('loader frame overlay', () => {
    it('is visible while dragging', () => {
      const dragHandleElement = getWrapper('.leftNav')
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
      const dragHandleElement = getWrapper('.leftNav')
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
