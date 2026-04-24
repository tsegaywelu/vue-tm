import api from "@/utils/api";

export const update_tyre_status = async (
  id: string,
  status: string,
  data: any
) => {
  return await api.patch(`/tyre/${id}/${status}`, data);
};
