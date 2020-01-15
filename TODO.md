# Roadmap: React Cosmos 2020

## RFCs repo

Mixing bugs with feature ideas leads a bad maintainer experience. Bugs and features have a different lifecycle and require a different mindset. Moreover, it's hard to reach "inbox zero" for issues with long-standing feature issues in the mix.

For some, managing bugs is the hard part of being an open source maintainer. Over time, however, I realized that feature ideas have a higher cognitive load. The decisition tree for a bug is clear: Can it be reproduced? Is the requested behavior expected? If both are true, you try to find the source of the problem and come up with a fix. Feature ideas are more fuzzy. You need to assess whether a feature aligns with the project's mission, and even when it does, if it matches the project's priorities enough to pause and meaninfully engage with the proposal.

The RFCs repo allows feature ideas to be proposed and addressed properly, while keeping the issues list nice and clean. It will allow me and other maintainers to process issues with priority, without neglecting novel ideas from the community, which on the long run are invaluable.

Finally, we have an `#ideas` channel on [Slack](https://join-react-cosmos.now.sh/) for bouncing around ideas without formality.

- [x] Create react-cosmos/rfcs repo
  - [x] Research templates and practices from other repos like reactjs/rfcs
- [x] Move feature idea issues to RFCs repo
- [x] Update CONTRIBUTING.md
- [x] Update GitHub labels
- [x] Update GitHub issue templates

## Website enhancements

- [x] Auto deploy on merge
- [x] Redesign header
  - [x] Include version number with link to releases
- [x] Embed Cosmos instance on desktop
  - [x] Add multiple screenshots on mobile
- [ ] Docs
  - [x] Separate docs from root README
  - [ ] Low priority: Create dedicated website
    - [ ] MD-powered, auto-generated from docs/ directory
    - [ ] Sticky side nav
    - [ ] SSG

## Parcel support

It's highly probable that a Parcel integration is a low hanging fruit, but some research is required to be sure.

- [ ] Research Parcel integration (preferably as Express middleware attached to Cosmos server)

## Responsive mode improvements

- [ ] Update default devices
- [ ] X/y drag handles to resize viewport

## Input panel improvements

- [ ] Support decimals in number input
- [ ] Range input
- [ ] Select input (dropdown with pre-defined options)
- [ ] Auto save toggle for props panel

## Expose plugin APIs

There are three types of plugins in React Cosmos. Exposing all three won't be easy, but it's important to make progress before adding more functionality.

- **Fixture plugins**. Fixture _decorators_ are a basic example of fixture plugins. More functionality can be added to decorators by using the FixtureContext. This is already possible, but isn't documented, and the API likely requires improvement before doing so. This type of plugin runs in user land and is thus compiled using the user's build pipeline.
- **UI plugins**. The React Cosmos UI is currently composed from plugins, using an unreleased but independent plugin system. The way UI plugins interact is designed, but the way they are installed isn't. UI plugins have to be installed at runtime. This requires a plugin discovery system and a plugin definition format to be indentified by. Once these requirements are in place a user will be able to install an npm package with one or more React Cosmos plugins, and enable those plugins without having to restart the server or even reload the UI.
- **Server plugins**. Same as UI plugins with regards to installation and the fact that the existing code is already organized around plugins. But the APIs are completely different for server plugins because they mainly revolve around an Express instance and its corresponding HTTP server.

## Multi selected fixtures

There are (at least) two possible solutions:

1. Allow selection of two or more fixtures in the current Cosmos UI (the _Playground_), and show multiple renderer iframes in a grid or a horizontal list in the center area of the layout.
2. A brand new page where all fixtures are rendered one under another, with a search input at the top and possibly other fixture filters.

Experimentation is required to determine the best form. Also something to consider is rendering the same fixture more than once under different screen sizes, similar to [Playroom](https://github.com/seek-oss/playroom). This is a "responsive" feature, but it also involves handling multiple renderer iframes on the same page so it's good to keep in mind while working on multi fixture functionality.

## Misc

- [ ] Experiment with [jest-specific-snapshot](https://github.com/igor-dv/jest-specific-snapshot) to create one snapshot file per each fixture
- [ ] Experiment with lazy loading fixtures
- [ ] Experiment with ES6 modules (React Cosmos with no bundler and no compiler)

## Interesting but not a priority (for now)

These are good ideas that come up often but are more distant to the core React Cosmos mission than the functionality mentioned above. It's still good to explore these ideas for when the time is right, but it's also important to understand that these ideas will be treated with little priority and most likely are content for a future roadmap.

- **Component docs**. Showing some component documentation when opening a fixture is indeed useful, and a number of solutions have already been implemented by the community using fixture decorators. A better solution, however, would be to show the docs in a pane outside the renderer iframe. This is a great candidate for a UI plugins, which is why no official solution will be released before an official UI plugin API.
- **MDX fixtures**. Can be different fixture format (.mdx fixture files), or a separate type of page that can reference fixtures inside. This is a promising idea, but it's unclear where it fits in the UI developer's workflow. _Is it strictly a documentation feature? Should it be a type of fixture or something on top of fixtures?_

# Roadmap: Cosmos 5

> **Dec 29, 2019:** It took time, but React Cosmos 5 is released, together with a shinny new website 🎉. With 2020 right around the corner, it's time to take a step back, reflect, and lay down a plan for the future.

Cosmos Next becomes _Cosmos_. The included features are meant to exceed everything Cosmos Classic offered and make use of the powerful new Cosmos platform.

Alpha

- [x] Function fixtures
- [x] Notifications redesign
  - [x] Build notification [#522](https://github.com/react-cosmos/react-cosmos/issues/522)
  - [x] ~~Try: Notifications for fixture create/remove/rename~~ Too much info to display inside a notification
- [x] Control panel
- [x] Fixture search
  - [x] Minimize left nav
- [x] Official React Native integration
  - [x] NativeFixtureLoader facade
  - [x] Hybrid Cosmos: Mirror dom and native renderers
- [x] Resize responsive viewport
  - [x] Put viewports in dropdown
  - [x] Make width/height inputs
- [x] UI controls from state hooks
- [x] Server side APIs
  - [x] Get Playground URLs for each fixture (for visual snapshotting)
  - [x] Get fixture elements (for JSON snapshotting)
- [x] Refresh docs
  - [x] Publish demo

Beta

- [ ] Migration aids (eg. code transforms and support)

> Plugin APIs will be released later, under minor versions.

Control panel

- [x] Redesign fixture state values (into recursive union types)
- [x] Reusable TreeView
- [x] Props panel
  - [x] Resizable control panel
  - [x] Reset all fixture state values
    - [x] Store initial values
  - [x] Store value tree expansion state
  - [x] Option to reset or transition props
  - Inputs
    - [x] Text value
    - [x] Number value
      - [ ] Support decimals
    - [x] Boolean value
    - [x] Null value
  - [x] Style
  - [x] Blank state
- [x] Class state panel
- [ ] UI controls from state hooks
  - [x] State hook for primitive, object and array values
  - [ ] Select state hook with predefined options

Build notifications

- [x] Fix catching of module-level exceptions
- [x] Design build notification types
- [x] Create sticky notifications
- [x] Send build messages from server to Playground
  - [x] Integrate with webpack server-side hooks
- [x] HMR fail notification

Notification redesign

- [x] Make all notifications dissapear at once
- [x] Move notifications _slot_ to inside the preview area
- [x] Redesign notification look and allow for more information
- [x] Allow clients to specific notification ID to avoid duplicating a message
- [x] Transition notifications when they appear

`react-plugin` enhancements

- [x] Simplify plug API (instead of getProps, the component gets the plugin context API as props)
- [x] Plug API for Slot arrays
- [x] Sort API for ArraySlot

## Backlog

Not part of v5, but the most notable features to pursue after.

- [ ] `useSelect` hook for UI controls with predefined options
- [ ] Multi fixture select
- [ ] Marketing website
- [ ] "Check all" button/API to detect broken fixtures
- [ ] UI-generated fixtures
- [ ] VSCode extension (simpler UI without nav but with control panel)
- [ ] Command API with search
- [ ] Keyboard shortcuts
- [ ] Pin fixture

# Roadmap: Cosmos Next

> **May 6, 2019:** JSX fixtures have been well received and already adopted by some, even though they're released under an early alpha version. The new UI has slowly evolved and will soon outgrow Cosmos Classic. Lots of exciting ideas in the pipeline for the new Cosmos platform, some including the latest addition to React: Hooks. Old packages have been moved to [a dedicated repo](http://github.com/react-cosmos/react-cosmos-classic) and the Cosmos repo is now 100% fresh TypeScript code. Cosmos Next is here to stay, time to focus on a public release!

The innovations included in the next generation of Cosmos have already been designed, tested and implemented for the most part. This roadmap will put the the all-new **JSX fixtures** and **Pluggable UI** into the user's hands.

The aim for _Cosmos Next_ is to provide ~80% parity with Cosmos 4.x along with brand new features. The upgrade will be **opt-in** and there will be a exhaustive beta phase before a transition plan is devised for the stable channel.

## Step 1: Port UI to plugin architecture

> Note: The development of JSX fixtures is coupled to the new Pluggable UI. JSX fixtures use a new communication protocol that only the new UI understands and vice-versa. So they both need to be released at the same time. This was a risky engineering endeavor, but it allowed leapfrogging intermediate development steps.

We need a decent parity with the existing Cosmos UI to test JSX fixtures. This is the main requirement for releasing Cosmos Next for beta testing.

- [x] Establish testing practices for new UI package
- [x] Create router for new UI
- [x] MVP feature set for new UI
  - [x] Full screen mode
    - [x] Remove renderer full screen mode (renderer URL belongs to user)
  - [x] Remote renderer (WebSockets)
    - [x] Enable remote renderer(s) on web
    - [x] Sync fixture state between renderers (this wasn't required at this step but is _so_ cool)
  - [x] Collapsable fixture tree view
    - [x] Persist state
  - [x] Responsive mode
  - [x] Style
    - [x] Fixture blank state
    - [x] Fixture error state
  - [x] JSX decorators
  - [x] Renderer error handling
    - [x] Renderer preview URL error
    - [x] react-error-overlay integration
      - [x] Always show preview iframe after error occurred
      - [x] Dismiss overlay when changing fixture

**Not** included in the first beta release: The Fixture Editor. This is because it'll be replaced by something _much_ more powerful (a new Control Panel). But this section will have arrive later, after the core of Cosmos Next has been thoroughly tested.

## Step 2: Get feedback on JSX fixtures

- [x] "How to use" document for beta testers
- [x] Release 4.7
  - [x] Blog post

## Next Steps

- [ ] Basic Control Panel (props/state visualization and editing)
- [ ] More Control Panel features
  - [ ] General purpose UI controls mapped to render props
  - [ ] Option to reset or transition props (it currently does former)
  - [ ] Capture state from Hooks
- [x] Multiple fixtures per file
  - [x] Named exports
  - [x] Dynamically generated n-fixtures
- [ ] UI-generated fixture variations
- [ ] Refine and document UI plugin API
  - [ ] Avoid superfluous React updates on plugin state change
- [ ] Redesign Cosmos docs

# Roadmap: Summer of Cosmos

> **Oct 29, 2018:** This was a long and fruitful summer for Cosmos. Time to draw a line and draft a new roadmap.

- [React Native integration](#react-native-integration)
- [Pluggable UI](#pluggable-ui)
- [Explore: JSX fixtures](#explore-jsx-fixtures)
- [UI control panel](#ui-control-panel)
- Redesign docs

## Explore: JSX fixtures

- [ ] Create new declarative renderer: FixtureProvider
  - [x] Context API reading and updating fixture state
  - [x] Handle unserializable fixture state
  - [ ] Core decorators
    - [x] Capture props
    - [x] Capture state
    - [ ] Catch errors
    - [ ] Customize fixture name
    - [ ] New decorator API
  - [x] Remote protocol
    - [x] Define renderer message types
    - [x] window.postMessage
    - [x] WebSockets
  - [ ] Testing API
- [ ] Integrate JSX fixture files
  - [x] Support default export
  - [ ] Support multiple named exports
  - [ ] Support decorator files
- [ ] Port 3rd party fixture plugins (decorators)
  - [ ] Redux
  - [ ] React Router
  - [ ] LocalStorage
  - [ ] Fetch
  - [ ] XHR
- [x] Connect new fixture state format to UI

#### Dark launch strategy

> JSX fixtures are a big shift from the traditional fixture format in Cosmos. Before planning the migration, the new APIs need to be tested and validated by Cosmos users. Below are the steps to make the new fixture API available under a _feature flag._

- [x] New (minimal) Playground
  - [x] Map state to new renderer events
  - [x] Renderer preview
  - [x] Fixture list
  - [x] Fixture control panel
- [x] New DOM renderer
  - [x] Integrate with new FixtureConnect API
  - [x] Integrate (ES only, for now) fixture files
  - [x] HMR
- [x] Server
  - [x] Serve new Playground and renderer on `{ next: true }` config option
  - [x] Detect new fixture file types under `__jsxfixtures__`
- [ ] Usable control panel (new Playground)

## Pluggable UI

- [ ] Design plugin API
  - [x] Create rough plugin structure for existing UI
  - [x] Enable toggling plugins at run time
  - [x] Refactor ResponsiveLoader into a plugin
    - [x] Create shared UI context with Playground options, URL params, UI state and fixtureEdit callback
    - [x] Derive state from fixture.viewport
  - [x] Decouple plugin config from core config
  - [ ] Decouple URL params from core UI
  - [ ] Export styled-components to use in plugins (eg. HeaderButton)
- [ ] Design package API
  - [ ] Turn existing plugins into packages (type: `ui-plugin`)
- [ ] Create UI for browsing and toggling plugins
  - [ ] Design config API for enabled plugins
- [ ] Create UI from installing packages
- [ ] Document UI plugins

## React Native integration

- [x] RN server
  - [x] Extract non-webpack core from react-cosmos/server
  - [x] Create RN server cmd
  - [x] Create sockets server (forwarding messages between clients)
  - [x] Generate user modules file
  - [x] Update cosmos.modules file on fixture file changes
  - [x] Add loaderOpts to cosmos.modules
  - [ ] Onboarding
    - [ ] Generate Cosmos config
    - [ ] Add `cosmos.modules` to gitignore
    - [ ] Create new App file that forks between App.main and App.cosmos
    - [ ] Add package.json script
- [x] RN UI
  - [x] Add support for websocket communication (choose between sockets or postMessage)
  - [x] Ask loader for fixtures on load
  - [x] Create RN-specific onboarding screens
  - [ ] Test socket transport
  - [ ] Log using `debug` on the client
- [x] RN loader
  - [x] Extract non ReactDOM-specific core from react-cosmos-loader
  - [x] Create RN loader
  - [x] Test socket transport
  - [ ] Check if existing proxies are compatible
  - [x] Check if testing API is compatible
- [x] Create React Native App example
- [x] Add (experimental) README section

## UI control panel

- [x] Create POC with JSX fixtures
- [x] Show unserializable values as read-only fields
- [x] Use JSON editor for complex values
  - [ ] Prettify JSON
- [ ] Auto-expand fields to value height (number of lines)
- [ ] Style

## Redesign docs

- [ ] Create search UI for examples (by tags extracted from README)
- [ ] Create search UI for plugins
- [ ] Create high-level examples (eg. Next.js, CRA, Gatsby)
