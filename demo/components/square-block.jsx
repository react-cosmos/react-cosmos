/** @jsx React.DOM */

Cosmos.components.SquareBlock = React.createClass({
  /**
   * Building block for Tetriminos, occupying a 1x1 square block. The only
   * configurable property square blocks have is their color.
   */
  getDefaultProps: function() {
    return {
      color: Flatris.COLORS.L
    };
  },
  render: function() {
    return (
      <div className="square-block"
           style={{backgroundColor: this.props.color}}></div>
    );
  }
});
