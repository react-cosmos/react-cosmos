If your projects directory tree looks like this:

```
projectName
│
└─── node_modules
│   │
│   └─── ...
│   
└─── src
│   │
│   └─── node_modules
│   │   │
│   │   └─── @subproject1
│   │   │   │
│   │   │   └─── ...
│   │   │
│   │   └─── @subproject2
│   │   │   │
│   │   │   └─── ...
...
```

And you need react-cosmos to track files under your own `projectName/src/node_modules` directory but keep ignore `projectName/node_modules`, you may benefit from redefining `fileMatchIgnore`:

```
'**/projectName/node_modules/**'
```

That way react-cosmos will ignore only `projectName/node_modules`.
