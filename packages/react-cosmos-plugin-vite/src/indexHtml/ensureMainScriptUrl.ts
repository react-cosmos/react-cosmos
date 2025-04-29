import { defaultMainScriptUrl } from './defaultMainScriptUrl.js';
import { getHtmlScriptUrls } from './getHtmlScriptUrls.js';

export function ensureMainScriptUrl(html: string) {
  const scripts = getHtmlScriptUrls(html);
  if (scripts.length === 0) {
    html = html.replace(
      /(\s+)?<\/body>/,
      `$1  <script type="module" src="${defaultMainScriptUrl()}"></script>$1</body>`
    );
  }

  return html;
}
