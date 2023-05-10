import { isEqual } from 'lodash-es';
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';
import { useDrag } from '../../../hooks/useDrag.js';
import { grey64, grey8 } from '../../../style/colors.js';
import { ResponsiveDevice, ResponsiveViewport } from '../spec.js';
import { ResponsiveHeader } from './ResponsiveHeader.js';
import {
  getStyles,
  getViewportScaleFactor,
  responsivePreviewBorderWidth,
  responsivePreviewPadding,
  stretchStyle,
} from './style.js';

type Props = {
  children?: ReactNode;
  devices: ResponsiveDevice[];
  enabled: boolean;
  viewport: ResponsiveViewport;
  scaled: boolean;
  setViewport: Dispatch<SetStateAction<ResponsiveViewport>>;
  setScaled: (scaled: boolean) => unknown;
};

export function ResponsivePreview({
  children,
  devices,
  enabled,
  viewport,
  scaled,
  setViewport,
  setScaled,
}: Props) {
  const [container, setContainer] = useState<null | ResponsiveViewport>(null);

  const onWidthChange = useCallback(
    (width: number) =>
      setViewport(prevViewport => ({ ...prevViewport, width })),
    [setViewport]
  );
  const onHeightChange = useCallback(
    (height: number) =>
      setViewport(prevViewport => ({ ...prevViewport, height })),
    [setViewport]
  );

  const leftDrag = useDrag({
    value: viewport.width,
    direction: 'horizontal',
    double: true,
    reverse: true,
    min: 32,
    onChange: onWidthChange,
  });
  const rightDrag = useDrag({
    value: viewport.width,
    direction: 'horizontal',
    double: true,
    min: 32,
    onChange: onWidthChange,
  });
  const bottomDrag = useDrag({
    value: viewport.height,
    direction: 'vertical',
    double: true,
    min: 32,
    onChange: onHeightChange,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateContainerSize = useCallback(() => {
    const currentContainer = getContainerSize(containerRef.current);
    if (!isEqual(currentContainer, container)) setContainer(currentContainer);
  }, [container]);

  useEffect(() => {
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, [updateContainerSize]);

  function handleContainerRef(el: HTMLDivElement | null) {
    containerRef.current = el;
    if (el) updateContainerSize();
  }

  // We don't simply do `return children` because it would cause a flicker
  // whenever switching between responsive and non responsive mode. By
  // returning the same element nesting between states for Preview the
  // component instances are preserved and the transition is seamless.
  if (!enabled || !container) {
    return (
      <Container>
        <div key="preview" ref={handleContainerRef} style={stretchStyle}>
          <div style={stretchStyle}>
            <div key="container" style={stretchStyle}>
              <div style={stretchStyle}>{children}</div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  const scaleFactor = getViewportScaleFactor(viewport, container);
  const {
    maskContainerStyle,
    padContainerStyle,
    alignContainerStyle,
    scaleContainerStyle,
  } = getStyles({ container, viewport, scaled });
  return (
    <Container>
      <ResponsiveHeader
        devices={devices}
        selectedViewport={viewport}
        scaleFactor={scaleFactor}
        scaled={scaled}
        selectViewport={setViewport}
        toggleScale={() => setScaled(!scaled)}
      />
      <div key="preview" ref={handleContainerRef} style={maskContainerStyle}>
        <div style={padContainerStyle}>
          <div key="container" style={alignContainerStyle}>
            <div style={scaleContainerStyle}>{children}</div>
          </div>
          <LeftDragHandle ref={leftDrag.dragElRef}>
            <VerticalDragIndicator />
          </LeftDragHandle>
          <RightDragHandle ref={rightDrag.dragElRef}>
            <VerticalDragIndicator />
          </RightDragHandle>
          <BottomDragHandle ref={bottomDrag.dragElRef}>
            <HorizontalDragIndicator />
          </BottomDragHandle>
          {(leftDrag.dragging || rightDrag.dragging || bottomDrag.dragging) && (
            <DragOverlay
              style={{
                width: alignContainerStyle.width,
                height: alignContainerStyle.height,
              }}
            />
          )}
        </div>
      </div>
    </Container>
  );
}

function getContainerSize(containerEl: null | HTMLElement) {
  if (!containerEl) return null;

  const { width, height } = containerEl.getBoundingClientRect();
  return { width, height };
}

const Container = styled.div.attrs({ 'data-testid': 'responsivePreview' })`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: ${grey8};
`;

const commonDragHandleStyles = css`
  position: absolute;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LeftDragHandle = styled.div`
  ${commonDragHandleStyles};
  top: ${responsivePreviewPadding.top}px;
  bottom: ${responsivePreviewPadding.bottom}px;
  left: 0;
  width: ${responsivePreviewPadding.left}px;
  cursor: col-resize;
  flex-direction: column;
  align-items: flex-end;
`;

const RightDragHandle = styled.div`
  ${commonDragHandleStyles};
  top: ${responsivePreviewPadding.top}px;
  bottom: ${responsivePreviewPadding.bottom}px;
  right: 0;
  width: ${responsivePreviewPadding.left}px;
  cursor: col-resize;
  flex-direction: column;
  align-items: flex-start;
`;

const BottomDragHandle = styled.div`
  ${commonDragHandleStyles};
  bottom: 0;
  left: ${responsivePreviewPadding.left}px;
  right: ${responsivePreviewPadding.right}px;
  height: ${responsivePreviewPadding.bottom}px;
  cursor: row-resize;
  flex-direction: row;
  align-items: flex-start;
`;

const VerticalDragIndicator = styled.div`
  margin: 0 8px;
  width: 5px;
  height: 64px;
  border-radius: 3px;
  background: ${grey64};
`;

const HorizontalDragIndicator = styled.div`
  margin: 8px 0;
  width: 64px;
  height: 5px;
  border-radius: 3px;
  background: ${grey64};
`;

// The purpose of DragOverlay is to cover the renderer iframe while dragging,
// because otherwise the iframe steaps the mousemove events and stops the drag.
const DragOverlay = styled.div`
  position: absolute;
  top: ${responsivePreviewPadding.top + responsivePreviewBorderWidth}px;
  left: ${responsivePreviewPadding.left + responsivePreviewBorderWidth}px;
`;
