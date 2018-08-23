// @flow

// TODO: Export FixtureProvider, CaptureProps and ComponentState with Flow types

// TODO: Fixture out the best naming for this package and the types used inside.
// - react-cosmos-render is confusing because it exports components to load
// fixtures, the React renderers are outside the scope of this package
// - react-cosmos-fixture is insufficient because FixtureConnect receives a
// list of fixtures, not just one. FixtureConnect is also aware of the remote
// communication with UI.
// - react-cosmos-loader has baggage... In any case, it would be
// react-cosmos-loader2. But "loader" is misleading.
// NOTE: Should plugins be called "render plugins" or "fixture plugins"?
// "loader plugins" was too confusing!

// TODO: Create GLOSSARY.md
// Cosmos Fixture?
// Cosmos Renderer?
// Cosmos UI: Visual remote control for loading and interacting with Cosmos
//  fixtures in an [isolated environment=Renderer] (iframe or Native environment)
