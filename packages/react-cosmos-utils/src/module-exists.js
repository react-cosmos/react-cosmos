export default modulePath => {
  // This is better than fs.existsSync because it works for paths without .js
  // extension
  try {
    return modulePath && require.resolve(modulePath) && true;
  } catch (err) {
    return false;
  }
};
