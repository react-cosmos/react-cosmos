import { generateExport } from './shared/export';
import { webpackExport } from './plugins/webpack';

export async function generateWebExport() {
  await generateExport([webpackExport]);
}
