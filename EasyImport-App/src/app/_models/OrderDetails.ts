import { OrderItem } from "./orderItem";

export interface OrderDetails {
  id: number;
  invoiceNumber: string;
  referenceNumber: string;
  deliveryDate: Date;
  supplierId: number;
  orderCreated: Date;
  arrivalDate: Date;
  orderCompletedOn: Date;
  supplierName: string;
  total: number;
  totalTaxes: number;
  cbm: number;
  orderStatusName?: string;
  orderStatusId: number;
  depositAmount?: number;
  balanceAmount?: number;
  dateDepositPaid?: Date;
  dateBalancePaid?: Date;
  depositPaid?: boolean;
  balancePaid?: boolean;
  editable?: boolean;
  TotalValueAllOrders: number;
  orderItems: OrderItem[];
}
