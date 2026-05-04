<template>
  <FormModalParent
    :title="isEdit ? 'Edit Infraction Record' : 'Add Infraction Record'"
    :subtitle="
      isEdit
        ? 'Update driver infraction offense details.'
        : 'Submit a driver infraction offense for penalty processing.'
    "
    form-id="addInfractionForm"
    :values="formValues"
    :submit-handler="handleSubmit"
  >
    <template #center="{ form }">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectInput
          name="driver"
          label="Driver"
          url="/driver"
          :params="{ page: 1, limit: 100 }"
          label_key="firstName"
          value_key="_id"
          searchable
          :validation="{ required }"
        />

        <component
          :is="form.Subscribe"
          :selector="(state) => [state.values.driver]"
          v-slot="[driver]"
        >
          <SelectInput
            :key="driver"
            name="shipment"
            label="Shipment"
            :url="`/infraction/driver/${driver}/shipments`"
            :params="{ page: 1, limit: 100, activeOnly: false }"
            label_key="shipmentCode"
            value_key="_id"
            searchable
          />
        </component>

        <!-- <DateInput
          name="date"
          label="Infraction Date"
          :validation="{ required, lessThanToday }"
        />

        <Input
          name="location"
          label="Location / Place"
          :validation="{ required }"
          :attributes="{ placeholder: 'Enter Location of Offense' }"
        /> -->
      </div>

      <InfractionInput name="items" />

      <div class="mt-6">
        <TextareaInput name="notes" label="General Remarks / Context" />
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <SubmitButton
          form="addInfractionForm"
          :loading="mutation.isPending.value || updateMutation.isPending.value"
        >
          {{ isEdit ? "Update Infraction" : "Register Infraction" }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { closeModal } from "@customizer/modal-x";
import { useMutation } from "@tanstack/vue-query";
import { computed } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { lessThanToday, required } from "@/utils/validations";
import { add_infraction, update_infraction } from "../../api/infraction.api";
import { useToastStore } from "@/store/toastStore";
import InfractionInput from "../inputs/InfractionInput.vue";

export type Props = {
  driverId?: string;
  infraction?: any;
};

export type ReturnType = boolean;

const props = defineProps<{ data?: Props; close: (res: any) => void }>();

const toast = useToastStore();
const isEdit = computed(() => !!props.data?.infraction);

const mutation = useMutation({
  mutationFn: (payload: any) => add_infraction(payload),
});

const updateMutation = useMutation({
  mutationFn: ({ id, payload }: { id: string; payload: any }) =>
    update_infraction(id, payload),
});

const formValues = {
  driver:
    props.data?.infraction?.driverData?._id ||
    props.data?.infraction?.driver ||
    props.data?.driverId ||
    "",
  vehicle:
    props.data?.infraction?.vehicle?._id ||
    props.data?.infraction?.vehicle ||
    "",
  shipment:
    props.data?.infraction?.shipment?._id ||
    props.data?.infraction?.shipment ||
    "",
  date: props.data?.infraction?.createdAt
    ? new Date(props.data.infraction.createdAt).toISOString().split("T")[0]
    : props.data?.infraction?.date || new Date().toISOString().split("T")[0],
  location: props.data?.infraction?.location || "",
  items:
    props.data?.infraction?.items?.map((el: any) => ({
      title: el.title || el.reason || "",
      penaltyAmount: el.penaltyAmount || el.fine || "",
      description: el.description || "",
    })) || [],
  notes: props.data?.infraction?.notes || "",
};

async function handleSubmit(values: any) {
  // Compute subtotal from penalty amounts
  const totalAmount =
    values.items?.reduce(
      (acc: number, item: any) =>
        acc + (Number(item.penaltyAmount || item.fine) || 0),
      0,
    ) || 0;

  const payload: any = {
    driver: values.driver,
    items: values.items.map((item: any) => ({
      type: item.title || item.type,
      fine: Number(item.penaltyAmount || item.fine || 0),
    })),
  };

  if (values.shipment) {
    payload.shipment = values.shipment;
  }

  if (isEdit.value && props.data?.infraction?._id) {
    const res: any = await updateMutation.mutateAsync({
      id: props.data.infraction._id,
      payload,
    });
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Infraction updated successfully");
      props.close(true);
    } else {
      toast.error(res.error || "Failed to update infraction");
    }
  } else {
    const res: any = await mutation.mutateAsync(payload);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Infraction registered successfully");
      props.close(true);
    } else {
      toast.error(res.error || "Failed to submit infraction");
    }
  }
}
</script>
