const React = require('react');
const constants = require('../constants');

require('./SquareBlock.less');

/**
 * Building block for Tetriminos and the grid of the Well, occupying a 1x1
 * square block. The only configurable property square blocks have is their
 * color.
 */
const SquareBlock = ({ color }) => (
  <div
    className="square-block"
    style={{ backgroundColor: color }}
  />
);

SquareBlock.propTypes = {
  color: React.PropTypes.string,
};

SquareBlock.defaultProp = {
  color: constants.COLORS.L,
};

module.exports = SquareBlock;
