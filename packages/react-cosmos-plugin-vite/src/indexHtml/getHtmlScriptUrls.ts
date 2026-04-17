import * as parse5 from 'parse5';

type Node = parse5.DefaultTreeAdapterTypes.Node;

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
