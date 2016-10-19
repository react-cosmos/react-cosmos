module.exports = {
  extends: [
    "airbnb"
  ],
  rules: {
    // React Cosmos is designed to work with React >= 0.13 and stateless
    // functions were invented in 0.14
    "react/prefer-stateless-function": 0
  },
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  }
};
