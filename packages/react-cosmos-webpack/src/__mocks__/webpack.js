let compilerMock;

const Webpack = jest.fn(() => compilerMock);

Webpack.__setCompilerMock = (compiler) => {
  compilerMock = compiler;
};
Webpack.__setPluginMock = (pluginName, plugin) => {
  Webpack[pluginName] = plugin;
};

module.exports = Webpack;
