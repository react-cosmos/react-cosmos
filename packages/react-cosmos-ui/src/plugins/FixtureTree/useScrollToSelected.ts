import { useEffect, useRef } from 'react';
import { FixtureId } from 'react-cosmos-core';

export function useScrollToSelected(selectedFixtureId: FixtureId | null) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const { current: selectedEl } = selectedRef;
    const { current: containerEl } = containerRef;
    if (containerEl && selectedEl && !isVisibleInside(selectedEl, containerEl))
      selectedEl.scrollIntoView({ block: 'center' });
  }, [selectedFixtureId]);

  return { containerRef, selectedRef };
}

function isVisibleInside(element: HTMLElement, container: HTMLElement) {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  return (
    containerRect.top < elementRect.top &&
    elementRect.bottom < containerRect.bottom
  );
}
