# Documentation

Welcome to the React Cosmos documentation!

## What Is React Cosmos?

React Cosmos is a powerful tool for developing and testing UI components in isolation. It allows you to focus on one component at a time, resulting in faster iteration and higher-quality components.

With React Cosmos, you can build a component library that keeps your project organized and friendly to new contributors. Reusing components across projects saves time and promotes consistency. Sharing your design language with the community enhances collaboration and ensures a cohesive user experience.

React Cosmos revolutionizes component development, testing, and sharing. Its sandbox environment and component library capabilities optimize your workflow, enabling you to deliver exceptional UI experiences.

## Key Features

| Feature        | Description                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| Fixtures       | A file-system based module convention for defining component states effortlessly. Enhanced with decorators.         |
| User Interface | User-friendly interface for browsing fixtures. Component preview with responsive viewports.                         |
| Control Panel  | Component data manipulation through UI controls based on component props and custom definitions.                    |
| Static Export  | An interactive component library deployable to any static hosting service.                                          |
| Integration    | First-class integrations with Vite, Webpack, React Native, Next.js, and support for integrating with custom setups. |
| Plugins        | Full-stack plugin system for extending every aspect of React Cosmos to suit your needs.                             |
| High Quality   | 100% TypeScript. Minimal dependencies. Meticulously designed and tested to ensure the best developer experience.    |

## Getting Started

> The current docs are for React Cosmos 6. Check out the [Migration Guide](getting-started/migration.md) to upgrade from v5.

Choose a dedicated guide for integrating with a specific bundler, framework, or a custom setup:

- [Vite](getting-started/vite.md)
- [Webpack](getting-started/webpack.md)
- [Next.js](getting-started/next.md)
- [Create React App](getting-started/create-react-app.md)
- [React Native](getting-started/react-native.md)
- [Custom Bundler](getting-started/custom-bundler.md)

> See [Troubleshooting](getting-started/troubleshooting.md) for common issues.

## Usage

- [Fixtures](usage/fixtures.md)
- [Decorators](usage/decorators.md)
- [Configuration](usage/configuration.md)
- [Static Export](usage/static-export.md)
- [Node.js API](usage/node-api.md)

## Plugins

- [Cosmos Plugins](plugins/cosmos-plugins.md)
- [Server Plugins](plugins/server-plugins.md)
- [UI Plugins](plugins/ui-plugins.md)
- [Fixture Plugins](plugins/fixture-plugins.md)

## Why is React Cosmos architecturally unique?

React Cosmos aims to be lightweight and efficient by employing the following strategies:

- **Library over framework approach**: Instead of replicating all the environments it operates in, React Cosmos functions as a modular library that can be seamlessly integrated into any environment. This enables compatibility with a wide range of bundlers while ensuring a compact and robust React Cosmos codebase.
- **Comprehensive plugin system**: React Cosmos offers extensive extendability while maintaining a small core API surface area. This means that all aspects of React Cosmos are pluggable, and even the core functionality is built using the same plugin APIs.
- **Dedicated to React**: React Cosmos focuses solely on React. By doing so, it harnesses the full potential of the React component model and delivers an exceptional experience for React developers. We firmly believe that React is still just getting started and holds a bright future ahead.

---

[Join us on Discord](https://discord.gg/3X95VgfnW5) for feedback, questions and ideas.
