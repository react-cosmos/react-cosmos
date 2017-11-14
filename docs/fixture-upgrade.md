Before v3 fixtures looked like this:

```js
export default {
  props: {
    foo: 'bar'
  }
}
```

New fixtures look like this:

```js
import Button from './Button';

export default {
  component: Button,
  props: {
    foo: 'bar'
  }
}
```

The only difference is the new  `component` field, which makes the fixture more atomic and removes the need for tedious component path configuration in Cosmos.

> Warning: The following codemod only works for ES modules. If your old fixtures are CJS modules you'll have to upgrade them by hand. 🏋️‍

Follow these steps to automatically convert your old fixture.

> Keep the old `componentPaths` config until this process is done

1\. Install `react-cosmos-scripts` globally (or locally if you prefer)

2\. Run the `cosmos-upgrade-fixtures` CLI command in your project root, or the parent dir of your Cosmos config file

That's it. You can now switch to the latest Cosmos config. Let us know [on Slack](https://join-react-cosmos.now.sh/) if anything went wrong.

*Here's a [long thread](https://github.com/react-cosmos/react-cosmos/issues/440) for the full context behind this change.*
