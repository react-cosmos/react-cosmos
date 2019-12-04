import React from 'react';

type ViewportEnterReturn = [(el: HTMLElement | null) => void, boolean];

export function useViewportEnter(): ViewportEnterReturn {
  const [elTop, setElTop] = React.useState<number | null>(null);
  const [entered, setEntered] = React.useState(false);

  const elRef = React.useCallback(el => {
    setElTop(el ? el.offsetTop : null);
  }, []);

  React.useEffect(() => {
    if (elTop === null) return () => {};
    const capturedElTop = elTop;

    function updateEntered() {
      const newEntered = hasEnteredViewport(capturedElTop);
      if (newEntered !== entered) setEntered(newEntered);
    }

    updateEntered();
    window.addEventListener('scroll', updateEntered);
    return () => window.removeEventListener('scroll', updateEntered);
  }, [elTop, entered]);

  return [elRef, entered];
}

function hasEnteredViewport(elTop: number) {
  return elTop <= window.pageYOffset + window.innerHeight * 0.5;
}
