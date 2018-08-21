## Roadmap: Summer of Cosmos

- [React Native integration](#react-native-integration)
- [Pluggable UI](#pluggable-ui)
- [Explore: JSX fixtures](#explore-jsx-fixtures)
- UI control panel
- Redesign docs

## Explore: JSX fixtures

- [ ] Create new declarative renderer: FixtureProvider
  - [x] Context API reading and updating fixture state
  - [ ] Core decorators
    - [x] Capture props
    - [x] Capture state
    - [ ] Capture context
  - [ ] Remote protocol
    - [x] window.postMessage
    - [ ] WebSockets
  - [ ] Testing API
- [ ] Support JSX fixture files
- [ ] Port 3rd party render plugins
  - [ ] Redux
  - [ ] React Router
  - [ ] LocalStorage
  - [ ] Fetch
  - [ ] XHR
- [ ] Connect new fixture state format to UI

## Pluggable UI

- [ ] Design plugin API
  - [x] Create rough plugin structure for existing UI
  - [x] Enable toggling plugins at run time
  - [x] Refactor ResponsiveLoader into a plugin
    - [x] Create UiContext with playgroundOpts, URL params, UI state and fixtureEdit callback
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

## Redesign docs

- [ ] Create search UI for examples (by tags extracted from README)
- [ ] Create search UI for plugins
- [ ] Create high-level examples (eg. Next.js, CRA, Gatsby)
