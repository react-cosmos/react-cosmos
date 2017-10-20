# react-cosmos-playground

UI for interacting with your components and their respective fixtures.

*Full disclosure: CP is a large component that could be split into more modular pieces.*

Right now it embodies the following parts:

1. The fixed header with the home button, alongside the toggle editor and full-screen buttons.

1. The list of components/fixtures with fuzzy search functionality and navigation between them.
  - **TODO:** Move into separate `ComponentList` component.

1. The CodeMirror fixture editor, JSON format.
  - It serializes the fixture and only displays the serializable parts, invisibly storing the rest. On user changes, the editor content is parsed and merged with the unserializable rest to form the updated fixture to render.
  - It keeps a copy of the editor contents since they were last JSON valid to merge into the fixture contents (used to render component), while user is typing and possibly making syntax errors along the way.
  - The editor ignores fixture updates when focused, giving priority to user input over component state changes.
  - **TODO:** Move into separate `Editor` component.

1. A draggable split pane between the editor and the component preview.
  - The desired split position is persisted using localStorage.
  - It automatically chooses a portrait/landscape orientation to best serve the width/height ratio of the window.

1. Communication with Component loader, which renders selected component with selected fixture contents.

Finally, here is an example of the `components` and `fixtures` props, used to pass the user components and fixtures:
```js
components: {
  ComponentOne: require('./components/ComponentOne'),
  ComponentTwo: require('./components/ComponentTwo'),
},
fixtures: {
  ComponentOne: {
    normal: {
      fooProp: 'bar'
    },
    paused: {
      fooProp: 'bar',
      state: {
        paused: true
      }
    }
  },
  ComponentTwo: {
    //...
  }
};
```
