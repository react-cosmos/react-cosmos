# Fixture plugins

While there's no formal way to package renderer plugins (like with server and UI plugins), you can tap into the fixture context to read and write fixture state that is synchronized between the renderer and the Cosmos UI.

The [Viewport](../usage/fixtures.md#viewport) decorator is a good example.

## `FixtureContext`

```jsx
export function MagicDecorator({ children, width, height }) {
  const { fixtureState, setFixtureState } = React.useContext(FixtureContext);

  // Read or write the fixture state based on user events or other side effects.

  return children;
}
```

- The fixture state object has `props`, `classState` and `controls` fields. They are used to construct the Props, Class State and Control panels in the Cosmos UI.
- You can extend the fixture state with extra fields. Like [Viewport](../usage/fixtures.md#viewport) does with the `viewport` field, which is read by the responsive preview plugin in the Cosmos UI.
- Generally a fixture plugin will pair with a Cosmos UI plugin to syncronize data between the renderer, which runs inside the user's code, and the Cosmos UI.

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
