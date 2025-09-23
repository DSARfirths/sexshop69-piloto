import { readFile } from 'node:fs/promises';

const productsPath = new URL('../data/products.json', import.meta.url);

const raw = await readFile(productsPath, 'utf8');
let products;
try {
  products = JSON.parse(raw);
} catch (error) {
  console.error('Could not parse products.json:', error.message);
  process.exit(1);
}

const seen = new Map();
const duplicates = new Map();

for (const product of products) {
  const sku = product?.sku;
  if (!sku) continue;
  if (seen.has(sku)) {
    const existing = seen.get(sku);
    const list = duplicates.get(sku) ?? [existing];
    list.push(product);
    duplicates.set(sku, list);
  } else {
    seen.set(sku, product);
  }
}

if (duplicates.size > 0) {
  console.error('Duplicate SKUs found:');
  for (const [sku, items] of duplicates.entries()) {
    const ids = items.map((item) => `${item.id ?? 'unknown-id'}:${item.slug ?? 'unknown-slug'}`);
    console.error(`  ${sku} -> ${ids.join(', ')}`);
  }
  process.exit(1);
}

console.log('No duplicate SKUs detected.');
