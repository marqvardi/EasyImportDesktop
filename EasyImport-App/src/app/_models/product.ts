export class Product {
  id?: number;
  productCode: string;
  description: string;
  active?: boolean;
  image?: string;
  cartonWidth?: number;
  cartonHeight?: number;
  cartonDeepness?: number;
  netKgs?: number;
  grossKgs?: number;
  price?: number;
  qtyPerCarton?: number;
  supplierName?: string;
  ncmCode?: string;
  categoryName?: string;
  supplierId?: number;
  categoryId?: number;
  ncmId?: number;
  ii: number;
  ipi: number;
  pis: number;
  cofins: number;
}
