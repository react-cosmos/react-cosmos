> **Note:** The Browserify example only works against the compiled monorepo packages. Follow these steps to make it work
>
> ```bash
> # In monorepo root
> yarn build
> yarn link-entries dist
>
> cd examples/browserify
> yarn start
> ```
