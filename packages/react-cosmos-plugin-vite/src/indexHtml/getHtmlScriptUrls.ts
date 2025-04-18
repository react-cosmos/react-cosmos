import * as parse5 from 'parse5';
import { Node } from 'parse5/dist/tree-adapters/default';

export function getHtmlScriptUrls(html: string) {
  const document = parse5.parse(html);
  const urls: string[] = [];

  function walk(node: Node) {
    if ('tagName' in node && node.tagName === 'script') {
      const srcAttr = node.attrs.find(attr => attr.name === 'src');
      if (srcAttr) urls.push(srcAttr.value);
    }

    if ('childNodes' in node) node.childNodes.forEach(walk);
  }
  walk(document);

  return urls.filter(url => !url.startsWith('/@vite'));
}
