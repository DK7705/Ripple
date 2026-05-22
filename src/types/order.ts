export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  customer_name: string;
  item: string;
  quantity: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export type OrderEvent = {
  type: "INSERT" | "UPDATE" | "DELETE";
  record: Order;
  old_record?: Order;
  timestamp: string;
};
