import { loadChild } from './load-child';

module.exports = {
  // eslint-disable-next-line func-name-matching
  loadChild: function loadComponentChild(childName, a, b, c, d, e, f) {
    return loadChild(this, childName, a, b, c, d, e, f);
  },
};
