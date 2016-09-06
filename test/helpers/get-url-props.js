import $ from 'jquery';
import { uri } from '../../packages/react-querystring-router';

const { parseLocation } = uri;

module.exports = (element) => {
  const href = $(element).attr('href');

  return parseLocation(href);
};
