import PropTypes from 'prop-types';
import createContextProxy from 'react-cosmos-context-proxy';

export default () => {
  return createContextProxy({
    childContextTypes: {
      backgroundColor: PropTypes.string.isRequired,
      textColor: PropTypes.string.isRequired,
    },
  });
};
