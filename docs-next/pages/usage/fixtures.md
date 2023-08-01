# Fixtures

Fixture files contain a default export, which can be a React Component or any React Node.

## Node Fixtures

> Think of Node fixtures as the return value of a function component, or the first argument to `React.render`.

```jsx
// Button.fixture.jsx
export default <Button disabled>Click me</Button>;
```

## Component Fixtures

Component fixtures are just React function components with no props. They enable using Hooks inside fixtures, which is powerful for simulating state with stateless components.

```jsx
// CounterButton.fixture.jsx
export default () => {
  const [count, setCount] = React.useState(0);

  return <CounterButton count={count} increment={() => setCount(count + 1)} />;
};
```

## Multi-Fixtures

A fixture module can also export multiple fixtures if the default export is an object.

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

## MDX Fixtures

Creating MDX fixtures is as easy as [configuring MDX for your bundler](https://mdxjs.com/docs/getting-started/#bundler) and using the `.mdx` (or `.md`) file extension for your fixture files.

> Both Vite and Webpack [examples](../../examples) feature MDX fixtures configured with `@mdx-js/rollup` and `@mdx-js/loader` respectively.

## File Conventions

Two options:

1. End fixture file names with `.fixture.{js,jsx,ts,tsx,md,mdx}`.
2. Put fixture files inside `__fixtures__`.

Examples:

1. `blankState.fixture.jsx`
2. `__fixtures__/blankState.jsx`

The file paths of your fixture files (relative to your project root) are used to create a tree view explorer in the React Cosmos UI.

### Configuration

| Option              | Description                                                                       | Default          |
| ------------------- | --------------------------------------------------------------------------------- | ---------------- |
| `fixturesDir`       | Name for directories that contain fixture files (eg. `__fixtures__/example.jsx`). | `"__fixtures__"` |
| `fixtureFileSuffix` | Suffix for fixture files (eg. `example.fixture.jsx`).                             | `"fixture"`      |
| `ignore`            | Patterns for ignoring fixture and decorator files (eg. `["**/dist/**"]`).         |                  |

## UI controls

Props controls are created automatically for [Node fixtures](#node-fixtures) in the Cosmos UI. This enables you to tweek component props and see the result in real time, without any configuration.

You can also create custom controls in the [Control Panel](user-interface.md#control-panel) by manually defining them in your fixtures.

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

### `<Viewport>`

By using the Viewport decorator a fixture can trigger the responsive preview in the Cosmos UI on a specific resolution.

```jsx
import { Viewport } from 'react-cosmos/client';

export default (
  <Viewport width={375} height={667}>
    <MyComponent />
  </Viewport>
);
```

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
