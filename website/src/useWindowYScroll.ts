import React from 'react';

export function useWindowYScroll() {
  const [yScroll, setYScroll] = React.useState(window.pageYOffset);
  React.useEffect(() => {
    setYScroll(window.pageYOffset);
    function handleScroll() {
      setYScroll(window.pageYOffset);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return yScroll;
}
