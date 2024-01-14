import React from 'react';

export function useViewportEnter() {
  const [el, setEl] = React.useState<HTMLElement | null>(null);
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    if (el === null) return () => {};

    function updateEntered() {
      const newEntered = hasEnteredViewport(el.offsetTop, el.offsetHeight);
      if (newEntered && !entered) {
        setEntered(true);
      } else if (entered && !newEntered && scrolledToTop()) {
        setEntered(false);
      }
    }

    updateEntered();
    window.addEventListener('scroll', updateEntered);
    window.addEventListener('resize', updateEntered);

    return () => {
      window.removeEventListener('scroll', updateEntered);
      window.removeEventListener('resize', updateEntered);
    };
  }, [el, entered]);

  return [setEl, entered] as const;
}

function hasEnteredViewport(elTop: number, elHeight: number) {
  return window.scrollY > elTop - window.innerHeight + elHeight;
}

function scrolledToTop() {
  return window.scrollY === 0;
}
