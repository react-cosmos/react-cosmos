import { execSync } from 'child_process';
import { copy, mkdir, outputFile, readFile, remove } from 'fs-extra';
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
  await createPage({
    pageName: 'demo',
    title: `Don't settle for localhost:3000 · React Cosmos`,
    description: `A dev tool for building scalable, high-quality user interfaces.`
  });
  await createPage({
    pageName: 'about',
    title: `About React Cosmos`,
    description: `I’m Ovidiu, a passionate developer from Romania. Obsessed with details, I made React Cosmos for like-minded developers.`
  });

  // Build source
  await buildWebpack();

  // Export live demo instance
  execSync('yarn cosmos-export --root-dir website');
})();

type PageParams = {
  pageName?: string;
  title: string;
  description: string;
};

async function createPage({ pageName, title, description }: PageParams) {
  const indexTemplate = await readFile(`./website/src/index.html`, 'utf8');
  const indexPage = indexTemplate
    .replace(/\$PAGE_NAME/g, pageName ? `"${pageName}"` : 'undefined')
    .replace(/\$TITLE/g, title)
    .replace(/\$DESCRIPTION/g, description);
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
