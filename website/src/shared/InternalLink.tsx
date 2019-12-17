import React from 'react';
import { scrollToElement } from './scrollToElement';

type Props = {
  children?: React.ReactNode;
  style?: {};
  to: string;
  className?: string;
};

export const InternalLink = ({ children, to, className, style }: Props) => {
  function handleClick(e: React.MouseEvent) {
    const element = getElementByPath(to);
    if (element) {
      e.preventDefault();
      scrollToElement(element);
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
