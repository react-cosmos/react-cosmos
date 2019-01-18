# Error handling

This is an overview of the error types Cosmos users might have to deal with. All these errors are related to the user's build, which contains only a thin layer of Cosmos communication code. The Cosmos UI (aka the _Playground_) is precompiled and runs in a parent frame (or a different environment for React Native users) and, bugs aside, is unlikely to cause errors.

|     | Problem                                                                              | Detection                                                                  | Action                                                              | Other details                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | User build is broken or fails to yield an index.html page                            | Check HTTP status code of renderer URL                                     | Show custom error screen with common causes and "ask for help" link | User has to refresh the page after rebuilding                                                                                                       |
| 2   | **Webpack related:** Code with invalid syntax is pushed in dev mode                  | Webpack detects the invalid syntax and doesn't put it in the running build | -                                                                   | **After server restart this becomes an broken build!**                                                                                              |
| 3   | **Webpack related:** Code with unhandled error at module level is pushed in dev mode | Webpack catches the error at run time and cancels hot reloading            | -                                                                   | **After full page reload this turns into a renderer init error!**                                                                                   |
| 4   | Error occurs _before_ renderer initializes                                           | Global error handler injected in user bundle                               | Reveal renderer iframe even if no fixture is selected [1]           | [react-error-overlay](https://github.com/facebook/create-react-app/tree/master/packages/react-error-overlay) augments this state nicely in dev mode |
| 5   | Error occurs _after_ renderer initializes                                            | Global error handler injected in user bundle                               | Capture error with React error boundary                             | [react-error-overlay](https://github.com/facebook/create-react-app/tree/master/packages/react-error-overlay) augments this state nicely in dev mode |

## Side notes

> A UI error state is triggered when the renderer reports an error. When is this error state turned off?

When a `rendererReady` response arrives, which indirectly signals that error has been fixed and communication has been established.

> How to differentiate between an error that breaks Cosmos usage, and that is contained by one or more fixtures?

It's tricky, because [React rethrows component exceptions even if they are "caught" by error boundaries](https://github.com/facebook/react/issues/10474). It is _possible_ to distinguish between "organic" errors and those rethrown by React, but it requires analyzing the error's call stack, which ties us to React implementation details. So no. Instead, the renderer only sends one type of error message.

If the renderer reports an error before connectivity has been established, the UI goes into the "renderer error" state. Renderer errors that occur after a successful handshake between renderer and UI are considered fixture-bound. These errors will be captured nicely by a React error boundary and react-error-overlay in dev mode.
