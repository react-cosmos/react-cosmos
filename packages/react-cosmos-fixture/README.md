# react-cosmos-fixture

## Props/state capture

A primary role of the FixtureProvider is to capture component props & state values from the loaded fixture. _Capturing_ entails a two-way binding between the fixture and a remote controller (eg. the Playground). The remote controller can request changes for the captured values and affect the fixture output. The fixture can also change from the inside, all the while updating remote listeners with its latest values.
