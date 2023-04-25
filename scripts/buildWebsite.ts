import { execSync } from 'child_process';
import fs from 'fs/promises';
import webpack from 'webpack';

process.env.NODE_ENV = 'production';

(async function () {
  // Clear prev build
  await fs.rm('./website/dist', { recursive: true, force: true });
  await fs.mkdir('./website/dist');

  // Copy static files
  await fs.cp('./website/static', './website/dist', { recursive: true });

  // Generate pages
  await createPage({
    title: `React Cosmos`,
    description: `Sandbox for developing and testing UI components in isolation.`,
  });
  await createPage({
    pageName: 'visual-tdd',
    title: `Visual TDD · React Cosmos`,
    description: `Develop one component at a time. Isolate the UI you're working on and iterate quickly. Refreshing your whole app on every change is slowing you down!`,
  });
  await createPage({
    pageName: 'component-library',
    title: `Component Library · React Cosmos`,
    description: `From blank states to edge cases, define component states to come back to. Your component library keeps you organized and provides a solid foundation of test cases.`,
  });
  await createPage({
    pageName: 'open-platform',
    title: `Open Platform · React Cosmos`,
    description: `Integrate with Webpack, Vite, or any other bundler. Add snapshot or visual regression testing. Create custom decorators, UI controls, or server plugins.`,
  });
  await createPage({
    pageName: 'benefits',
    title: `Build UIs at scale · React Cosmos`,
    description: `Prototype and iterate quickly. Debug with ease. Create reusable components. Share UI across projects. Publish component libraries. Maintain quality at scale.`,
  });
  await createPage({
    pageName: 'demo',
    title: `Don't settle for localhost:3000 · React Cosmos`,
    description: `A dev tool for building scalable, high-quality user interfaces.`,
  });
  await createPage({
    pageName: 'about',
    title: `About React Cosmos`,
    description: `I’m Ovidiu, a passionate developer from Romania. Obsessed with details, I made React Cosmos for like-minded developers.`,
  });

  // Build source
  await buildWebpack();

  // Export live demo instance
  execSync('yarn workspace website export');
})();

type PageParams = {
  pageName?: string;
  title: string;
  description: string;
};

async function createPage({ pageName, title, description }: PageParams) {
  const indexTemplate = await fs.readFile(`./website/src/index.html`, 'utf8');
  const indexPage = indexTemplate
    .replace(/\$PAGE_NAME/g, pageName ? `"${pageName}"` : 'undefined')
    .replace(/\$TITLE/g, title)
    .replace(/\$DESCRIPTION/g, description);
  const outputPath = pageName ? `${pageName}.html` : 'index.html';
  await fs.writeFile(`./website/dist/${outputPath}`, indexPage, 'utf8');
}

function buildWebpack() {
  return new Promise<void>(async (resolve, reject) => {
    const configFn = await import('../website/webpack.config.js');
    const webpackConfig = await configFn.default();
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        reject(err);
      } else if (stats?.hasErrors()) {
        console.log(stats.toJson().errors);
        reject();
      } else {
        resolve();
      }
    });
  });
}
