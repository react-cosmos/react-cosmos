import React from 'react';

type WindowEnterReturn = [boolean, (el: HTMLElement | null) => void];

export function useWindowEnter(
  options: IntersectionObserverInit
): WindowEnterReturn {
  const [visible, setVisible] = React.useState(false);
  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const ref = React.useCallback(
    (el: HTMLElement | null) => {
      if (el) {
        observerRef.current = new IntersectionObserver(e => {
          const intersectionEntry = e[0];
          if (intersectionEntry) {
            if (intersectionEntry.isIntersecting) {
              setVisible(true);
            } else if (intersectionEntry.boundingClientRect.top > 0) {
              setVisible(false);
            }
          }
        }, options);
        observerRef.current.observe(el);
      } else if (observerRef.current) {
        observerRef.current.disconnect();
      }
    },
    [options]
  );
  return [visible, ref];
}
