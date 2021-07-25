import { OrderDetails } from "./OrderDetails";
import { Category } from "./category";
import { Ncm } from "./ncm";
import { Supplier } from "./supplier";
import { Product } from "./product";
import { User } from "./user";
import { UserTeste } from "./UserTeste";
import { TotalValuesForOrders } from "./TotalValuesForOrders";

export interface IPaginationGeneric<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export class PaginationNcm implements IPaginationGeneric<Ncm> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: Ncm[] = [];
}

export class PaginationCategory implements IPaginationGeneric<Category> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: Category[] = [];
}

export class PaginationSupplier implements IPaginationGeneric<Supplier> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: Supplier[] = [];
}

export class PaginationProduct implements IPaginationGeneric<Product> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: Product[] = [];
}

export class PaginationOrder implements IPaginationGeneric<OrderDetails> {
  pageIndex: number;
  pageSize: number;
  count: number;
  totalValueForAllOrders: number;
  totalTaxesValueForAllOrders: number;
  totalValuesForOrders: TotalValuesForOrders;
  data: OrderDetails[] = [];
}

export class PaginationUser implements IPaginationGeneric<UserTeste> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: UserTeste[] = [];
}
