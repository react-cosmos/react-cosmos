Annoying aspects of the project that work but their solution leaves a lot to be desired. Usually high-hanging fruit, but can also reflect a blind spot of the author so new perspectives are welcome!

## Invariants and logging

Exceptions are logging in Cosmos are ad-hoc and minimalistic. `throw new Error` and `console.log` calls. While simplicity is nice, it's worth investing in some type of abstractions. Can be a single project or two separate ones. Thoughts to consider:

- Research what other big projects are doing
- Avoid unnecessary features
- Server-side vs client-side (and code that runs in both)

## Pinned dependencies

In general we try to keep all dependencies up to date. The following packages, however, need to be pinned to a specific version:

- `query-string@5.1.1` because 6.x is no longer compatible with IE11.
- `socket.io@2.20` and `socket.io-client@2.20` because [2.3 upgraded to `debug` v4](https://github.com/socketio/socket.io-client/issues/1328#issuecomment-536525472), which is no longer compatible with IE11.
