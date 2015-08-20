var reactDocs = require('react-docgen'),
    path = require('path'),
    generateMarkdown = require('./generate-markdown');

module.exports = function(source) {
  this.cacheable();

  var ext = path.extname(this.resourcePath);
  if (ext !== '.jsx' && ext !== '.js') {
    return source;
  }

  return generateMarkdown(
    path.basename(this.resourcePath, ext),
    reactDocs.parse(source)
  );
};
