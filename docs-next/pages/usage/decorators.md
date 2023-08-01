# Decorators

Wrapping components in fixtures can become repetitive. Decorators can be used to apply one or more context providers to a group of fixtures automatically.

A `cosmos.decorator` file looks like this:

```jsx
// cosmos.decorator.js
export default ({ children }) => <Provider store={store}>{children}</Provider>;
```

> A decorator only applies to fixture files contained in the decorator's directory. Decorators can be composed, in the order of their position in the file system hierarchy (from outer to inner).

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
