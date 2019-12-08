import React from 'react';

type Props = {
  children?: React.ReactNode;
  style?: {};
  to: string;
  className?: string;
};

export const InternalLink = ({ children, to, className, style }: Props) => {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (to === '/') {
      scrollTo(0);
    } else if (to.indexOf('/') === 0) {
      const id = to.substr(1);
      const element = document.getElementById(id);
      if (element) scrollTo(getElementTop(element));
    }
  }

  return (
    <a href={to} className={className} style={style} onClick={handleClick}>
      {children}
    </a>
  );
};

function getElementTop(element: HTMLElement) {
  return Math.ceil(
    element.getBoundingClientRect().top + document.documentElement.scrollTop
  );
}

function scrollTo(top: number) {
  window.scroll({ top, behavior: 'smooth' });
}
