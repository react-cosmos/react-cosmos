import { moduleExists } from 'react-cosmos';

export function defaultMainScriptUrl() {
  const ext = moduleExists('typescript') ? 'tsx' : 'jsx';
  return `/src/main.${ext}`;
}
