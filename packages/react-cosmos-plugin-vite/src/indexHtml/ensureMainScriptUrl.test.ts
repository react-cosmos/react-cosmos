import { ensureMainScriptUrl } from './ensureMainScriptUrl.js';

it('adds main script to existing index.html when no script exists', async () => {
  expect(
    ensureMainScriptUrl(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`)
  ).toMatchInlineSnapshot(
    `
    "<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>"
  `
  );

  expect(
    ensureMainScriptUrl(
      `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>My App</title></head><body><div id="root"></div></body></html>`
    )
  ).toMatchInlineSnapshot(
    `"<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>My App</title></head><body><div id="root"></div>  <script type="module" src="/src/main.tsx"></script></body></html>"`
  );
});

it('does not change index.html when script exists', async () => {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/my-main.tsx"></script>
  </body>
</html>`;
  expect(ensureMainScriptUrl(html)).toEqual(html);
});
