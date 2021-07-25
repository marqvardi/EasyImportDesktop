import { OrderItem } from "./orderItem";
export class OrderOverview {
  id: number;
  invoiceNumber: string;
  referenceNumber: string;
  deliveryDate: Date;
  orderCreated: Date;
  arrivalDate?: Date;
  orderCompletedOn: Date;
  supplierName: string;
  orderStatusId;
  number;
  orderItems: OrderItemOverview[];
}

export class OrderItemOverview {
  id: number;
  orderId: number;
  productId: number;
  supplierId: number;
  supplierName: string;
  productCode: string;
  pictureUrl: string;
  description: string;
  price: number;
  quantity: number;
  cartonWidth: number;
  cartonHeight: number;
  cartonDeepness: number;
  netKgs: number;
  grossKgs: number;
  qtyPerCarton: number;
  ii: number;
  ipi: number;
  pis: number;
  cofins: number;
}
