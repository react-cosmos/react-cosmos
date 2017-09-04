import PropTypes from 'prop-types';
import createContextProxy from 'react-cosmos-context-proxy';

const ContextProxy = createContextProxy({
  childContextTypes: {
    backgroundColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired
  }
});

export default [ContextProxy];
