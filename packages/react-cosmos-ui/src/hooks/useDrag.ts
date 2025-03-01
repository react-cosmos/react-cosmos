import { useCallback, useEffect, useRef, useState } from 'react';

type UseDragArgs = {
  value: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  double?: boolean;
  min?: number;
  max?: number;
  onChange: (value: number) => unknown;
};

type DragState = {
  startValue: number;
  startOffset: number;
};

export function useDrag({
  value,
  direction = 'horizontal',
  reverse = false,
  double = false,
  min = 0,
  max = 99999,
  onChange,
}: UseDragArgs) {
  const [dragState, setDragState] = useState<null | DragState>(null);

  const handleDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (dragState) {
        const { startValue, startOffset } = dragState;
        const coords = getEventCoords(e);
        let diff =
          direction === 'horizontal'
            ? coords.x - startOffset
            : coords.y - startOffset;
        if (reverse) diff *= -1;
        if (double) diff *= 2;
        const curValue = Math.min(max, Math.max(min, startValue + diff));
        onChange(curValue);
      }
    },
    [direction, double, dragState, max, min, onChange, reverse]
  );

  const handleDragEnd = useCallback(() => {
    setDragState(null);
  }, []);

  const handleDragStart = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const coords = getEventCoords(e);
      setDragState({
        startValue: value,
        startOffset: direction === 'horizontal' ? coords.x : coords.y,
      });
    },
    [direction, value]
  );

  useEffect((): void | (() => void) => {
    if (dragState) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('touchmove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchend', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('touchmove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [dragState, handleDrag, handleDragEnd]);

  // The returned ref callback will be re-created whenever the "value" arg
  // changes (because handleDragStart depends on it). Even if a DOM node stays
  // constant, whenever we pass a new ref callback to its element React will
  // call it again. The following code ensures:
  //   1. Proper cleanup on unmount
  //   2. The 'mousedown' events is never attached more than once
  // Safety aside, if re-creating the ref callback so often proves to be a perf
  // concern, we can make handleDragStart depend on a constant ref that stays
  // in sync with "value".
  const onUnmount = useRef<(() => unknown) | null>(null);
  const dragElRef = useCallback(
    (elRef: HTMLElement | null) => {
      if (elRef) {
        elRef.addEventListener('mousedown', handleDragStart);
        elRef.addEventListener('touchstart', handleDragStart);
        onUnmount.current = () => {
          elRef.removeEventListener('mousedown', handleDragStart);
          elRef.removeEventListener('touchstart', handleDragStart);
        };
      } else if (onUnmount.current) {
        onUnmount.current();
        onUnmount.current = null;
      }
    },
    [handleDragStart]
  );

  return { dragElRef, dragging: dragState !== null };
}

function getEventCoords(e: MouseEvent | TouchEvent) {
  if ('touches' in e)
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };

  return { x: e.clientX, y: e.clientY };
}
