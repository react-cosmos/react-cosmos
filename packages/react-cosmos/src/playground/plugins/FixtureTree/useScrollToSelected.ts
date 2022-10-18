import { useEffect, useRef } from 'react';
import { FixtureId } from 'react-cosmos-core/fixture';

export function useScrollToSelected(selectedFixtureId: FixtureId | null) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLElement>(null);

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
