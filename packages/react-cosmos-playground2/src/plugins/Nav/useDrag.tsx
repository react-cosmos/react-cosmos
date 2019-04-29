import * as React from 'react';

type UseDragArgs = {
  value: number;
  onChange: (value: number) => unknown;
};

type DragState = {
  startValue: number;
  startX: number;
};

export function useDrag({ value, onChange }: UseDragArgs) {
  const [dragState, setDragState] = React.useState<null | DragState>(null);

  const handleDrag = React.useCallback(
    (e: MouseEvent) => {
      if (dragState) {
        const curValue = dragState.startValue + (e.clientX - dragState.startX);
        onChange(curValue);
      }
    },
    [onChange, dragState]
  );

  const handleDragEnd = React.useCallback(() => {
    setDragState(null);
  }, []);

  const handleDragStart = React.useCallback(
    (e: MouseEvent) => {
      setDragState({
        startValue: value,
        startX: e.clientX
      });
    },
    [value]
  );

  React.useEffect((): void | (() => void) => {
    if (dragState) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
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
  const onUnmount = React.useRef<(() => unknown) | null>(null);
  return React.useCallback(
    (elRef: HTMLElement | null) => {
      if (elRef) {
        elRef.addEventListener('mousedown', handleDragStart);
        onUnmount.current = () =>
          elRef.removeEventListener('mousedown', handleDragStart);
      } else if (onUnmount.current) {
        onUnmount.current();
        onUnmount.current = null;
      }
    },
    [handleDragStart]
  );
}
