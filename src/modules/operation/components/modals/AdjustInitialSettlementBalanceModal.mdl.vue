<template>
  <FormModalParent
    title="Adjust Initial Settlement Balance"
    subtitle="Positive means the driver owes the company. Negative means the company owes the driver."
    form-id="adjustSettlementForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center>
      <div class="flex flex-col gap-4">
        <div class="bg-grey-25 rounded-2xl p-4 border border-grey-100">
          <p class="text-xs font-bold text-grey-500 uppercase tracking-wider mb-1">
            Current Balance
          </p>
          <p class="text-2xl font-black text-grey-900">
            {{ currencyFormatter(props.data.driver?.initialSettlementBalance ?? 0) }}
          </p>
          <p class="text-sm text-grey-500 mt-1">{{ balanceDirection }}</p>
        </div>

        <Input
          type="number"
          name="value"
          label="New Balance"
          :validation="{ required }"
          :attributes="{ placeholder: 'Enter new balance (negative allowed)', step: '0.01' }"
        />

        <TextareaInput
          name="reason"
          label="Reason"
          :validation="{ required }"
          :attributes="{ placeholder: 'Why is this balance being adjusted?', rows: 4, maxlength: 500 }"
        />

        <!-- History -->
        <div v-if="history?.length" class="mt-2">
          <p class="text-xs font-bold text-grey-500 uppercase tracking-wider mb-3">
            Adjustment History
          </p>
          <div class="overflow-x-auto rounded-2xl border border-grey-100">
            <table class="min-w-full text-sm">
              <thead class="bg-grey-25 text-left text-xs uppercase tracking-wide text-grey-500">
                <tr>
                  <th class="px-4 py-3">Changed At</th>
                  <th class="px-4 py-3">Changed By</th>
                  <th class="px-4 py-3">Previous</th>
                  <th class="px-4 py-3">New</th>
                  <th class="px-4 py-3">Delta</th>
                  <th class="px-4 py-3">Reason</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-grey-100 bg-white">
                <tr v-for="item in history" :key="item._id">
                  <td class="px-4 py-3 whitespace-nowrap text-grey-600">
                    {{ new Date(item.changedAt).toLocaleString() }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-grey-600">
                    {{ item.changedBy?.username || '-' }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-grey-600">
                    {{ currencyFormatter(item.previousValue) }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap font-bold text-grey-900">
                    {{ currencyFormatter(item.newValue) }}
                  </td>
                  <td
                    class="px-4 py-3 whitespace-nowrap font-bold"
                    :class="Number(item.delta) >= 0 ? 'text-red-600' : 'text-green-600'"
                  >
                    {{ Number(item.delta) > 0 ? '+' : '' }}{{ currencyFormatter(item.delta) }}
                  </td>
                  <td class="px-4 py-3 min-w-[200px] text-grey-600">{{ item.reason }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button size="md" variant="outline" @click="closeModal(false)">Cancel</Button>
        <SubmitButton>Save Adjustment</SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useMutation } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import { currencyFormatter } from "@/utils/utils";
import {
  adjust_initial_settlement_balance,
  fetch_initial_settlement_balance_history,
} from "../../api/operation.api";

export type Props = { driver: any };
export type ReturnType = boolean;

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();

const toast = useToastStore();
const history = ref<any[]>([]);

const initialValues = computed(() => ({
  value: props.data.driver?.initialSettlementBalance ?? 0,
  reason: "",
}));

const balanceDirection = computed(() => {
  const v = Number(props.data.driver?.initialSettlementBalance ?? 0);
  if (v > 0) return "Driver owes the company.";
  if (v < 0) return "Company owes the driver.";
  return "No opening settlement balance recorded.";
});

onMounted(async () => {
  try {
    const res = await fetch_initial_settlement_balance_history(props.data.driver._id);
    history.value = res?.data ?? [];
  } catch {
    // history is optional — silently ignore
  }
});

const mutation = useMutation({
  mutationFn: (payload: { value: number; reason: string }) =>
    adjust_initial_settlement_balance(props.data.driver._id, payload),
});

const handleSubmit = async (values: any) => {
  const payload = {
    value: Number(values.value),
    reason: String(values.reason || "").trim(),
  };

  if (!payload.reason) {
    toast.error("Reason is required.");
    return;
  }

  const res: any = await mutation.mutateAsync(payload);
  if (res.success || res.status === 200 || res.status === 201) {
    toast.success("Initial settlement balance updated successfully.");
    props.close(true);
  } else {
    toast.error(res.error || "Failed to update settlement balance.");
  }
};
</script>
