import React from 'react';

require('./InfoPanel.less');

/**
 * Information panel for the Flatris game/Cosmos demo, shown in between game
 * states.
 */
const InfoPanel = () => (
  <div className="info-panel">
    <p className="large-text">Flatris is demo app for the <a href="https://github.com/skidding/react-cosmos">React Cosmos</a> project.</p>
    <p className="large-text">Inspired by the classic <a href="http://en.wikipedia.org/wiki/Tetris">Tetris</a> game, the game can be played both with a keyboard using the arrow keys, and on mobile devices using the buttons below.</p>
  </div>
);

module.exports = InfoPanel;
