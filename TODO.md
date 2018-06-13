## React Native integration

- [ ] RN server
  - [x] Extract non-webpack core from react-cosmos/server
  - [x] Create RN server cmd
  - [ ] Create socket server (forwarding messages between clients)
  - [ ] Generate user modules file
  - [ ] Onboarding
    - [ ] Generate Cosmos config
    - [ ] Add `cosmos.modules` to gitignore
    - [ ] Create new App file that forks between App.dev and App.cosmos
    - [ ] Add package.json script
- [ ] RN UI
  - [ ] Add support for websocket communication (choose between sockets or postMessage)
  - [ ] Create RN-specific onboarding screen
- [ ] RN loader
  - [ ] Extract non ReactDOM-specific core from react-cosmos-loader
  - [ ] Create RN loader and proxies
