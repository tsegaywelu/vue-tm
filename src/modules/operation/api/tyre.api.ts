import { getApi } from "@/utils/getApi";

const tyre_api = getApi("/tyre");

export const update_tyre_status = async (
  id: string,
  status: string,
  data: any
) => {
  return await tyre_api.addAuthenticationHeader().patch(`/${id}/${status}`, data);
};
