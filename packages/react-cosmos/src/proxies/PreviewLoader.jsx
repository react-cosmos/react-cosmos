import React from 'react';
import omit from 'object.omit';

const PreviewLoader = ({
  fixture,
  onPreviewRef,
}) => React.createElement(fixture.component, {
  // TODO: Redesign fixture to keep props separately from root keys
  ...omit(fixture, ['component', 'state']),
  ref: onPreviewRef,
});

PreviewLoader.propTypes = {
  fixture: React.PropTypes.object.isRequired,
  onPreviewRef: React.PropTypes.func.isRequired,
};

export default PreviewLoader;
