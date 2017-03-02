import React from 'react';

const Craving = ({ food }) => (
  <p>I'd like to eat <strong>{food}</strong>!</p>
);

Craving.propTypes = {
  food: React.PropTypes.string.isRequired,
};

export default Craving;
