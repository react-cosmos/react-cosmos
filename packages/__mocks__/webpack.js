let compilerMocks;

const Webpack = jest.fn(() => compilerMocks.shift());

Webpack.__setCompilerMocks = (compilers) => {
  compilerMocks = compilers;
};
Webpack.__setPluginMock = (pluginName, plugin) => {
  Webpack[pluginName] = plugin;
};

module.exports = Webpack;
