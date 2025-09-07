// /src/data/skuList.js

// Global markup multiplier for print service pricing
export const MARKUP_MULTIPLIER = 4; // 4× return target

// Bundle discount tiers for filament shop (cart-level)
export function getBundleDiscount(totalRolls) {
  if (totalRolls >= 10) return 0.10; // 10% off
  if (totalRolls >= 3) return 0.05;  // 5% off
  return 0;                          // no discount
}

// FOB cost per kg by material (USD)
const FOB_BY_MATERIAL = {
  'PLAplus': 7.5,
  'PLA-Luminous': 11,
  'PLA-Matte': 7,
  'PLA-Matte Rainbow': 9,
  'PLA-Matte Dual': 9,
  'PLA-Metal': 9.2,
  'PETG-CF': 12
};

// Base SKU list without costPerGram (FOB-derived pricing gets added below)
const BASE_SKUS = [
  // PLAplus (2)
  { sku: 'PLAplus175W1Y1', material: 'PLAplus', color: 'White', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-plus-white.jpg' },
  { sku: 'PLAplus175B1Y1', material: 'PLAplus', color: 'Black', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-plus-black.jpg' },

  // PLA-Luminous (6)
  { sku: 'PLA-LM175CL-O1Y1', material: 'PLA-Luminous', color: 'Cored Luminous Orange', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-cored-luminous-orange.jpg' },
  { sku: 'PLA-LM175CL-G1Y1', material: 'PLA-Luminous', color: 'Cored Luminous Green', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-cored-luminous-green.jpg' },
  { sku: 'PLA-LM175CL-U1Y1', material: 'PLA-Luminous', color: 'Cored Luminous Blue', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-cored-luminous-blue.jpg' },
  { sku: 'PLA-LM175CL-Z1Y1', material: 'PLA-Luminous', color: 'Cored Luminous Purple', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-cored-luminous-purple.jpg' },
  { sku: 'PLA-LM175L-U1Y1', material: 'PLA-Luminous', color: 'Luminous Blue', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-luminous-blue.jpg' },
  { sku: 'PLA-LM175L-G1Y1', material: 'PLA-Luminous', color: 'Luminous Green', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-luminous-green.jpg' },

  // PLA-Matte (20)
  { sku: 'PLA-MT175O-MG1Y1', material: 'PLA-Matte', color: 'Mint Green', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-mint-green.jpg' },
  { sku: 'PLA-MT175O-CR1Y1', material: 'PLA-Matte', color: 'Strawberry Red', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-strawberry-red.jpg' },
  { sku: 'PLA-MT175O-ZA1Y1', material: 'PLA-Matte', color: 'Lilac', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-lilac.jpg' },
  { sku: 'PLA-MT175B1Y1', material: 'PLA-Matte', color: 'Black', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-black.jpg' },
  { sku: 'PLA-MT175O-TA1Y1', material: 'PLA-Matte', color: 'Tangerine', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-tangerine.jpg' },
  { sku: 'PLA-MT175O-MC1Y1', material: 'PLA-Matte', color: 'Matcha Green', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-matcha-green.jpg' },
  { sku: 'PLA-MT175MO-G1Y1', material: 'PLA-Matte', color: 'Morandi Green', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-morandi-green.jpg' },
  { sku: 'PLA-MT175MO-Z1Y1', material: 'PLA-Matte', color: 'Morandi Purple', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-morandi-purple.jpg' },
  { sku: 'PLA-MT175O-MW1Y1', material: 'PLA-Matte', color: 'Milky White', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-milky-white.jpg' },
  { sku: 'PLA-MT175Q-K1Y1', material: 'PLA-Matte', color: 'Light Khaki', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-light-khaki.jpg' },
  { sku: 'PLA-MT175Q-U1Y1', material: 'PLA-Matte', color: 'Light Blue', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-light-blue.jpg' },
  { sku: 'PLA-MT175D-H1Y1', material: 'PLA-Matte', color: 'Dark Grey', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-dark-grey.jpg' },
  { sku: 'PLA-MT175O-PF1Y1', material: 'PLA-Matte', color: 'Peach Pink', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-peach-pink.jpg' },
  { sku: 'PLA-MT175O-FR1Y1', material: 'PLA-Matte', color: 'Fire Engine Red', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-fire-engine-red.jpg' },
  { sku: 'PLA-MT175O-AY1Y1', material: 'PLA-Matte', color: 'Almond Yellow', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-almond-yellow.jpg' },
  { sku: 'PLA-MT175C1Y1', material: 'PLA-Matte', color: 'Brown', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-brown.jpg' },
  { sku: 'PLA-MT175O-OG1Y1', material: 'PLA-Matte', color: 'Olive Green', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-olive-green.jpg' },
  { sku: 'PLA-MT175D-U1Y1', material: 'PLA-Matte', color: 'Dark Blue', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-dark-blue.jpg' },
  { sku: 'PLA-MT175O-AQ1Y1', material: 'PLA-Matte', color: 'Aqua', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-aqua.jpg' },
  { sku: 'PLA-MT175O-CH1Y1', material: 'PLA-Matte', color: 'Concrete Grey', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-concrete-grey.jpg' },

  // PLA-Matte Rainbow (8)
  { sku: 'PLA-MTRB175RB-A1Y1', material: 'PLA-Matte Rainbow', color: 'Rainbow', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-rainbow.jpg' },
  { sku: 'PLA-MTRB175O-PD1Y1', material: 'PLA-Matte Rainbow', color: 'Paddy Field', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-rainbow-paddy.jpg' },
  { sku: 'PLA-MTRB175O-MA1Y1', material: 'PLA-Matte Rainbow', color: 'Macaron', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-rainbow-macaron.jpg' },
  { sku: 'PLA-MTRB175O-OC1Y1', material: 'PLA-Matte Rainbow', color: 'Ocean', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-rainbow-ocean.jpg' },
  { sku: 'PLA-MTRB175O-FC1Y1', material: 'PLA-Matte Rainbow', color: 'Fruit Candy', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-rainbow-fruit-candy.jpg' },
  { sku: 'PLA-MTRB175O-SE1Y1', material: 'PLA-Matte Rainbow', color: 'Sunrise', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-rainbow-sunrise.jpg' },
  { sku: 'PLA-MTRB175S-YWAQ1Y1', material: 'PLA-Matte Rainbow', color: 'Yellow White Aqua', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-rainbow-yellow-white-aqua.jpg' },
  { sku: 'PLA-MTRB175S-YPZ1Y1', material: 'PLA-Matte Rainbow', color: 'Yellow Pink Purple', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-rainbow-yellow-pink-purple.jpg' },

  // PLA-Matte Dual (8)
  { sku: 'PLA-MTD175B-BW1Y1', material: 'PLA-Matte Dual', color: 'Black White', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-dual-black-white.jpg' },
  { sku: 'PLA-MTD175B-BR1Y1', material: 'PLA-Matte Dual', color: 'Black Red', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-dual-black-red.jpg' },
  { sku: 'PLA-MTD175B-RY1Y1', material: 'PLA-Matte Dual', color: 'Red Yellow', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-dual-red-yellow.jpg' },
  { sku: 'PLA-MTD175B-RU1Y1', material: 'PLA-Matte Dual', color: 'Red Blue', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-dual-red-blue.jpg' },
  { sku: 'PLA-MTD175B-GP1Y1', material: 'PLA-Matte Dual', color: 'Green Pink', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-dual-green-pink.jpg' },
  { sku: 'PLA-MTD175B-UG1Y1', material: 'PLA-Matte Dual', color: 'Blue Green', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-dual-blue-green.jpg' },
  { sku: 'PLA-MTD175B-GZ1Y1', material: 'PLA-Matte Dual', color: 'Green Purple', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-dual-green-purple.jpg' },
  { sku: 'PLA-MTD175B-UZ1Y1', material: 'PLA-Matte Dual', color: 'Blue Purple', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-matte-dual-blue-purple.jpg' },

  // PLA-Metal (2)
  { sku: 'PLA-Metal175J1Y1', material: 'PLA-Metal', color: 'Gold', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-metal-gold.jpg' },
  { sku: 'PLA-Metal175O-AB1Y1', material: 'PLA-Metal', color: 'Antique Brass', manufacturer: 'Esun', quantity: 10, image: '/filaments/pla-metal-antique-brass.jpg' },

  // PETG-CF (6)
  { sku: 'PETG-CF175D-U1TZ1', material: 'PETG-CF', color: 'Dark Blue', manufacturer: 'Esun', quantity: 10, image: '/filaments/petg-cf-dark-blue.jpg' },
  { sku: 'PETG-CF175D-H1TZ1', material: 'PETG-CF', color: 'Dark Grey', manufacturer: 'Esun', quantity: 10, image: '/filaments/petg-cf-dark-grey.jpg' },
  { sku: 'PETG-CF175B-BR1TZ1', material: 'PETG-CF', color: 'Black Red', manufacturer: 'Esun', quantity: 10, image: '/filaments/petg-cf-black-red.jpg' },
  { sku: 'PETG-CF175D-G1TZ1', material: 'PETG-CF', color: 'Dark Green', manufacturer: 'Esun', quantity: 10, image: '/filaments/petg-cf-dark-green.jpg' },
  { sku: 'PETG-CF175O-AB1TZ1', material: 'PETG-CF', color: 'Antique Brass', manufacturer: 'Esun', quantity: 10, image: '/filaments/petg-cf-antique-brass.jpg' },
  { sku: 'PETG-CF175B1TZ1', material: 'PETG-CF', color: 'Black', manufacturer: 'Esun', quantity: 10, image: '/filaments/petg-cf-black.jpg' }
];

// Final export: SKU_List with FOB + computed costPerGram (rounded to 2 decimals)
export const SKU_List = BASE_SKUS.map(sku => {
  const fobPerKg = FOB_BY_MATERIAL[sku.material] || 0;
  const costPerGram = parseFloat(((fobPerKg / 1000) * MARKUP_MULTIPLIER).toFixed(2));
  return { ...sku, fobPerKg, costPerGram };
});
