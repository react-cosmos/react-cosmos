import * as React from 'react';

type DragHandleProps = {
  value: number;
  onChange: (value: number) => unknown;
};

type DragState = {
  startValue: number;
  startX: number;
};

export function DragHandle({ value, onChange }: DragHandleProps) {
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
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    setDragState(null);
  }, [handleDrag]);

  const handleDragStart = React.useCallback(
    (e: React.MouseEvent) => {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
      setDragState({
        startValue: value,
        startX: e.clientX
      });
    },
    [handleDrag, handleDragEnd, value]
  );

  React.useEffect(() => {
    if (dragState) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [dragState, handleDrag, handleDragEnd]);

  return <div onMouseDown={handleDragStart}>ooooooooooo</div>;
}
