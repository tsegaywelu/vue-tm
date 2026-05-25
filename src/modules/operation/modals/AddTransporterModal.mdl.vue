<template>
  <FormModalParent
    :title="transporter ? 'Edit Transporter' : 'Add Transporter'"
    :subtitle="
      transporter
        ? `Updating ${transporter.name}`
        : 'Create a new transporter profile'
    "
    form-id="addTransporterForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center>
      <div class="flex flex-col gap-6">
        <div class="grid grid-cols-2 gap-4">
          <Input
            name="name"
            label="Name"
            :attributes="{ placeholder: 'Transporter name' }"
            :validation="{ required }"
          />

          <Input
            name="tradeName"
            label="Trade Name"
            :attributes="{ placeholder: 'Trade Name' }"
            :validation="{ required }"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <Input
            name="phoneNumber"
            label="Phone Number"
            :attributes="{ placeholder: 'e.g. 09... or 9...' }"
            :validation="{ required, phone }"
          />

          <Input
            name="email"
            label="Email"
            :attributes="{ placeholder: 'Email address' }"
            :validation="{ email }"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <Input
            name="address"
            label="Address"
            :attributes="{ placeholder: 'Complete address' }"
          />

          <Input
            name="city"
            label="City"
            :attributes="{ placeholder: 'e.g. Addis Ababa' }"
            :validation="{ required }"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <SelectInput
            name="region"
            label="Region"
            :options="regionOptions"
            :attributes="{ placeholder: 'Select Region' }"
            :validation="{ required }"
          />

          <Input
            name="tin"
            label="TIN"
            :attributes="{ placeholder: 'Tax Identification Number' }"
          />
        </div>

        <SelectInput
          name="type"
          label="Type"
          :options="typeOptions"
          :attributes="{ placeholder: 'Select Type' }"
          :validation="{ required }"
        />

        <BankAccountInput name="bankAccount" />
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button variant="secondary" size="md" @click="closeModal(null)">
          Cancel
        </Button>
        <SubmitButton>
          {{ transporter ? "Update Transporter" : "Add Transporter" }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { closeModal } from "@customizer/modal-x";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required, email, phone } from "@/utils/validations";
import BankAccountInput from "../components/inputs/BankAccountInput.vue";
import { useToastStore } from "@/store/toastStore";
import { add_transporter, update_transporter } from "../api/operation.api";
import { useMutation } from "@tanstack/vue-query";

const props = defineProps<{
  data?: { transporter?: any };
  close: (res: any) => void;
}>();

const toast = useToastStore();
const transporter = computed(() => props.data?.transporter);

const initialValues = computed(() => {
  if (transporter.value) {
    return {
      name: transporter.value.name || "",
      tradeName: transporter.value.tradeName || "",
      phoneNumber: transporter.value.phoneNumber || "",
      email: transporter.value.email || "",
      address: transporter.value.address || "",
      city: transporter.value.city || "",
      region: transporter.value.region || "",
      tin: transporter.value.tin || "",
      type: transporter.value.type || "",
      bankAccount: (transporter.value.bankAccount || []).map((ba: any) => ({
        bank: ba.bank?._id || ba.bank || "",
        accountNumber: ba.accountNumber || "",
        preferred: ba.preferred || false,
      })),
    };
  }
  return {
    name: "",
    tradeName: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    region: "",
    tin: "",
    type: "",
    bankAccount: [],
  };
});

const regionOptions = [
  { label: "Addis Ababa", value: "Addis Ababa" },
  { label: "Afar", value: "Afar" },
  { label: "Amhara", value: "Amhara" },
  { label: "Benishangul-Gumuz", value: "Benishangul-Gumuz" },
  { label: "Dire Dawa", value: "Dire Dawa" },
  { label: "Gambela", value: "Gambela" },
  { label: "Harari", value: "Harari" },
  { label: "Oromia", value: "Oromia" },
  { label: "Sidama", value: "Sidama" },
  { label: "Somali", value: "Somali" },
  {
    label: "SNNPR",
    value: "Southern Nations, Nationalities, and Peoples' Region (SNNPR)",
  },
  { label: "Tigray", value: "Tigray" },
];

const typeOptions = [
  { label: "Long Term Sub Contract", value: "LTSC" },
  { label: "Short Term Sub Contract", value: "STSC" },
];

const createMutation = useMutation({
  mutationFn: (values: any) => add_transporter(values),
});

const updateMutation = useMutation({
  mutationFn: ({ id, values }: { id: string; values: any }) =>
    update_transporter(id, values),
});

function buildPayload(values: any) {
  return {
    ...values,
    bankAccount: (values.bankAccount || []).map((ba: any) => ({
      bank: ba.bank,
      accountNumber: ba.accountNumber,
      preferred: ba.preferred || false,
    })),
  };
}

async function handleSubmit(values: any) {
  const payload = buildPayload(values);
  if (transporter.value) {
    const res: any = await updateMutation.mutateAsync({
      id: transporter.value._id,
      values: payload,
    });
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Transporter updated successfully!");
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to update transporter");
    }
  } else {
    const res: any = await createMutation.mutateAsync(payload);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Transporter added successfully!");
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to add transporter");
    }
  }
}
</script>
