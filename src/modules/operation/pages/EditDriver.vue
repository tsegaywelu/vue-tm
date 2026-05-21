<template>
  <div v-if="isLoading" class="flex justify-center py-20">
    <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
  </div>
  <template v-else-if="driver">
    <DriverForm
      formId="edit-driver-form"
      :initial-values="mappedValues"
      :onSubmit="handleSubmit"
    >
      <template #actions="{ form }">
        <Button variant="secondary" size="md" @click="$router.back()">
          Cancel
        </Button>
        <SubmitButton :loading="mutation.isPending.value">
          Save Changes
        </SubmitButton>
      </template>
    </DriverForm>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import DriverForm from "../components/DriverForm.vue";
import { useQuery, useMutation } from "@tanstack/vue-query";
import { fetch_driver_by_id, update_driver } from "../api/operation.api";
import { useToastStore } from "@/store/toastStore";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const driverId = route.params.id as string;

const { data: driverResponse, isLoading } = useQuery({
  queryKey: ["driver", driverId],
  queryFn: () => fetch_driver_by_id(driverId),
});

const driver = computed(() => driverResponse.value?.data);

const mappedValues = computed(() => {
  if (!driver.value) return {};

  const d = driver.value;
  return {
    ...d,
    dateOfBirth: d.dateOfBirth ? d.dateOfBirth.split("T")[0] : "",
    employmentStartDate: d.employmentStartDate
      ? d.employmentStartDate.split("T")[0]
      : "",
    employmentEndDate: d.employmentEndDate
      ? d.employmentEndDate.split("T")[0]
      : "",
    drivingLicenceExpirationDate: d.drivingLicenceExpirationDate
      ? d.drivingLicenceExpirationDate.split("T")[0]
      : "",
    djiboutiEntranceIdExpirationDate: d.djiboutiEntranceIdExpirationDate
      ? d.djiboutiEntranceIdExpirationDate.split("T")[0]
      : "",
    contactPerson: d.contactPerson || { name: "", phone: "", address: "" },
  };
});

const mutation = useMutation({
  mutationFn: (payload: any) => update_driver(driverId, payload),
  onSuccess: (res: any) => {
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Driver updated successfully");
      router.push("/drivers");
    } else {
      toast.error(res.error || "Failed to update driver");
    }
  },
  onError: (error: any) => {
    toast.error(
      error.response?.data?.description ||
        "An error occurred while updating the driver.",
    );
  },
});

const handleSubmit = async (values: any) => {
  const {
    _id, name, ratingCount, hasUserAccount, initialSettlementBalance,
    regionHistory, createdAt, updatedAt, __v,
    ...rest
  } = values;

  const toDate = (v: any) => (v ? new Date(v) : undefined);

  const payload = {
    ...rest,
    carrier: rest.carrier?._id ?? rest.carrier,
    dateOfBirth: toDate(rest.dateOfBirth),
    drivingLicenceExpirationDate: toDate(rest.drivingLicenceExpirationDate),
    employmentStartDate: toDate(rest.employmentStartDate),
    employmentEndDate: toDate(rest.employmentEndDate),
  };

  await mutation.mutateAsync(payload);
};
</script>
