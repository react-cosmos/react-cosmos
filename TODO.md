# Roadmap: Cosmos Next

The innovations included in the next generation of Cosmos have already been designed, tested and implemented for the most part. This roadmap will put the the all-new **JSX fixtures** and **Pluggable UI** into the user's hands.

The aim for _Cosmos Next_ is to provide ~80% parity with Cosmos 4.x along with brand new features. The upgrade will be **opt-in** and there will be a exhaustive beta phase before a transition plan is devised for the stable channel.

## Step 1: Port UI to plugin architecture

> Note: The development of JSX fixtures is coupled to the new Pluggable UI. JSX fixtures use a new communication protocol that only the new UI understands and vice-versa. So they both need to be released at the same time. This was a risky engineering endeavor, but it allowed leapfrogging intermediate development steps.

We need a decent parity with the existing Cosmos UI to test JSX fixtures. This is the main requirement for releasing Cosmos Next for beta testing.

- [x] Establish testing practices for new UI package
- [x] Create router for new UI
- [ ] MVP feature set for new UI
  - [x] Full screen mode
    - [x] Remove renderer full screen mode (renderer URL belongs to user)
  - [x] Remote renderer (WebSockets)
    - [x] Enable remote renderer(s) on web
    - [x] Sync fixture state between renderers (this wasn't required at this step but is _so_ cool)
  - [x] Collapsable fixture tree view
    - [x] Persist state
  - [x] Responsive mode
  - [x] Style
    - [ ] Style minimalistic renderer blank state
  - [x] JSX decorators

**Not** included in the first beta release: The Fixture Editor. This is because it'll be replaced by something _much_ more powerful (a new Control Panel). But this section will have arrive later, after the core of Cosmos Next has been thoroughly tested.

## Step 2: Get feedback on JSX fixtures

- [ ] "How to use" document for beta testers
- [ ] Release 4.7
  - [ ] Blog post

## Next Steps

- [ ] Basic Control Panel (props/state visualization and editing)
- [ ] Port onboarding screens to new UI
- [ ] More Control Panel features
  - [ ] General purpose UI controls mapped to render props
  - [ ] Option to reset or transition props (it currently does former)
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
