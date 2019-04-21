import { webpackExport } from './plugins/webpack';
import { generateExport } from './shared/export';

export async function generateWebExport() {
  await generateExport([webpackExport]);
}
