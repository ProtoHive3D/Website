import { SKU_List } from './skuList';

const MATERIAL_DESCRIPTIONS = {
  'PLAplus': ['Everyday reliability', 'Smooth surface finish'],
  'PLA-Luminous': ['Glows in the dark', 'Vibrant color core'],
  'PLA-Matte': ['Soft, muted tones', 'Low-gloss texture'],
  'PLA-Matte Rainbow': ['Gradient transitions', 'Playful color blends'],
  'PLA-Matte Dual': ['Split-tone effect', 'Matte finish pairing'],
  'PLA-Metal': ['Metallic shimmer', 'Premium visual weight'],
  'PETG-CF': ['Impact resistant', 'Matte carbon texture']
};

// Separate markup for retail filament sales
const SHOP_MARKUP_MULTIPLIER = 2.25; // example: 2× FOB for shop retail

// MAP prices (USD per kg) — add materials here as you confirm them
const MAP_PRICES = {
  'PLAplus': 16.99
  // e.g. 'PLA-Matte': 18.50
};

export const materials = [...new Set(SKU_List.map(s => s.material))].map(mat => {
  const skusForMaterial = SKU_List.filter(s => s.material === mat);

  // FOB per kg from skuList.js (same for all colors of a material)
  const fobPerKg = skusForMaterial[0]?.fobPerKg || 0;

  // Shop retail price per kg (different multiplier than print service)
  let shopPricePerKg = parseFloat((fobPerKg * SHOP_MARKUP_MULTIPLIER).toFixed(2));

  // Apply MAP constraint if applicable
  if (MAP_PRICES[mat] && shopPricePerKg < MAP_PRICES[mat]) {
    shopPricePerKg = MAP_PRICES[mat];
  }

  const colors = skusForMaterial.map(s => ({
    name: s.color,
    sku: s.sku,
    image: s.image
  }));

  const fallbackImage =
    colors.find(c => c.name === 'Black')?.image ||
    colors[0]?.image ||
    '/filaments/default.jpg';

  return {
    id: mat,
    name: mat,
    description: MATERIAL_DESCRIPTIONS[mat] || [],
    image: fallbackImage,
    price: shopPricePerKg, // shop retail price per kg (MAP protected)
    colors
  };
});