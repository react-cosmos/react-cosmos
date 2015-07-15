module.exports = function(componentPath) {
  // './component-group/my-component.jsx' => ('my-component-name')
  // './my-component.js' => ('my-component-name')
  var parts = componentPath.match(/^\.\/(.*\/)?(.+)\.jsx?$/);
  return parts[parts.length - 1];
};
