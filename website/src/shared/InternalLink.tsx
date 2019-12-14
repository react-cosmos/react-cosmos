import React from 'react';

type Props = {
  children?: React.ReactNode;
  style?: {};
  to: string;
  className?: string;
};

const HEADER_HEIGHT = 81;

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
  const availWindowHeight = window.innerHeight - HEADER_HEIGHT;
  const elRect = element.getBoundingClientRect();
  const elScrollTop =
    elRect.top + document.documentElement.scrollTop - HEADER_HEIGHT;

  if (elRect.height >= availWindowHeight) {
    return Math.ceil(elScrollTop);
  }

  const yPadding = (availWindowHeight - elRect.height) / 2;
  return Math.ceil(elScrollTop - yPadding);
}

function scrollTo(top: number) {
  window.scroll({ top, behavior: 'smooth' });
}
