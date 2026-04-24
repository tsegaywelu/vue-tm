import { getApi } from "@/utils/utils";
import type { Order } from "../operation.types";

const api = getApi("/order");

export function fetch_order_by_id(id: string) {
  return api.addAuthenticationHeader().get<Order>(`/${id}`);
}
