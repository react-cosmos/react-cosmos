import * as React from 'react';

type Draggable = {
  children: React.ReactNode;
  value: number;
  onChange: (value: number) => unknown;
};

type DragState = {
  startValue: number;
  startX: number;
};

export function Draggable({ children, value, onChange }: Draggable) {
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
    (e: React.MouseEvent) => {
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

  return <div onMouseDown={handleDragStart}>{children}</div>;
}
