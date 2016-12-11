import React from 'react';
import createContextProxy from '../../packages/react-cosmos-context-proxy';

module.exports = {
  componentPaths: ['components'],
  proxies: [
    createContextProxy({
      childContextTypes: {
        backgroundColor: React.PropTypes.string.isRequired,
        textColor: React.PropTypes.string.isRequired,
      },
    }),
  ],
  hot: true,
  hmrPlugin: true,
};
