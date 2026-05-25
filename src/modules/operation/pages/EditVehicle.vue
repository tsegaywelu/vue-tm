<template>
  <div v-if="isLoading" class="flex justify-center py-20">
    <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
  </div>
  <template v-else-if="vehicle">
    <VehicleForm
      formId="edit-vehicle-form"
      mode="edit"
      :initial-values="mappedValues"
      :labels="labels"
      :onSubmit="handleSubmit"
    >
      <template #actions>
        <Button variant="secondary" size="md" @click="$router.back()">
          Cancel
        </Button>
        <SubmitButton> Save Changes </SubmitButton>
      </template>
    </VehicleForm>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import VehicleForm from "../components/VehicleForm.vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { fetch_vehicle_by_id, update_vehicle } from "../api/operation.api";
import { useToastStore } from "@/store/toastStore";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const vehicleId = route.params.id as string;

const { data: vehicleData, isLoading } = useQuery({
  queryKey: ["vehicle", vehicleId],
  queryFn: () => fetch_vehicle_by_id(vehicleId),
});

const vehicle = computed(() => vehicleData.value?.data);

const labels = computed<Record<string, string>>(() => {
  const v = vehicle.value as any;
  if (!v) return {} as Record<string, string>;
  const d = v.driver;
  return {
    vehicleType: v.vehicleType?.name || "",
    vehicleGroup: v.vehicleGroup?.name || "",
    type: v.type?.name || "",
    vehicleModel: v.vehicleModel?.name || "",
    maker: v.maker?.name || "",
    region: v.region?.name || "",
    transporter: v.transporter?.name || "",
    insurance_insurer: v.insuranceInformation?.insurer?.name || "",
    driver: d ? `${d.firstName} ${d.middleName || ""} ${d.lastName || ""}`.trim() : "",
  };
});

const toDate = (iso: string | undefined) =>
  iso ? new Date(iso).toISOString().split("T")[0] : "";

const mappedValues = computed(() => {
  if (!vehicle.value) return {};

  const v = vehicle.value;
  const mapped: Record<string, any> = {
    ...v,
    driver: v.driver?._id,
    vehicleType: v.vehicleType?._id,
    vehicleGroup: v.vehicleGroup?._id,
    vehicleModel: v.vehicleModel?._id,
    maker: v.maker?._id,
    region: v.region?._id,
    transporter: v.transporter?._id,
    type: v.type?._id,
    // Dates formatted for DateInput
    purchaseDate: toDate(v.purchaseDate),
    lastServiceDate: toDate(v.lastServiceDate),
    roadTaxExpireDate: toDate(v.roadTaxExpireDate),
    boloIssueDate: toDate(v.boloIssueDate),
    boloExpirationDate: toDate(v.boloExpirationDate),
    // Insurance mapping
    insurance_insuredDate: toDate(v.insuranceInformation?.insuredDate),
    insurance_insuredAmount: v.insuranceInformation?.insuredAmount,
    insurance_prePaymentAmount: v.insuranceInformation?.prePaymentAmount,
    insurance_lifespan: v.insuranceInformation?.lifespan,
    insurance_insurer: v.insuranceInformation?.insurer?._id,
  };

  if (v.ownership === "Leased" && v.lease) {
    mapped.leaseAmount = v.lease.amount;
    mapped.leaseStartDate = v.lease.startDate;
    mapped.leaseEndDate = v.lease.endDate;
    if (v.lease.leaseAgreement) {
      mapped.leaseCoversMaintenance = v.lease.leaseAgreement.coversMaintenance;
      mapped.leaseCoversAdvance = v.lease.leaseAgreement.coversAdvance;
    }
  }

  return mapped;
});

const mutation = useMutation({
  mutationFn: (payload: any) => update_vehicle(vehicleId, payload),
  onSuccess: (res: any) => {
    if (res.success) {
      toast.success("Vehicle updated successfully");
      queryClient.invalidateQueries({ queryKey: ["vehicle-list"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] });
      router.push("/vehicles");
    } else {
      toast.error(res.error || "Failed to update vehicle");
    }
  },
});

const handleSubmit = async (values: any) => {
  mutation.mutate(values);
};
</script>
