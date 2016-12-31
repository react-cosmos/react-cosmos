module.exports = {
  extends: [
    "airbnb"
  ],
  rules: {
    // React Cosmos is designed to work with React >= 0.13 and stateless
    // functions were invented in 0.14
    "react/prefer-stateless-function": 0,
    // Dynamic require is needed in Playground
    "import/no-dynamic-require": 0,
    // Object and Array are forbidden by default too
    "react/forbid-prop-types": [2, { "forbid": [ "any" ] }],
    // Passing children as prop is needed in React Cosmos
    "react/no-children-prop": 0,
    // Defining unused props is required in Proxies
    "react/no-unused-prop-types": 0,
    "jsx-a11y/anchor-has-content": 0
  },
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  }
};
