# Fixtures

Fixture files contain a default export, which can be a React Component or any React Node.

## Node fixtures

> Think of Node fixtures as the return value of a function component, or the first argument to `React.render`.

```jsx
// Button.fixture.jsx
export default <Button disabled>Click me</Button>;
```

## Component fixtures

Component fixtures are just function components with no props. They enable using Hooks inside fixtures, which is powerful for simulating state with stateless components.

```jsx
// CounterButton.fixture.jsx
export default () => {
  const [count, setCount] = React.useState(0);

  return <CounterButton count={count} increment={() => setCount(count + 1)} />;
};
```

## Multi fixture files

A fixture file can also export multiple fixtures if the default export is an object.

<!-- prettier-ignore -->
```jsx
// Button.fixture.jsx
export default {
  'primary': <PrimaryButton>Click me</PrimaryButton>,

  'primary disabled': <PrimaryButton disabled>Click me</PrimaryButton>,

  'secondary': <SecondaryButton>Click me</SecondaryButton>,

  'secondary disabled': <SecondaryButton disabled>Click me</SecondaryButton>,
};
```

The object property names will show up as fixture names in the Cosmos UI.

> [See this comment](https://github.com/react-cosmos/react-cosmos/issues/924#issuecomment-462082405) for the reasoning behind this solution (vs named exports).

## File conventions

Two options:

1. End fixture file names with `.fixture.{js,jsx,ts,tsx}`.
2. Put fixture files inside `__fixtures__`.

Examples:

1. `blankState.fixture.jsx`
2. `__fixtures__/blankState.jsx`

> File name conventions can be configured using the `fixturesDir` and `fixtureFileSuffix` options.

The file paths of your fixture files (relative to your project root) are used to create a tree view explorer in the React Cosmos UI.

## Fixture controls

A props panel is created automatically for [Node fixtures](#node-fixtures) in the Cosmos UI. This enables you to tweek component props and see the result in real time, without any configuration.

You can also get a custom control panel by manually defining the UI controls in your fixtures.

### `useValue`

```jsx
// CounterButton.fixture.jsx
import { useValue } from 'react-cosmos/client';

export default () => {
  const [count, setCount] = useValue('count', { defaultValue: 0 });

  return <CounterButton count={count} increment={() => setCount(count + 1)} />;
};
```

### `useSelect`

```jsx
// Button.fixture.jsx
import { useSelect } from 'react-cosmos/client';

export default () => {
  // useSelect also returns a setter as the second value in the return tuple,
  // like the useState hook, in case you want to change the value programatically.
  const [buttonType] = useSelect('buttonType', {
    options: ['primary', 'secondary', 'danger'],
  });

  return <Button type={buttonType}>Press me</Button>;
};
```

> **Note** `useValue` and `useSelect` (and Cosmos in general) work great with TypeScript.

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
