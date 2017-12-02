// @flow

import React from 'react';

type Props = {
  inputRef: (node: ?HTMLElement) => void,
  src: string,
  showResponsiveControls: boolean
};

const ResponsiveLoader = ({ inputRef, src, showResponsiveControls }: Props) => {
  if (!showResponsiveControls) {
    return <iframe ref={inputRef} src={src} />;
  }
  return (
    <div>
      <h1>RESPONSIVE FRAMEWORK</h1>
      <iframe ref={inputRef} src={src} />
    </div>
  );
};

export default ResponsiveLoader;
