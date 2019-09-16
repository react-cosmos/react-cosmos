#### Fixture

Any React [Node](https://flow.org/en/docs/react/types/#toc-react-node) or a React component with no props. Captures the state of one or more components.

#### Fixture decorator

Component wrapper for enhancing a fixture's capabilities.

#### Fixture state

State related to a rendered fixture, like component props, state or other data provided by fixture decorators. Changes to the fixture state alter the fixture (and in turn its output).

#### FixtureProvider

Hosts fixture state and provides the required context for fixtures (and decorators) to render.

#### FixtureLoader

Manages a list of fixtures and the state of the selected fixture. Controlled remotely via `WebSockets` or `window.postMessage`. Platform agnostic.

#### Fixture renderer

Renders _FixtureLoader_ in an isolated environment. Bundled using the user's source code and configuration. Platform specific.

#### Playground

Visual interface for browsing fixtures. Connects to one or more fixture renderers. Once a fixture is loaded, interaction is possible through controls that manipulate the fixture state remotely.

#### Playground plugin

UI extensions via [react-plugin]. Can be bundled separately. Runs in the same window with the Playground core and shares a global copy of React.
