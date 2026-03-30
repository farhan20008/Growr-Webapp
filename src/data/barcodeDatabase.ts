import { FoodItem } from './mockData';

// Simulated barcode → food mapping for common Bangladeshi packaged foods
export interface BarcodeFood extends FoodItem {
  barcode: string;
  brand?: string;
}

export const barcodeDatabase: BarcodeFood[] = [
  { barcode: '8901030793950', id: 'bc-horlicks', name: 'Horlicks (30g)', calories: 120, protein: 3, serving: '30g', category: 'dairy', brand: 'Horlicks' },
  { barcode: '8901764010015', id: 'bc-parle-g', name: 'Parle-G Biscuit (4pcs)', calories: 120, protein: 2, serving: '4 pieces', category: 'snack', brand: 'Parle' },
  { barcode: '8904004400682', id: 'bc-maggi', name: 'Maggi Noodles (1 pack)', calories: 310, protein: 7, serving: '1 pack', category: 'carb', brand: 'Maggi' },
  { barcode: '8901058851854', id: 'bc-amul-milk', name: 'Amul Milk (250ml)', calories: 120, protein: 8, serving: '250ml', category: 'dairy', brand: 'Amul' },
  { barcode: '8901725181093', id: 'bc-britannia', name: 'Britannia Bread', calories: 140, protein: 4, serving: '2 slices', category: 'carb', brand: 'Britannia' },
  { barcode: '8901262150040', id: 'bc-frooti', name: 'Frooti Mango (200ml)', calories: 90, protein: 0, serving: '200ml', category: 'fruit', brand: 'Frooti' },
  { barcode: '8906002490646', id: 'bc-soy-chunks', name: 'Nutrela Soy Chunks (50g)', calories: 170, protein: 26, serving: '50g', category: 'protein', brand: 'Nutrela' },
  { barcode: '8901491101189', id: 'bc-glucon-d', name: 'Glucon-D (100g)', calories: 380, protein: 0, serving: '100g', category: 'snack', brand: 'Glucon-D' },
];

export function lookupBarcode(barcode: string): BarcodeFood | null {
  return barcodeDatabase.find(item => item.barcode === barcode) || null;
}
