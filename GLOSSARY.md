#### Fixture

Any React [Node](https://flow.org/en/docs/react/types/#toc-react-node). Describes the state of one or more components.

#### Fixture plugin

Component decorator for enhancing a fixture's capabilities.

#### Fixture state

State related to a rendered fixture, like component props, state or other data provided by fixture plugins. Changes to the fixture state alter the fixture elements (and in turn their output).

#### FixtureProvider

Provides the required context for a fixture (along with fixture plugins) to render.

#### FixtureConnect

Manages a list of fixtures and the state of the selected fixture. Controlled remotely via `WebSockets` or `window.postMessage`.

#### Fixture renderer

Renders _FixtureConnect_ in an isolated environment. Bundled using the user's source code and configuration.

#### Playground

Visual interface for browsing fixtures. Connects to one or more fixture renderers. Once a fixture is loaded, interaction is possible through controls that manipulate the fixture state remotely.

#### Playground plugin

UI extensions via [react-plugin]. Can be bundled separately. Runs in the same window with the Playground core and shares a global copy of React.
