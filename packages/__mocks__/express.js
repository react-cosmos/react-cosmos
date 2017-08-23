let instanceMock;

const express = jest.fn(() => instanceMock);

express.static = jest.fn();

express.__setInstanceMock = instance => {
  instanceMock = instance;
};

module.exports = express;
