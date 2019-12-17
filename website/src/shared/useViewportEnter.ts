import React from 'react';

type ViewportEnterReturn = [(el: HTMLElement | null) => void, boolean];

export function useViewportEnter(vhThreshhold: number): ViewportEnterReturn {
  const [el, setEl] = React.useState<HTMLElement | null>(null);
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    if (el === null) return () => {};
    const capturedEl = el;

    function updateEntered() {
      const newEntered = hasEnteredViewport(capturedEl.offsetTop, vhThreshhold);
      if (newEntered !== entered) setEntered(newEntered);
    }

    updateEntered();
    window.addEventListener('scroll', updateEntered);
    window.addEventListener('resize', updateEntered);
    return () => {
      window.removeEventListener('scroll', updateEntered);
      window.removeEventListener('resize', updateEntered);
    };
  }, [vhThreshhold, el, entered]);

  return [setEl, entered];
}

function hasEnteredViewport(elTop: number, vhThreshhold: number) {
  return window.pageYOffset > elTop - window.innerHeight * vhThreshhold;
}
