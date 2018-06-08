If your projects directory tree look similar to this:
```
projectFolder
│
└─── configFiles
│   │
│   └─── react-cosmos
│       │
│       └─── cosmos.config.js
│       │
│       └─── cosmos.proxies.js
│   
└─── src
│   │
│   └─── ...
...
```
And you want to hold your `cosmos.proxies.js` outside of root directory you need to define `proxiesPath` in `cosmos.config.js` relatively to `rootPath`.
```js
module.exports = {
    rootPath: '../../src/',
    proxiesPath: '../../config/react-cosmos/cosmos.proxies',
}
```
Then proxies path will be resolved like `path.join(rootPath, proxiesPath)`, so you can skip placing `cosmos.proxies.js` in src directory and instead keep it near config.