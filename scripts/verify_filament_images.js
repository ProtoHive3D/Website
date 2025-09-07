import fs from 'fs';
import path from 'path';
import { SKU_List } from './src/data/skuList.js';

const baseDir = path.resolve('./public/filaments');
let missing = [];

SKU_List.forEach(sku => {
  const fileName = path.basename(sku.image); // e.g. 'pla-plus-black.jpg'
  const filePath = path.join(baseDir, fileName);

  if (!fs.existsSync(filePath)) {
    missing.push(fileName);
  }
});

if (missing.length > 0) {
  console.log('⚠️ Missing files:');
  missing.forEach(f => console.log(` - ${f}`));
  console.log(`\nTotal missing: ${missing.length}`);
} else {
  console.log('✅ All SKU_List images found in /public/filaments');
}