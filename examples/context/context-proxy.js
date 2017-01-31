import React from 'react';
import createContextProxy from '../../packages/react-cosmos-context-proxy';

export default () => {
  return createContextProxy({
    childContextTypes: {
      backgroundColor: React.PropTypes.string.isRequired,
      textColor: React.PropTypes.string.isRequired,
    },
  });
};
