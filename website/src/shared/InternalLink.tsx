import React from 'react';
import { scrollTo } from './scrollTo';

type Props = {
  children?: React.ReactNode;
  to: string;
  className?: string;
  style?: {};
  visualOnly?: boolean;
};

export const InternalLink = ({
  children,
  to,
  className,
  style,
  visualOnly = false
}: Props) => {
  function handleClick(e: React.MouseEvent) {
    const element = getElementByPath(to);
    if (element) {
      e.preventDefault();
      scrollTo(getCenteredElementTop(element));
    } else {
      // Follow link natively
    }
  }

  if (visualOnly) {
    return (
      <a
        href={to}
        className={className}
        onClick={handleClick}
        tabIndex={-1}
        aria-hidden={true}
        style={{ outline: 'none', ...style }}
      >
        {children}
      </a>
    );
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

const headerHeight = 81;

function getCenteredElementTop(element: HTMLElement) {
  const availWindowHeight = window.innerHeight - headerHeight;
  const elRect = element.getBoundingClientRect();
  const elScrollTop = element.offsetTop - headerHeight;

  if (elRect.height >= availWindowHeight) {
    return Math.ceil(elScrollTop);
  }

  const yPadding = (availWindowHeight - elRect.height) / 2;
  return Math.ceil(elScrollTop - yPadding);
}
