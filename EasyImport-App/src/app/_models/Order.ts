import { IBasket } from "./basket";
import { OrderDetails } from "./OrderDetails";
export class Order {
  orderDetails: OrderDetails;
  basket: IBasket;
}
