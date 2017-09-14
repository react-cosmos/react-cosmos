const React = require('react');

module.exports = {
  ApolloClient: jest.fn(),
  ApolloProvider: ({ children }) =>
    <div>
      {children}
    </div>
};
