export function parseSku(sku) {
  const manufacturer = sku.includes('Esun') ? 'Esun' : 'Unknown';
  return { manufacturer };
}
