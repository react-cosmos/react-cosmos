import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { grey32, grey8 } from '../../../shared/colors';
import { useDrag } from '../../../shared/useDrag';
import { Device, Viewport } from '../public';
import { Header } from './Header';
import {
  getStyles,
  getViewportScaleFactor,
  responsivePreviewBorderWidth,
  responsivePreviewPadding,
  stretchStyle,
} from './style';

type Props = {
  children?: React.ReactNode;
  devices: Device[];
  enabled: boolean;
  viewport: Viewport;
  scaled: boolean;
  validFixtureSelected: boolean;
  setViewport(viewport: Viewport): unknown;
  setScaled(scaled: boolean): unknown;
};

export function ResponsivePreview({
  children,
  devices,
  enabled,
  viewport,
  scaled,
  validFixtureSelected,
  setViewport,
  setScaled,
}: Props) {
  const [container, setContainer] = useState<null | Viewport>(null);

  const leftDrag = useDrag({
    value: viewport.width,
    direction: 'horizontal',
    double: true,
    reverse: true,
    min: 32,
    onChange: width => setViewport({ ...viewport, width }),
  });
  const rightDrag = useDrag({
    value: viewport.width,
    direction: 'horizontal',
    double: true,
    min: 32,
    onChange: width => setViewport({ ...viewport, width }),
  });
  const bottomDrag = useDrag({
    value: viewport.height,
    direction: 'vertical',
    double: true,
    min: 32,
    onChange: height => setViewport({ ...viewport, height }),
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
  if (!validFixtureSelected || !enabled || !container) {
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
      <Header
        devices={devices}
        selectedViewport={viewport}
        scaleFactor={scaleFactor}
        scaled={scaled}
        selectViewport={setViewport}
        toggleScale={() => setScaled(!scaled)}
      />
      <div key="preview" ref={handleContainerRef} style={maskContainerStyle}>
        <div
          style={{
            ...padContainerStyle,
            position: 'relative',
          }}
        >
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
  if (!containerEl) {
    return null;
  }

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
  background: ${grey32};
`;

const HorizontalDragIndicator = styled.div`
  margin: 8px 0;
  width: 64px;
  height: 5px;
  border-radius: 3px;
  background: ${grey32};
`;

// The purpose of DragOverlay is to cover the renderer iframe while dragging,
// because otherwise the iframe steaps the mousemove events and stops the drag.
const DragOverlay = styled.div`
  position: absolute;
  top: ${responsivePreviewPadding.top + responsivePreviewBorderWidth}px;
  left: ${responsivePreviewPadding.left + responsivePreviewBorderWidth}px;
`;
