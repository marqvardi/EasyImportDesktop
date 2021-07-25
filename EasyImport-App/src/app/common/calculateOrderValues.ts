import { IBasketItem } from "./../_models/basket";
import { OrderItemOverview } from "../_models/OrderOverview";

export const calculateTotalTaxesForSingleItem = async (
  orderItems: OrderItemOverview
) => {
  let ii = orderItems.price * orderItems.quantity * orderItems.ii;
  let ipi =
    (orderItems.price * orderItems.quantity +
      orderItems.price * orderItems.quantity * orderItems.ii) *
    orderItems.ipi;
  let pis = orderItems.price * orderItems.quantity * orderItems.pis;
  let cofins = orderItems.price * orderItems.quantity * orderItems.cofins;
  let totalAmountForProduct = orderItems.price * orderItems.quantity;

  const totalOrderPlusTaxes = totalAmountForProduct + ii + ipi + pis + cofins;

  const baseIcms = totalOrderPlusTaxes / 0.82;

  const icms = baseIcms * 0.18;

  return ii + ipi + pis + cofins + icms;
};

export const calculateAll = async (orderItems: OrderItemOverview[]) => {
  const orderValues = new OrderValues();

  orderValues.totalOrder = await totalOrder(orderItems);
  orderValues.totalTaxes = await calculateTaxes(
    orderItems,
    orderValues.totalOrder
  );
  orderValues.totalCBM = await calculateCbm(orderItems);
  orderValues.totalKgs = await calculateGrossWeight(orderItems);
  orderValues.totalItems = await totalItems(orderItems);

  return orderValues;
};

const totalItems = async (orderItem: OrderItemOverview[]): Promise<number> => {
  return orderItem.length;
}

const totalOrder = async (orderItems: OrderItemOverview[]): Promise<number> => {
  return orderItems.reduce((a, b) => b.price * b.quantity + a, 0);
};

const calculateTaxes = async (
  orderItems: OrderItemOverview[],
  totalOrder: number
) => {
  let totalTaxes = orderItems.reduce(
    (a, b) =>
      b.price * b.quantity * b.ii +
      (b.price * b.quantity + b.price * b.quantity * b.ii) * b.ipi +
      b.price * b.quantity * b.pis +
      b.price * b.quantity * b.cofins +
      a,
    0
  );

  const totalOrderPlusTaxes = totalOrder + totalTaxes;

  const baseIcms = totalOrderPlusTaxes / 0.82;

  const icms = baseIcms * 0.18;

  totalTaxes = totalTaxes + icms;

  return totalTaxes;
};

const calculateGrossWeight = async (orderItems: OrderItemOverview[]) => {
  return orderItems.reduce(
    (a, b) => (b.quantity / b.qtyPerCarton) * b.grossKgs + a,
    0
  );
};

const calculateCbm = async (orderItems: OrderItemOverview[]) => {
  return orderItems.reduce(
    (a, b) =>
      ((b.cartonDeepness * b.cartonHeight * b.cartonWidth) / 1000000) *
      (b.quantity / b.qtyPerCarton) +
      a,
    0
  );
};

export class OrderValues {
  totalOrder: number;
  totalTaxes: number;
  totalCBM: number;
  totalKgs: number;
  totalItems: number;
}
