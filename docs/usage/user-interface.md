# User Interface

This is the main functionality of the React Cosmos User Interface.

## Fixture Tree View

elegant file-system based tree view navigation. folders can be collapsed and their state is persistent between sesions.

## Fixture Search

snappy fixture search with fuzzy maching. ⌘ + P from anywhere to launch the search modal.

## Fixture Bookmarks

convenient way to return to keep certain fixture at hand while you're actively working with them.

## Fixture Preview

the fixture preview is the essence of React Cosmos. It loads a Cosmos renderer in an `<iframe>` inside the Cosmos UI. communication between the Cosmos UI and the renderer is done through `postMessage`.

## Full-Screen Preview

at any point you can launch the selected fixture into a full screen preview and break away from the Cosmos UI shell.

Note: A full screen preview is essentially a remote renderer.

## Remote Renderer

You can have multiple ones opened at the same time. you can have the same fixture on multiple resolutions, browsers or even devices. or you can have preview different fixtures at the same time.

state is syncronized between multiple renderers. there's one primary renderer that controls the state and the rest mirror it.

Note: The React Native renderer is a remote renderer. It syncronizes its state with the Cosmos UI via WebSocket.

## Reload Renderer (With Native Support)

The reload renderer button does a full reload of the fixture preview.

Note: The renderer reload button also React Native app using DevSettings.reload, which is very convenient.

## Open Fixture Source

Launch the source code of the current fixture in your default code editor.

Note you need to install the Open Fixture Plugin for this capability.

## Control Panel

UI controls for powerful component data manipulation. There are currently three types of panels supported:

1. Props Panel. Generated automatically based on React element props. Only works with Node Fixtures.
2. Class State Panel. Generated automatically based on React Class components, which are deprecated but still supported indefinitely.
3. Controls Panel. Generated using custom definition hooks that can be represented as text inputs or select dropdowns.

## Keyboard Shortcuts

React Cosmos supports a few handy keyboard shortcuts for the most popular actions.

## Adjustable Panels

React Cosmos has two left and right slick panels. They are resizable, collapsable, and their state is persistent between sessions.

## Notifications

A beautiful notifications API that's used to communicate renderer and server connectivity. Can be called from anywhere in the Cosmos UI, including 3rd party plugins.

## UI Plugins

The Cosmos UI can be extended in endless ways using the UI Plugin API.
