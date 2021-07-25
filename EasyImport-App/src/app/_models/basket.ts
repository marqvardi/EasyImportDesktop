import { v4 as uuidv4 } from "uuid";

export interface IBasket {
  id: string;
  items: IBasketItem[];
}

export interface IBasketItem {
  // id: number;
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
  grossKgs: number;
  qtyPerCarton: number;
  ii: number;
  ipi: number;
  pis: number;
  cofins: number;
  supplierId: number;
  productId: number;
}

export class Basket implements IBasket {
  id = uuidv4();
  items: IBasketItem[] = [];
}

export interface IBasketTotals {
  taxes: number;
  total: number;
  cbm: number;
  totalGrossKgs: number;
  totalItems: number
}
