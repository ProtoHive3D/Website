const { getDB } = require('./db.js');
const { SKU_List } = require('../data/skuList.js');

async function seedFilamentData() {
  const db = await getDB();
  const seen = new Set();

  for (const sku of SKU_List) {
    const key = `${sku.material}|${sku.manufacturer}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const diameter = 1.75;
    const spool_weight = 1000;
    const spool_type = sku.material.includes('CF') ? 'plastic' : 'cardboard';
    const print_temp = sku.material.includes('PETG') ? 240 : sku.material.includes('Metal') ? 215 : 200;

    await db.run(`
      INSERT INTO filament_specs (material, manufacturer, name, description, diameter, print_temp, spool_weight, spool_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      sku.material,
      sku.manufacturer,
      `${sku.material} by ${sku.manufacturer}`,
      `High-quality ${sku.material} filament from ${sku.manufacturer}.`,
      diameter,
      print_temp,
      spool_weight,
      spool_type
    ]);

    await db.run(`
      INSERT INTO filament_images (material, manufacturer, url, sort_order)
      VALUES (?, ?, ?, 0)
    `, [
      sku.material,
      sku.manufacturer,
      sku.image
    ]);
  }

  console.log('✅ Filament specs and images seeded.');
}

module.exports = { seedFilamentData };
