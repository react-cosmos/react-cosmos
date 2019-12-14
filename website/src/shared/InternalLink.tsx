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
    const element = getElementByPath(to);
    if (element) {
      e.preventDefault();
      scrollTo(getElementTop(element));
    } else {
      // Follow link natively
    }
  }

  return (
    <a href={to} className={className} style={style} onClick={handleClick}>
      {children}
    </a>
  );
};

function getElementByPath(path: string) {
  if (path === '/') return document.getElementById('index');
  if (path.indexOf('/') === 0) return document.getElementById(path.substr(1));
  return null;
}

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
