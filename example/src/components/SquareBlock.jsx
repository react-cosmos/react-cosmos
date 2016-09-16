var React = require('react'),
    ComponentTree = require('react-component-tree'),
    constants = require('../constants.js');

require('./SquareBlock.less');

class SquareBlock extends ComponentTree.Component {
  /**
   * Building block for Tetriminos and the grid of the Well, occupying a 1x1
   * square block. The only configurable property square blocks have is their
   * color.
   */
  render() {
    return <div className="square-block"
                style={{backgroundColor: this.props.color}}></div>;
  }
}

SquareBlock.defaultProp = {
  color: constants.COLORS.L
};

module.exports = SquareBlock;
