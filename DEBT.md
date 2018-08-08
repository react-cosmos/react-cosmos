Annoying aspects of the project that _work_ but their solution leaves a lot to be desired. Usually high-hanging fruit, but can also reflect a blind spot of the author so new perspectives are welcome!

## `web-dev-middleware` warning

> DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead

This warning is caused by an old version of `webpack-dev-middleware`, which Cosmos uses to support webpack versions as old as 1.x. Upgrading WDM would make this warning disappear, but would also break compatibility with webpack <4. Warning aside, everything still seems to work with every webpack version (for now).
