import { generateExport } from './export/generateExport';
import { webpackExport } from './plugins/webpack';

export async function generateWebExport() {
  await generateExport([webpackExport]);
}
