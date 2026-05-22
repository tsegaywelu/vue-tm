<script setup lang="ts">
import { inject, onMounted, ref, reactive, watch } from "vue";
import { genId } from "@/utils/utils";
import InputParent from "@/components/form/InputParent.vue";
import Input from "@/components/common/Input.vue";
import BaseSelect from "@/components/common/Select.vue";
import { required, validateArrayItems } from "@/utils/validations";
import { icons } from "@/utils/icons";

type BankAccount = {
  fakeId: string;
  bank: string;
  accountNumber: string;
  preferred: boolean;
};

function newEmptyAccount(): BankAccount {
  return {
    fakeId: genId.next().value as string,
    bank: "",
    accountNumber: "",
    preferred: false,
  };
}

const props = defineProps<{
  name: string;
}>();

const formContext = inject<any>("formContext");
const form = formContext?.form;
const accounts = ref<BankAccount[]>([]);

const errors = reactive<Record<string, string>>({});

const accountRules = {
  bank: { required },
  accountNumber: { required },
};

onMounted(() => {
  const values: BankAccount[] = form?.getFieldValue(props.name);
  if (values && values.length > 0) {
    accounts.value = values.map((el) => ({
      ...el,
      fakeId: genId.next().value as string,
    }));
  } else {
    accounts.value = [];
  }
});

watch(
  accounts,
  () => {
    form.setFieldValue(props.name, accounts.value);
  },
  { deep: true },
);

function add() {
  const err = validateArrayItems(accounts.value, errors, accountRules, "fakeId", true);
  if (err) return;
  accounts.value.push(newEmptyAccount());
}

function remove(id: string) {
  const idx = accounts.value.findIndex((el) => el.fakeId === id);
  if (idx === -1) return;
  accounts.value.splice(idx, 1);
}
</script>

<template>
  <InputParent
    :validation="{
      allValuesExist(values: BankAccount[]) {
        const err = validateArrayItems(values, errors, accountRules, 'fakeId', true);
        return err ? [false, err] : [true, ''];
      },
    }"
    :name="props.name"
  >
    <div class="space-y-3">
      <h3 class="text-sm font-semibold text-gray-700">Bank Accounts</h3>

      <div tabindex="0" :data-name="props.name" class="space-y-3">
        <div
          v-for="account in accounts"
          :key="account.fakeId"
          class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 relative"
        >
          <BaseSelect
            v-model="account.bank"
            label="Bank"
            url="/bank"
            label_key="name"
            value_key="_id"
            :error="errors[`bank_${account.fakeId}`]"
            @update:model-value="errors[`bank_${account.fakeId}`] = ''"
          />

          <Input
            v-model="account.accountNumber"
            label="Account Number"
            :error="errors[`accountNumber_${account.fakeId}`]"
            @update:model-value="errors[`accountNumber_${account.fakeId}`] = ''"
            :attributes="{ placeholder: 'Enter account number' }"
          />

          <div class="flex items-center gap-2 mt-5">
            <input
              type="checkbox"
              :id="'preferred_' + account.fakeId"
              v-model="account.preferred"
              class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
            />
            <label
              :for="'preferred_' + account.fakeId"
              class="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Preferred
            </label>
          </div>

          <button
            type="button"
            class="absolute size-6 top-2 right-2 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
            @click="remove(account.fakeId)"
          >
            <i v-html="icons.close"></i>
          </button>
        </div>
      </div>

      <button
        type="button"
        class="mt-2 flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs hover:opacity-80 transition-opacity"
        @click="add()"
      >
        <i class="mdi mdi-plus-circle-outline text-lg"></i>
        Add Bank Account
      </button>
    </div>
  </InputParent>
</template>
