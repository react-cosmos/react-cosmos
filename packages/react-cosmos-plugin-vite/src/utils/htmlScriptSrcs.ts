// TODO: This is an implicit Vite dependency, we should probably add it to the
// explicit dependencies or replace it with vanilla JS
import * as parse5 from 'parse5';
import { Node } from 'parse5/dist/tree-adapters/default.js';

export function getHtmlScriptSrcs(html: string) {
  const document = parse5.parse(html);
  const scrs: string[] = [];

  function walk(node: Node) {
    if ('tagName' in node && node.tagName === 'script') {
      const srcAttr = node.attrs.find(attr => attr.name === 'src');
      if (srcAttr) scrs.push(srcAttr.value);
    }

    if ('childNodes' in node) node.childNodes.forEach(walk);
  }

  walk(document);

  return scrs;
}
