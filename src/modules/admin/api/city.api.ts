import { getApi } from "@/utils/getApi";

const cityApi = getApi("/city");

export function deleteCity(id: string) {
  return cityApi.addAuthenticationHeader().delete(`/${id}`);
}
