## Invariants and logging

Exceptions are logging in Cosmos are ad-hoc and minimalistic. `throw new Error` and `console.log` calls. While simplicity is nice, it's worth investing in some type of abstractions. Can be a single project or two separate ones. Thoughts to consider:

- Research what other big projects are doing
- Avoid unnecessary features
- Server-side vs client-side (and code that runs in both)
