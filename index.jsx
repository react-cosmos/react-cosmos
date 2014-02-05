/** @jsx React.DOM */

var rootProps = url.getParams(),
    widget = window[rootProps.widget],
    content;

if (!widget) {
  content = (<h1>404</h1>);
} else {
  content = widget(rootProps);
}
React.renderComponent(content, document.body);
