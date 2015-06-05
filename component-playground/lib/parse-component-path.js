module.exports = function(componentPath) {
  // './my-component.js' => ('my-component-name')
  return componentPath.match(/^\.\/(.+)\.jsx?$/);
};
