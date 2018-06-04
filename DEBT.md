Annoying aspects of the project that _work_ but their solution leaves a lot to be desired. Usually high-hanging fruit, but can also reflect a blind spot of the author so new perspectives are welcome!

## `react-cosmos-flow` package

... is probably a mistake. It's cool that types are centralized in a top-level folder, but publishing them as a regular package doesn't like the right way to share them. As detailed in the [Flow integration section](https://github.com/react-cosmos/react-cosmos/tree/7261ce6ee923abb0926a11b3bd0bfc1716ae2ff4#experimental-flow-integration), special babel-loader configuration is required in order to use Cosmos types in another project.

What's the standard way to share Flow types anyway?

## `web-dev-middleware` warning

> DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead

This warning is caused by an old version of `webpack-dev-middleware`, which Cosmos uses to support webpack versions as old as 1.x. Upgrading WDM would make this warning disappear, but would also break compatibility with webpack <4. Warning aside, everything still seems to work with every webpack version (for now).
