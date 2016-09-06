module.exports = {
  get(option) {
    let stringifiedValue;

    try {
      stringifiedValue = localStorage.getItem(option);
    } catch (e) {
      stringifiedValue = null;
    }

    try {
      return JSON.parse(stringifiedValue);
    } catch (e) {
      return null;
    }
  },

  set(option, value) {
    try {
      return localStorage.setItem(option, JSON.stringify(value));
    } catch (e) {
      return null;
    }
  },
};
