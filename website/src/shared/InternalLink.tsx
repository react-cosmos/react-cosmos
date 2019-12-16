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
  if (path === '/') return document.getElementById('splash-screen');
  if (path.indexOf('/') === 0) return document.getElementById(path.substr(1));
  return null;
}

// https://stackoverflow.com/questions/52276194/window-scrollto-with-options-not-working-on-microsoft-edge
const supportsNativeSmoothScroll =
  'scrollBehavior' in document.documentElement.style;

function getElementTop(element: HTMLElement) {
  const availWindowHeight = window.innerHeight - HEADER_HEIGHT;
  const elRect = element.getBoundingClientRect();
  const elScrollTop = elRect.top + pageYOffset - HEADER_HEIGHT;

  if (elRect.height >= availWindowHeight) {
    return Math.ceil(elScrollTop);
  }

  const yPadding = (availWindowHeight - elRect.height) / 2;
  return Math.ceil(elScrollTop - yPadding);
}

function scrollTo(top: number) {
  if (supportsNativeSmoothScroll) {
    window.scrollTo({ top, behavior: 'smooth' });
  } else {
    window.scroll(0, top);
  }
}
