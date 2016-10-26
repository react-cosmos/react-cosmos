# react-component-tree

Serialize and reproduce the state of an entire tree of React components.

> **Deprecated:** React Cosmos is moving towards separating props from state inside fixtures, which means we'll no longer need a combined method for rendering with state. In the next iteration we'll extract recursive state injection & serialization from this package and dump the rest.

A few examples where this can be useful:
- Using fixtures to load and test components in multiple supported states
- Extracting the app state when an error occurs in the page and reproducing
that exact state later on when debugging
- "Pausing" the app state and resuming it later (nice for games)

## .serialize

Generate a snapshot with the props and state of a component combined, including
the state of all nested child components.

```js
var ComponentTree = require('react-component-tree');

myCompany.setProps({public: true});
myCompany.setState({profitable: true});
myCompany.refs.employee54.setState({bored: false});

var snapshot = ComponentTree.serialize(myCompany);
```

The snapshot looks like this:
```js
{
  public: true,
  state: {
    profitable: true,
    children: {
      employee54: {
        bored: false
      }
    }
  },
}
```

## .render

Render a component and reproduce a state snapshot by recursively injecting the
nested state into the component tree it generates.

```js
var myOtherCompany = ComponentTree.render({
  component: CompanyClass,
  snapshot: snapshot,
  container: document.getElementById('content')
});

console.log(myOtherCompany.props.public); // returns true
console.log(myOtherCompany.state.profitable); // returns true
console.log(myOtherCompany.refs.employee54.state.bored); // returns false
```
