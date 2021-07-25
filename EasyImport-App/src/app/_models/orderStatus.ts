export interface OrderStatus {
  id: number;
  status: string;
}

export const orderStatusList = [
  { id: 1, status: "In production" },
  { id: 2, status: "On the sea" },
  { id: 3, status: "At port" },
  { id: 4, status: "Completed" },
];
