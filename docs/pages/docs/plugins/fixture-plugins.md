# Fixture Plugins

While there's no formal way to package renderer plugins (like with server and UI plugins), you can tap into the fixture context to read and write fixture state that is synchronized between the renderer and the Cosmos UI.

The [Viewport](/docs/fixtures/ui-controls.md#viewport) decorator is a good example.

## `FixtureContext`

```jsx
import { FixtureContext } from 'react-cosmos/client';

export default ({ children }) => {
  const { fixtureState, setFixtureState } = React.useContext(FixtureContext);

  // Read or write the fixture state based on user events or other side effects.

  return children;
};
```

- The standard fixture state object contains the `props`, `classState` and `controls` fields. They're used to construct the control panels in the Cosmos UI.
- You can extend the fixture state with extra fields. For example the [Viewport](/docs/fixtures/ui-controls.md#viewport) decorator sets the `fixtureState.viewport` field used by the responsive preview plugin in the Cosmos UI.
- Generally a fixture plugin will pair with a Cosmos UI plugin to syncronize data between the renderer, which runs inside the user's code, and the Cosmos UI.

### `useFixtureState`

You can extend the TypeScript type of the fixture state in a [decorator](/docs/fixtures/decorators) using `useFixtureState`:

```tsx
import { useFixtureState } from 'react-cosmos/client';

type MyFixtureState = {
  mySetting: boolean;
};

export default ({ children }: DecoratorProps) => {
  const { mySetting } = useFixtureState<MyFixtureState>(FixtureContext);

  // Apply custom setting and render children...
};
```
