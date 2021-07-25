export interface OrderItem {
  id: number;
  productCode: string;
  description: string;
  price: number;
  quantity: number;
  pictureUrl: string;
  category: string;
  ncm: string;
  supplier: string;
  cartonDeepness: number;
  cartonHeight: number;
  cartonWidth: number;
  qtyPerCarton: number;
  ii: number;
  ipi: number;
  pis: number;
  cofins: number;
  supplierId: number;
  productId: number;
}
