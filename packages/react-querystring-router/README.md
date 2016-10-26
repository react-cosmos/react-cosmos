# react-querystring-router

Bare router for React components, using query string as props.

```
http://mysite.com/?component=Father&eyes=blue&mood=happy
```

This route will render the component class returned by `getComponentClass`
using the following props:

```js
{
  component: 'Father',
  eyes: 'blue',
  mood: 'happy'
}
```

#### Options

```js
var Router = require('react-querystring-router').Router;

var myRouter = new Router({
  // These props will be sent to all components loaded, and will be overridden
  // by the ones in the URL query string
  defaultProps: {
    fries: true
  },
  // This is how the router maps component names to corresponding classes
  getComponentClass: function(props) {
    return require('components/' + props.component + '.jsx');
  },
  // Tell React where to render in the DOM
  container: document.getElementById('content'),
  // Called whenever the route changes (also initially), receiving the parsed
  // props as the first argument
  onChange: function(props) {
    // E.g. Use the props to set a custom document.title
  }
});
```

The router always sends a reference to itself to the rendered component through
the `router` prop.

#### Changing the route

```jsx
var stringifyParams = require('react-querystring-router').uri.stringifyParams;

//...

render: function() {
  return <div className="serious-component">
    <a href={stringifyParams({lifeChangingProp: 1})}
       onClick={this.props.router.routeLink}>
       Click me por favor
    </a>
  </div>;
};
```
