# Welcome to future of React Cosmos!

_Cosmos Next_ is available for beta testers! 🎉

**Install `react-cosmos` to get started.**

> The [jsx-fixtures](examples/jsx-fixtures) example is a useful complement to this guide.

![Cosmos Next](next.png)

## Config

Add `next: true` to your existing Cosmos config (or to an empty config file). This will run Cosmos Next.

```js
// cosmos.config.js
module.exports = {
  next: true
  // ...other Cosmos options
};
```

### Hybrid setup (for existing Cosmos users)

Old fixtures don't work with Cosmos Next (at least for now), and JSX fixtures don't work with the old Cosmos setup. But this doesn't mean you have to upgrade at once. You can create two Cosmos configs with different ports to keep your existing Cosmos setup as you experiment with Cosmos Next.

```js
// cosmos-next.config.js
const cosmosConfig = require('./cosmos.config');

module.exports = {
  ...cosmosConfig,
  next: true,
  port: 9999
};
```

Finally, you can create different package.json scripts to target each Cosmos config separately:

```
"cosmos": "cosmos --config cosmos.config.js",
"cosmos:next": "cosmos --config cosmos-next.config.js"
```

## JSX fixtures

Cosmos Next introduces a more natural format for component fixtures: **React elements.**

> Think of JSX fixtures as the return value of a render function, or the first argument to `React.render`.

```jsx
// __fixtures__/disabled.js
export default <Button disabled>Click me</Button>;
```

The JSX fixture format has a few advantages compared to the old format:

- Fixtures are no longer bound to a single component
- Adding one or more component wrappers per fixture is easy
- Fixtures can be copy pasted inside the project source code
- Props are easier to type-check
- Writing fixtures doesn't feel like writing code for Cosmos

The JSX fixture format also comes with a minor drawback: `React` must be imported in every fixture file.

## How to create fixture files

Two options:

1. End fixture file names with `.fixture.{js,jsx,ts,tsx}`
2. Put fixture files inside `__fixtures__`

Examples:

1. `blankState.fixture.js`
2. `__fixtures__/blankState.js`

> In the beta testing period the file name convention is fixed to allow old and _next_ Cosmos setups to coexist. In the future it will be configurable.

## Multi fixture files

A fixture file can also export multiple fixtures if the default export is an object.

```jsx
// buttons.fixture.js
export default {
  primary: <PrimaryButton>Click me</PrimaryButton>,
  primaryDisabled: <PrimaryButton disabled>Click me</PrimaryButton>,
  secondary: <SecondaryButton>Click me</SecondaryButton>,
  secondaryDisabled: <SecondaryButton disabled>Click me</SecondaryButton>
};
```

The object property names will show up as fixture names in the Cosmos UI.

## Decorators

Wrapping components inside fixtures is now easy, but can become repetitive. _Decorators_ can be used to apply one or more component wrappers to a group of fixtures automatically.

A `cosmos.decorator` file looks like this:

```jsx
// cosmos.decorator.js
export default ({ children }) => <Provider store={store}>{children}</Provider>;
```

> A decorator file only applies to fixture files that are contained in the decorator file's directory. Multiple decorator files can be composed, in the order of their position in the file system hierarchy (from outer to inner).

### Redux state mock

Check out [react-cosmos-redux](https://github.com/skidding/react-cosmos-redux) to see what a Cosmos Next decorator looks like. It works with the latest `react-redux` version and it's written in _hooks_ 💃.

## UI plugins

A main feature of the Cosmos Next redesign is the brand-new UI plugin architecture. While the new UI is created 100% from plugins, the plugin API is not yet documented. This is the next step.

While we get feedback for the new JSX fixtures and decorators, I will continue to add feature parity with the old Cosmos UI and gradually release the powerful plugin API for mass consumption. Exciting things ahead!

---

**Thanks for taking the time to try out the Cosmos Next preview! 🙏**

For feedback [create a GitHub issue](https://github.com/react-cosmos/react-cosmos/issues/new), [start a Spectrum thread](https://spectrum.chat/cosmos) or [go on Slack](https://join-react-cosmos.now.sh/).
