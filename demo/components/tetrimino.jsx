/** @jsx React.DOM */

Cosmos.components.Tetrimino = React.createClass({
  /**
   * A tetromino is a geometric shape composed of four squares, connected
   * orthogonally. Read more at http://en.wikipedia.org/wiki/Tetromino
   */
  mixins: [Cosmos.mixins.PeristState],
  getDefaultProps: function() {
    return {
      color: 'red'
    };
  },
  getInitialState: function() {
    return {
      matrix: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ]
    };
  },
  render: function() {
    return (
      <ul className="tetrimino">
        {this.renderSquareBlocks()}
      </ul>
    );
  },
  rotate: function() {
    // Function inspired by http://stackoverflow.com/a/2800033/128816
    var matrix = [],
        rows = this.state.matrix.length,
        cols = this.state.matrix[0].length,
        row,
        col;
    for (row = 0; row < rows; row++) {
      matrix[row] = [];
      for (col = 0; col < cols; col++) {
        matrix[row][col] = this.state.matrix[cols-1-col][row];
      }
    }
    this.setState({matrix: matrix});
  },
  renderSquareBlocks: function() {
    var blocks = [],
        rows = this.state.matrix.length,
        cols = this.state.matrix[0].length,
        row,
        col;
    for (row = 0; row < rows; row++) {
      for (col = 0; col < cols; col++) {
        if (this.state.matrix[row][col]) {
          blocks.push(
            <li className="positioned-square-block"
                style={{
                  top: (row * 25) + '%',
                  left: (col * 25) + '%'
                }}>
              <Cosmos component="SquareBlock"
                      color={this.props.color} />
            </li>
          );
        }
      }
    }
    return blocks;
  }
});
