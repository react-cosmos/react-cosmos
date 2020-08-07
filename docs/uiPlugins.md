# An early guide to React Cosmos UI plugins

Please understand the following before continuing:

- The UI plugin API is **subject to change**. The Cosmos UI has been running on this plugin system for about 2 years, but the plugin API hasn't been released to the public yet and, based on your feedback, we might want to improve the API before we make it official.
- This document only covers UI plugins. Server plugins will come later.
- This document only covers a _subset_ of the UI plugin API. It explains how to inject a component in certain parts of the UI, but it doesn't yet cover how to communicate with other existing plugins via direct methods and events – that will also come later.
- The UI plugin system uses two external packages, `react-plugin` and `ui-plugin`. These plugins don't have their own documentation yet. The good part is that for now you only need this document to get going :).
- The long term plan is to make a browsable plugin repository and to install plugins without having to open a terminal or restart your Cosmos dev server. _We're not there yet._ As an early adopter you'll need a bit of a hacker mentality to play with Cosmos plugins at this stage of the process. I appreciate the patience!
- This document is work in progress. I'll keep improving it as feedback rolls in.

## Unlock the plugin list

The first thing you can do to get familiar with the UI plugin system is to enable the toggleable plugin list that's already included in the Cosmos UI, but hidden by default.

> **Make sure you're on `react-cosmos@5.5.0-alpha.10` or newer!**

Load the Cosmos UI in any project, open the browser console and run this command:

```js
ReactPlugin.enablePlugin('pluginList', true);
```

Now select any fixture and open the right-side control panel. You should see the plugin list.

> We'll move the plugin list to a dedicated section before we make it official.

You can get a feel of the plugin system by toggling some of the built-in plugins. The essential plugins cannot be disabled as doing so would break everything. But you can still break the UI if you disable a plugin that other enabled plugins depend on. For example if you disable `fixtureTree` before you disable `fixtureSearch`.

## Check out the example plugin
