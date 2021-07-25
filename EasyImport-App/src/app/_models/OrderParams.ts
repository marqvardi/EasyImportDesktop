export class OrderParams {
  sort = "referenceAsc";
  pageIndex = 1;
  pageSize = 10;
  search: string;
  supplierId: number = 0;
  orderStatusId: number = 1;
}
