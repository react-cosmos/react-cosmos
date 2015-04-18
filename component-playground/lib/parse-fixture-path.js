module.exports = function(fixturePath) {
  // './my-component/my-state.js' => ('my-component', 'my-state')
  return fixturePath.match(/^\.\/(.+)\/(.+)\.js$/);
};
