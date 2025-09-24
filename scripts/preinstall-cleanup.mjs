import { rm } from 'node:fs/promises';
import { join } from 'node:path';

const directoriesToRemove = [
  'strip-ansi-cjs',
  'string-width-cjs',
  'wrap-ansi-cjs',
];

const baseDir = process.cwd();

await Promise.all(
  directoriesToRemove.map(async (dir) => {
    const target = join(baseDir, 'node_modules', dir);
    try {
      await rm(target, { recursive: true, force: true });
      console.log(`Removed \"${dir}\" before install if it existed.`);
    } catch (error) {
      console.warn(`Could not remove \"${dir}\":`, error);
    }
  }),
);
