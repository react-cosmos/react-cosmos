import React from 'react';

type Props = {
  children?: React.ReactNode;
  href: string;
  className?: string;
  style?: {};
  title?: string;
};

export const ExternalLink = ({
  children,
  href,
  className,
  style,
  title,
}: Props) => {
  return (
    <a
      href={href}
      className={className}
      style={style}
      title={title}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
};
