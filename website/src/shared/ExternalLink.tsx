import React from 'react';

type Props = {
  children?: React.ReactNode;
  style?: {};
  href: string;
  className?: string;
};

export const ExternalLink = ({ children, href, className, style }: Props) => {
  return (
    <a
      href={href}
      className={className}
      style={style}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
};
