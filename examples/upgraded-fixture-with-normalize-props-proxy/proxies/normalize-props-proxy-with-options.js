import createNormalizePropsProxy from '../../../packages/react-cosmos-normalize-props-proxy';

export default () =>
  createNormalizePropsProxy({
    notProps: ['children', 'state', 'context', 'reduxState', 'myMagicField']
  });
