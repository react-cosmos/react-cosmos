import React from 'react';

type ViewportEnterReturn = [(el: HTMLElement | null) => void, boolean];

export function useViewportEnter(): ViewportEnterReturn {
  const [el, setEl] = React.useState<HTMLElement | null>(null);
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    if (el === null) return () => {};
    const capturedEl = el;

    function updateEntered() {
      const newEntered = hasEnteredViewport(capturedEl.offsetTop);
      if (newEntered !== entered) setEntered(newEntered);
    }

    updateEntered();
    window.addEventListener('scroll', updateEntered);
    return () => window.removeEventListener('scroll', updateEntered);
  }, [el, entered]);

  return [setEl, entered];
}

function hasEnteredViewport(elTop: number) {
  return elTop <= window.pageYOffset + window.innerHeight * 0.66;
}
