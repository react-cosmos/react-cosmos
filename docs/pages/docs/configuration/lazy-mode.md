# Lazy Mode

In lazy mode, Cosmos dynamically imports fixture and decorator modules only when they are needed, specifically when a fixture is selected in the Cosmos UI. This approach results in code splitting and enhances the isolation of the selected fixture. In this mode, fixture names of [Multi-Fixtures](/docs/fixtures/fixture-modules.md#multi-fixtures) are only revealed upon selection.

Lazy mode is disabled by default. To enable lazy mode:

- Set the `lazy` option to `true` in the Cosmos config.
- Use the `--lazy` CLI argument when running a Cosmos command.
