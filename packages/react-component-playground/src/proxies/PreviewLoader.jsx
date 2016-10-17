import React from 'react';
import omit from 'object.omit';

const PreviewLoader = ({
  fixture,
  previewRef,
}) => React.createElement(fixture.component, {
  // TODO: Redesign fixture to keep props separately from root keys
  ...omit(fixture, ['component', 'state']),
  ref: previewRef,
});

PreviewLoader.propTypes = {
  fixture: React.PropTypes.object.isRequired,
  previewRef: React.PropTypes.func.isRequired,
};

export default PreviewLoader;
