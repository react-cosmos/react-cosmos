import { copy, mkdir, readFile, remove, outputFile } from 'fs-extra';
import webpack from 'webpack';

process.env.NODE_ENV = 'production';

(async function() {
  // Clear prev build
  await remove('./website/dist');
  await mkdir('./website/dist');

  // Copy static files
  await copy('./website/static', './website/dist');

  // Generate pages
  await createPage({
    title: `React Cosmos`,
    description: `A tool for ambitions UI developers.`
  });
  await createPage({
    pageName: 'visual-tdd',
    title: `Visual TDD · React Cosmos`,
    description: `Develop one component at a time. Isolate the UI you're working on and iterate quickly. Reloading your whole app on every change is slowing you down!`
  });
  await createPage({
    pageName: 'component-library',
    title: `Component Library · React Cosmos`,
    description: `From blank states to edge cases, define component states to come back to. Your component library keeps you organized and provides a solid foundation of test cases.`
  });
  await createPage({
    pageName: 'open-platform',
    title: `Open Platform · React Cosmos`,
    description: `React Cosmos can be used in powerful ways. Snapshot and visual regression tests are possible, as well as custom integrations tailored to your needs.`
  });
  await createPage({
    pageName: 'benefits',
    title: `Build UIs at scale · React Cosmos`,
    description: `Prototype and iterate quickly. Debug with ease. Create reusable components. Share UI across projects. Publish component libraries. Maintain quality at scale.`
  });

  // Build source
  await buildWebpack();
})();

type PageParams = {
  pageName?: string;
  title: string;
  description: string;
};

async function createPage({ pageName, title, description }: PageParams) {
  const indexTemplate = await readFile(`./website/src/index.html`, 'utf8');
  const indexPage = indexTemplate
    .replace(`$PAGE_NAME`, pageName ? `"${pageName}"` : 'undefined')
    .replace(`$TITLE`, title)
    .replace('$DESCRIPTION', description);
  const outputPath = pageName ? `${pageName}.html` : 'index.html';
  await outputFile(`./website/dist/${outputPath}`, indexPage, 'utf8');
}

function buildWebpack() {
  return new Promise((resolve, reject) => {
    const webpackConfig = require('../website/webpack.config');
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.hasErrors()) {
        console.log(stats.toJson().errors);
        reject();
      } else {
        resolve();
      }
    });
  });
}
