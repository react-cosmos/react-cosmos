import React from 'react';
import { createPlugin } from 'react-plugin';
import { WebpackRendererErrorSpec } from './WebpackRendererErrorSpec.js';

// Delete this UI plugin because it isn't doing anything?
// How could a renderer error surface it this index.html is missing...?
const { register, plug } = createPlugin<WebpackRendererErrorSpec>({
  name: 'webpackRendererError',
});

plug('rendererError', () => {
  return (
    <>
      If you use a custom webpack config,{' '}
      <strong>
        make sure
        <br />
        your build is generating an index.html page.
      </strong>
    </>
  );
});

export { register };

if (process.env.NODE_ENV !== 'test') register();
