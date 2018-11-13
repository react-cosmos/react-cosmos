Q: What's the different between a method and an event in the plugin API?

- Calling a method that doesn't hasn't been registered fails. Emitting an event that nobody's listening to doesn't.
- A method can return a value. An event listener can't.
- Only one handler can be registered for a method name. Multiple listeners can be added for an event name.

---

Q: What's the vision for the plugin UI and the shortcomings in the current implementation?

The vision is for the plugin API to go beyond React. Not because I want to use other renderers, but because not all plugin parts are related to rendering. Here are the main plugin parts:

1. Shared state
2. Public methods
3. Plugin event listeners
4. Other event listeners (eg. on window scroll)
5. Render output

Each plugin handler has access to a _plugin context_. With the plugin context we can read and write shared state, call public methods of other plugins and emit events. All this is possible outside React's context. So _a lot_ of what goes on in a UI plugin doesn't result in visual output (eg. DOM nodes).

The existing UI plugins have already been designed around this architecture, but the current plugin API is not quite _there_ yet. Until I have time to design the _ultimate UI plugin API_, all plugins parts are forced into the React lifecycle. This allowed me to focus on shipping Cosmos and not get completely sidetracked by the plugin API (as exciting as it is).

Notes to remember when iterating on the plugin API:

- Add support for `slotProps` — props that are passed to a UI _slot_ at run time by the slot's parent component

---

Q: Why does Lerna what to publish new versions for packages that haven't changed?

Eg. `lerna changed` returns `react-cosmos-shared`. But `lerna diff react-cosmos-shared` returns null.

So, although the source hadn't changed, [this piece of code](https://github.com/lerna/lerna/blob/ac0baa7b1d5c378f794c960ab13d70242d19ddc8/utils/collect-updates/collect-updates.js#L56-L57) determines that a package _needsBump_. The decision process seems convoluted, but my deduction is that once a package has a pre-release version, it will keep getting bumped until the monorepo enters a regular release cycle.

---

Q: Should fixture state-related tests run against a single fixture or a fixture list (ie. FixtureContainer or FixtureConnect)?

The fixture state's purpose is to serve the remote coordination between the Playground and the renderer. So the tests should run against the API that communicates with remote clients such as the Playground. Actually, `fixtureState` itself shouldn't be the test subject, but the remote messages sent and received.

Moreover, at the moment the fixture state is just a private detail of FixtureContainer (the API used to render fixtures in unit tests).

---

Q: Why does the fixture state duplicate when hot reloading `ComponentState`?

First off, the fixture doesn't unselect (like below) because ComponentState isn't imported by FixtureConnect or any of its imports. So the previous fixture state is kept. And when the new ComponentState type mounts, it will have a new instance ID and create a new fixture state entry, oblivious of the existing state entry initiated by the old ComponentState type.

---

Q: Why does the fixture unselect when hot reloading `CaptureProps`?

Because FixtureConnect (which imports FixtureProvider, which imports CaptureProps) gets hot-reloaded and remounts.

---

Q: Why do components wrapped in `ComponentState` re-render when props of an unrelated component change in the fixture state?

A: Because `ComponentState` also wraps its children in `CaptureProps`, which re-renders whenever any _fixtureState.props_ instance changes.

Fix: ~~Implement deep equality check for fixtureState props/state instance transitions.~~ [Done](https://github.com/react-cosmos/react-cosmos/commit/44bb9cec91dbb8dc4a788fdca50d897d841171e9) and [done](https://github.com/react-cosmos/react-cosmos/commit/126fda74a1e97bbce061443c7ab08f1b8fdc023c).

---

Q: Why does the user webpack build require _babel-polyfill_ on IE 11, but the Playground webpack build doesn't?

Which package relies on (unpolyfilled) Promises?

Answer: `async-until` (addressed in https://github.com/skidding/async-until/pull/3)

Not sure why I was setting `polyfill: false` to `transform-runtime` plugin in every Babel config. I think it only makes sense if you're certain a global polyfill (like _babel-polyfill_) is always imported before the compiled code. Not a good idea for libraries!

Fixed in: https://github.com/react-cosmos/react-cosmos/pull/820

---

Q: How to link fixture state to specific component instances?

Context: A fixture can render more than one component element, which means it can hold state for more than one component instance (of the same type or of different types) at the same time. We need an identifier for each component instance.

Options:

- A. Component type
- B. Component instance (ref)
- C. Component element
- D. Decorator instance (ref)

A. doesn't work because we can have multiple child instances of the same type in one fixture.

B. doesn't work because stateless components don't have instances.

C. doesn't work because AFAIK elements have neither unique reference nor content

D. works well. But different types of fixture state (eg. props and component state) **can't be grouped per component instance**. Each type of fixture state will be identified by the instance of its corresponding decorator. We can't reliably group decorator instances by child type because, as mentioned above, more children of the same type can coexist in a fixture.
