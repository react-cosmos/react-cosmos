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
    "react/forbid-prop-types": [2, { "forbid": [ "any" ] }]
  },
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  }
};
