import { isEqual } from 'lodash';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { grey8 } from '../../../shared/colors';
import { useDrag } from '../../../shared/useDrag';
import { Device, Viewport } from '../public';
import { Header } from './Header';
import { getStyles, getViewportScaleFactor, stretchStyle } from './style';

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

  const hDrag = useDrag({
    value: viewport.width,
    direction: 'horizontal',
    double: true,
    min: 32,
    onChange: width => setViewport({ ...viewport, width }),
  });
  const vDrag = useDrag({
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
          <div
            ref={hDrag.dragElRef}
            style={{
              position: 'absolute',
              top: padContainerStyle.paddingTop,
              bottom: padContainerStyle.paddingBottom,
              right: 0,
              width: padContainerStyle.paddingRight,
              background: 'rgba(255, 255, 255, 0.3)',
              cursor: 'col-resize',
              userSelect: 'none',
            }}
          />
          <div
            ref={vDrag.dragElRef}
            style={{
              position: 'absolute',
              height: padContainerStyle.paddingBottom,
              bottom: 0,
              left: padContainerStyle.paddingLeft,
              right: padContainerStyle.paddingRight,
              background: 'rgba(255, 255, 255, 0.3)',
              cursor: 'row-resize',
              userSelect: 'none',
            }}
          />
          {(hDrag.dragging || vDrag.dragging) && (
            <div
              style={{
                position: 'absolute',
                top: padContainerStyle.paddingTop + 1,
                left: padContainerStyle.paddingLeft + 1,
                width: alignContainerStyle.width,
                height: alignContainerStyle.height,
                backgroundColor: 'rgba(255, 0, 0, 0.3)',
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
