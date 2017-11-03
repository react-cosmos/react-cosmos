let itemMocks = {};

module.exports = {
  __setItemMocks: mocks => {
    itemMocks = mocks;
  },
  // localForage never returns undefined, only null.
  // http://localforage.github.io/localForage/#data-api-getitem
  getItem: jest.fn(itemKey =>
    Promise.resolve(
      Object.prototype.hasOwnProperty.call(itemMocks, itemKey)
        ? itemMocks[itemKey]
        : null
    )
  ),
  setItem: jest.fn((itemKey, newValue) => {
    itemMocks[itemKey] = newValue;
    return Promise.resolve(newValue);
  })
};
