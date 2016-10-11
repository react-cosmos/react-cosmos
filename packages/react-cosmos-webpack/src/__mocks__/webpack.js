const webpack = {
  __setPluginMock: (pluginName, plugin) => {
    webpack[pluginName] = plugin;
  },
};

module.exports = webpack;
