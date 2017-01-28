module.exports = {
  get(option) {
    let stringifiedValue;

    try {
      stringifiedValue = localStorage.getItem(option);
    } catch (err) {
      stringifiedValue = null;
    }

    try {
      return JSON.parse(stringifiedValue);
    } catch (err) {
      return null;
    }
  },

  set(option, value) {
    try {
      return localStorage.setItem(option, JSON.stringify(value));
    } catch (err) {
      return null;
    }
  },
};
