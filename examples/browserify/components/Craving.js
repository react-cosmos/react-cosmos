import PropTypes from 'prop-types';
import React from 'react';

const Craving = ({ food }) => (
  <p>
    I'd like to eat <strong>{food}</strong>!
  </p>
);

Craving.propTypes = {
  food: PropTypes.string.isRequired
};

export default Craving;
