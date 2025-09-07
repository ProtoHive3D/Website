// generate_rename_map.js
import fs from 'fs';
import path from 'path';
import { SKU_List } from './src/data/skuList.js';

// Path to output mapping file
const outputPath = path.resolve('./rename_map.txt');

let lines = [];
let counter = 1;

SKU_List.forEach(sku => {
  // Extract just the filename from the image path in skuList.js
  const targetFile = path.basename(sku.image); // e.g. 'pla-plus-black.jpg'
  // Create placeholder mapping line
  lines.push(`current${counter}.jpg|${targetFile}`);
  counter++;
});

// Write to rename_map.txt
fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');

console.log(`✅ rename_map.txt created with ${lines.length} entries at ${outputPath}`);