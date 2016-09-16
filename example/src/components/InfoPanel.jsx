var React = require('react'),
    ComponentTree = require('react-component-tree');

require('./InfoPanel.less');

class InfoPanel extends ComponentTree.Component {
  /**
   * Information panel for the Flatris game/Cosmos demo, shown in between game
   * states.
   */
  render() {
    // jscs:disable maximumLineLength
    return <div className="info-panel">
      <p className="large-text">Flatris is demo app for the <a href="https://github.com/skidding/cosmos">Cosmos</a> project, built using <a href="https://github.com/facebook/react">React</a> components.</p>
      <p>Inspired by the classic <a href="http://en.wikipedia.org/wiki/Tetris">Tetris</a> game, the game can be played both with a keyboard using the arrow keys, and on mobile devices using the buttons below.</p>
      <p>Because <a href="https://github.com/skidding/react-component-tree">ComponentTree</a> can serialize the entire state of an application at any given time, Flatris is able to store your game state into the browser local storage when you close the tab and resume playing whenever you return. Try a hard-refresh in the middle of a game.</p>
      <p className="large-text">Flatris is open source on <a href="https://github.com/skidding/flatris">GitHub.</a></p>
    </div>;
    // jscs:enable maximumLineLength
  }
}

module.exports = InfoPanel;
