<template>
  <FormModalParent
    title="Add Settlement Transaction"
    subtitle="Add a new transaction to this advance"
    form-id="addSettlementForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
  >
    <template #center="{ form }">
      <div class="flex flex-col gap-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            name="type"
            label="Type"
            :options="[
              { label: 'Return', value: 'return' },
              { label: 'Additional', value: 'additional' },
              { label: 'Expense', value: 'expense' },
            ]"
            :validation="{ required }"
          />
          <SelectInput
            name="category"
            label="Category"
            :options="[
              { label: 'Fuel', value: 'FUEL' },
              { label: 'Perdiem', value: 'PERDIEM' },
              { label: 'Other', value: 'OTHER' },
            ]"
            :validation="{ required }"
          />
        </div>

        <component
          :is="form.Subscribe"
          :selector="(state: any) => [state.values.category]"
        >
          <template #default="[category]">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="amount"
                label="Amount"
                type="number"
                step="any"
                :attributes="{
                  placeholder: 'Enter Amount',
                }"
                :validation="{ price, required }"
              />
              <Input
                v-if="category === 'FUEL'"
                name="liters"
                label="Liters"
                type="number"
                :validation="{ required }"
              />
              <SelectInput
                v-if="category === 'OTHER'"
                name="subCategory"
                label="Expense Type"
                url="/expense-type"
                label_key="name"
                value_key="_id"
                :validation="{ required }"
              />
            </div>
          </template>
        </component>

        <TextareaInput
          name="notes"
          label="Notes"
          type="textarea"
          :attributes="{ placeholder: 'Enter Description', rows: 3 }"
        />

        <FileInput name="attachment" label="Attachment" />
      </div>
    </template>
    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="closeModal(false)">
          Cancel
        </Button>
        <SubmitButton form="addSettlementForm"> Add Transaction </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import FileInput from "@/components/form/FileInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { price, required } from "@/utils/validations";
import { add_transaction_to_advance } from "../../api/operation.api";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import TextareaInput from "@/components/form/TextareaInput.vue";

const props = defineProps<{
  data: { id: string; onSuccess: () => void };
}>();

const toast = useToastStore();

const handleSubmit = async (values: any) => {
  const formData = new FormData();
  formData.append("category", values.category);
  formData.append("amount", values.amount);
  if (values.liters) formData.append("liters", values.liters);
  if (values.subCategory) formData.append("subCategory", values.subCategory);
  if (values.notes) formData.append("notes", values.notes);

  if (values.attachment && values.attachment instanceof File) {
    formData.append("attachment", values.attachment);
  }

  try {
    const res = await add_transaction_to_advance(
      props.data.id,
      values.type,
      formData,
    );
    if (res.status === 200 || res.status === 201) {
      toast.success("Transaction added successfully");
      props.data.onSuccess();
      closeModal();
    } else {
      toast.error("Failed to add transaction");
    }
  } catch (error: any) {
    toast.error(error.response?.data?.description || "An error occurred");
  }
};
</script>
