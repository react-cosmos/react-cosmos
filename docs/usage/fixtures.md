# Fixtures

Fixture files contain a default export, which can be a React Component or any React Node.

> `React` must be imported in every fixture file.

The file paths of your fixture files (relative to your project root) are used to create a tree view explorer in the React Cosmos UI.

### Node fixtures

> Think of Node fixtures as the return value of a function component, or the first argument to `React.render`.

```jsx
// Button.fixture.jsx
export default <Button disabled>Click me</Button>;
```

### Component fixtures

Component fixtures are just function components with no props. They enable using Hooks inside fixtures, which is powerful for simulating state with stateless components.

```jsx
// CounterButton.fixture.jsx
export default () => {
  const [count, setCount] = React.useState(0);
  return <CounterButton count={count} increment={() => setCount(count + 1)} />;
};
```

### Multi fixture files

A fixture file can also export multiple fixtures if the default export is an object.

```jsx
// Button.fixture.jsx
export default {
  primary: <PrimaryButton>Click me</PrimaryButton>,
  primaryDisabled: <PrimaryButton disabled>Click me</PrimaryButton>,
  secondary: <SecondaryButton>Click me</SecondaryButton>,
  secondaryDisabled: <SecondaryButton disabled>Click me</SecondaryButton>,
};
```

The object property names will show up as fixture names in the Cosmos UI.

> [See this comment](https://github.com/react-cosmos/react-cosmos/issues/924#issuecomment-462082405) for the reasoning behind this solution (vs named exports).

### How to create fixture files

Two options:

1. End fixture file names with `.fixture.{js,jsx,ts,tsx}`
2. Put fixture files inside `__fixtures__`

Examples:

1. `blankState.fixture.jsx`
2. `__fixtures__/blankState.jsx`

> File name conventions can be configured using the `fixturesDir` and `fixtureFileSuffix` options.

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
