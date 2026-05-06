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
        <div class="grid grid-cols-2 gap-4">
          <SelectInput
            name="type"
            label="Type"
            :options="[
              { label: 'Return', value: 'RETURN' },
              { label: 'Additional', value: 'ADDITIONAL' },
              { label: 'Expense', value: 'EXPENSE' },
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
            <div class="grid grid-cols-2 gap-4">
              <Input
                name="amount"
                label="Amount"
                type="number"
                :validation="{ required }"
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
          :attributes="{ placeholder: 'Enter Notes', rows: 3 }"
        />

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Attachment</label>
          <input
            type="file"
            @change="handleFileChange"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
          />
        </div>
      </div>
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="closeModal" type="button">
          Cancel
        </Button>
        <SubmitButton
          form-id="addSettlementForm"
          :loading="form.state.isSubmitting"
        >
          Add Transaction
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { add_transaction_to_advance } from "../../api/operation.api";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import TextareaInput from "@/components/form/TextareaInput.vue";

const props = defineProps<{
  data: { id: string; onSuccess: () => void };
}>();

const toast = useToastStore();
const selectedFile = ref<File | null>(null);

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
};

const handleSubmit = async (values: any) => {
  const formData = new FormData();
  formData.append("category", values.category);
  formData.append("amount", values.amount);
  if (values.liters) formData.append("liters", values.liters);
  if (values.subCategory) formData.append("subCategory", values.subCategory);
  if (values.notes) formData.append("notes", values.notes);

  if (selectedFile.value) {
    formData.append("attachment", selectedFile.value);
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
