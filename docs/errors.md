### Error handling

Make a table with all error scenarios possible in Cosmos

1. User code cannot compile, renderer iframe not responding
2. Hot module replacement with invalid syntax, fall back on working build and show compilation error
3. Module-level runtime error that breaks Cosmos’ thin layer of communication, show renderer iframe even if no fixture is selected
4. Render-level runtime error that allows Cosmos usage to render the unaffected components
5. Static export: Same as 3 and 4, except react-dev-overlay is missing. Rely solely on componentDidCatch

|     | Cause | Action | Details |
| --- | ----- | ------ | ------- |
| 1   | foo   | foo    | foo     |
| 2   | foo   | foo    | foo     |
| 3   | foo   | foo    | foo     |
| 4   | foo   | foo    | foo     |
| 5   | foo   | foo    | foo     |
