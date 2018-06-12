## React Native integration

- [ ] Broadcast loader communication thru server via sockets
  - [ ] Create socket server (forwarding messages between clients)
  - [ ] Switch postMessage communication to sockets in UI
  - [ ] Switch postMessage communication to sockets in Loader
- [ ] Create RN server
  - [x] Extract non-webpack core from react-cosmos/server
  - [ ] Generate user modules file
- [ ] Create RN loader
  - [ ] Extract non ReactDOM-specific core from react-cosmos-loader
  - [ ] Create RN loader and proxies
- [ ] Tailor RN-specific UI experience
- [ ] Create CRNA onboarding
  - [ ] Create new App file that forks between App.dev and App.cosmos
  - [ ] Add package.json script
  - [ ] Add Cosmos config
  - [ ] Add `cosmos.modules` to gitignore
