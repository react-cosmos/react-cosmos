# react-querystring-router

Bare router for React components, using query string as props.

```
http://mysite.com/?component=Father&eyes=blue&mood=happy
```

By making use of the `getComponentClass` and `getComponentProps` callbacks, this route will render the following element:

```jsx
<Father
  eyes="blue"
  mood="happy"
/>
```

#### Options

```js
import { Router } from 'react-querystring-router';

var myRouter = new Router({
  // This is how the router maps component names to corresponding classes
  getComponentClass: ({ component }) => require(`components/${component}.jsx`),
  // This is to combine url params with default and additional props
  getComponentProps: (params) => {
    return {
      unlessOverridden: true,
      ...params,
      alwaysHere: true,
    };
  },
  // Tell React where to render in the DOM
  container: document.getElementById('content'),
  // Called whenever the route changes (also initially), receiving the parsed
  // props as the first argument
  onChange: (params) => {
    // E.g. Use the props to set a custom document.title
  }
});
```

The router always sends a reference to itself to the rendered component through
the `router` prop.

#### Changing the route

```jsx
import { uri } from 'react-querystring-router';
const { stringifyParams } = uri;

//...

render() {
  return (
    <div className="serious-component">
      <a href={stringifyParams({lifeChangingProp: 1})}
         onClick={this.props.router.routeLink}>
         Click me por favor
      </a>
    </div>
  );
};
```
