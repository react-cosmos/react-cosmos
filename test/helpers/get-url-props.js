let $ = require('jquery'),
  parseLocation = require('../../packages/react-querystring-router').uri.parseLocation;

module.exports = function (element) {
  const href = $(element).attr('href');

  return parseLocation(href);
};
