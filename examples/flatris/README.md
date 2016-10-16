The Flatris game is a Redux example featuring both [webpack](webpack) and [Browserify](browserify) integrations.

This project builds React Cosmos from the source, enabling end-to-end testing when developing new features or fixing bugs. This means it relies on some packages from the root directory's *node_modules*. Copy pasting this folder to use as a starter kit requires a few changes:
- Replace local requires of React Cosmos packages with npm published ones (E.g. `../../../packages/react-cosmos-redux-proxy` => `react-cosmos-redux-proxy`)
- Install React
- Install Babel presets & plugins

Try it out:
```bash
npm install
npm run start:webpack
npm run start:browserify
```
