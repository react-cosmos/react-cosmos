let itemMocks = {};

module.exports = {
  __setItemMocks: mocks => {
    itemMocks = mocks;
  },
  getItem: jest.fn(itemKey => Promise.resolve(itemMocks[itemKey])),
  setItem: jest.fn(() => Promise.resolve())
};
