import React from 'react';
import { createPlugin } from 'react-plugin';
import { WebpackRendererErrorSpec } from './WebpackRendererErrorSpec';

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
