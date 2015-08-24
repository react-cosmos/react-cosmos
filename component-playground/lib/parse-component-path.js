module.exports = function(componentPath) {
  // './component-group/my-component.jsx' => ('component-group/my-component')
  // './my-component.js' => ('my-component')
  return componentPath.match(/^\.\/(.+)\.jsx?$/);
};
