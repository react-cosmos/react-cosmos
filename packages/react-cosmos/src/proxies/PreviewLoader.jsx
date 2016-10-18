import React from 'react';
import omit from 'object.omit';

const PreviewLoader = ({
  fixture,
  onPreviewRef,
}) => React.createElement(fixture.component, {
  // TODO: Redesign fixture to read props from fixture.props (vs from root)
  // https://github.com/skidding/react-cosmos/issues/217
  ...omit(fixture, ['component']),
  ref: onPreviewRef,
});

PreviewLoader.propTypes = {
  fixture: React.PropTypes.object.isRequired,
  onPreviewRef: React.PropTypes.func.isRequired,
};

export default PreviewLoader;
