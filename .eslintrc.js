module.exports = {
  extends: [
    "airbnb"
  ],
  rules: {
    "import/no-extraneous-dependencies": ["error", {"optionalDependencies": true}]
  }
};
