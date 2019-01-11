// @flow

import React from 'react';

export function RendererPreviewUrlError() {
  // TODO: Style with illustration
  return (
    <>
      <p>Renderer not responding.</p>
      <p>
        1. Please check your terminal for errors. Your build might be broken.
      </p>
      <p>
        2. If you use a custom webpack config, maybe your build isn't generating
        an index.html page.
      </p>
      <a
        href="https://join-react-cosmos.now.sh"
        rel="noopener noreferrer"
        target="_blank"
      >
        Ask for help
      </a>
    </>
  );
}
