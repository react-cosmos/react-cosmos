// @flow

import createNormalizePropsProxy from 'react-cosmos-normalize-props-proxy';

export default [
  createNormalizePropsProxy({
    notProps: [
      'component',
      'children',
      'state',
      'context',
      'reduxState',
      'myMagicField'
    ]
  })
];
