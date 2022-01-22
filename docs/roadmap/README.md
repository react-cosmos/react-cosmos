# React Cosmos v6

## Bundler

- [ ] Revamp webpack integration.
  - [ ] Make webpack and external package (and plugin).
  - [ ] [Move from webpack middlewares to webpack-dev-server](https://github.com/react-cosmos/react-cosmos/issues/1272#issuecomment-733091647).
  - [ ] Fast Refresh out of the box integration.
- [ ] Integrate with Vite.

## Core

- [ ] Decide what to do with [Lazy fixture importing](https://github.com/react-cosmos/react-cosmos/pull/1313). Salvage what you can and move on. No need to linger if the complexity required to achieve this is unreasonable. Document everything learned for future reference.
- [ ] Research: ES6 modules (React Cosmos with no bundler and no compiler).

## Plugins

- [ ] Add support for server plugins.
- [ ] Document plugin APIs.
- [ ] Add guide for creating UI + server plugin.

## Quality of life

- [ ] Change default port because [port 5000 is taken on macOS 12](https://github.com/react-cosmos/react-cosmos/issues/1355).
- [ ] Fix [issues with Yarn 2 and PnP](https://github.com/react-cosmos/react-cosmos/issues/946) (if any).
- [ ] Fix security issues.
  - [ ] Drop IE support.
  - [ ] Drop Node <12 support.
  - [ ] Minimize 3rd party depedencies.
- [ ] Migrate from Slack to Discord?

## Docs & website

- [ ] Improve getting started docs. This needs to be more prominent. Easy steps for getting started should be present in the website and the main docs.
- [ ] Add docs to website.
  - [ ] MD-powered, auto-generated from docs/ directory.
  - [ ] Sticky side nav with table of contents.
- [ ] Add more [used by logos](https://github.com/react-cosmos/react-cosmos/issues/1207).
