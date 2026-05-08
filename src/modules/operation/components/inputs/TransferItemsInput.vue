<script setup lang="ts">
import { inject, onMounted, ref, reactive, watch, onUnmounted } from "vue";
import SelectInput from "@/components/common/Select.vue";
import Input from "@/components/common/Input.vue";
import InputParent from "@/components/form/InputParent.vue";
import { genId, currencyFormatter } from "@/utils/utils";
import { icons } from "@/utils/icons";
import { required, number, validateArrayItems } from "@/utils/validations";
import InputError from "@/components/form/InputError.vue";

type TransferItem = {
  fakeId: string;
  item: string;
  itemName: string;
  inventoryType: "SERIALIZED" | "CONSUMABLE";
  quantity: number | string;
  price: number | string;
  serials: string[];
  remark: string;
  isManual?: boolean;
  hasSerials?: boolean;
};

function newEmptyItem(): TransferItem {
  return {
    fakeId: genId.next().value as string,
    item: "",
    itemName: "",
    inventoryType: "CONSUMABLE",
    quantity: 1,
    price: 0,
    serials: [],
    remark: "",
    isManual: true,
    hasSerials: false,
  };
}

const props = defineProps<{
  name: string;
  type: "ISSUE" | "RECEIVE";
}>();

const formContext = inject<any>("formContext");
const form = formContext?.form;
const items = ref<TransferItem[]>([]);

const errors = reactive<Record<string, string>>({});

const itemRules = {
  item: { required },
  price: { required, number },
  serials: {
    unique(val: string[], _rules: any, ctx: any) {
      if (!val || val.length === 0) return [true, ""];
      const allValues = ctx?.allValues || [];
      const filtered = val.filter((v) => !!v);

      // Check within this row
      const duplicatesInRow = filtered.filter(
        (item, idx) => filtered.indexOf(item) !== idx,
      );
      if (duplicatesInRow.length > 0) {
        return [
          false,
          `Duplicate serial numbers in this row: ${duplicatesInRow.join(", ")}`,
        ];
      }

      // Check across all rows
      const allSerials = ((allValues as TransferItem[]) || [])
        .flatMap((row) => row.serials || [])
        .filter((v) => !!v);
      const globalDuplicates = allSerials.filter(
        (item, idx) => allSerials.indexOf(item) !== idx,
      );

      if (globalDuplicates.some((d) => filtered.includes(d))) {
        const found = globalDuplicates.filter((d) => filtered.includes(d));
        return [
          false,
          `Serial numbers already used in another item: ${found.join(", ")}`,
        ];
      }

      return [true, ""];
    },
  },
};

const syncFromForm = (newVal: any) => {
  if (newVal && newVal.length > 0) {
    // Create a simplified version for comparison to avoid infinite loops
    const simplifiedNew = JSON.stringify(
      newVal.map((i: any) => ({
        item: i.item,
        quantity: i.quantity,
        serials: i.serials,
      })),
    );
    const simplifiedCurrent = JSON.stringify(
      items.value.map((i: any) => ({
        item: i.item,
        quantity: i.quantity,
        serials: i.serials,
      })),
    );

    if (simplifiedNew !== simplifiedCurrent) {
      items.value = newVal.map((el: any) => ({
        ...el,
        fakeId: el.fakeId || (genId.next().value as string),
        hasSerials:
          el.hasSerials ||
          el.inventoryType === "SERIALIZED" ||
          (el.serials && el.serials.length > 0),
        serials: el.serials || (el.inventoryType === "SERIALIZED" ? [""] : []),
      }));
    }
  } else if (newVal && newVal.length === 0 && items.value.length > 0) {
    items.value = [];
  }
};

let unsubscribe: (() => void) | undefined;

onMounted(() => {
  const values: any[] = form?.getFieldValue(props.name);
  syncFromForm(values);

  if (form?.store) {
    unsubscribe = form.store.subscribe(() => {
      const newVal = form.state.values[props.name];
      syncFromForm(newVal);
    });
  }
});

onUnmounted(() => {
  if (unsubscribe && typeof unsubscribe === "function") unsubscribe();
});

watch(
  items,
  () => {
    if (form) {
      form.setFieldValue(props.name, items.value);
    }
  },
  { deep: true },
);

function addSerial(item: TransferItem) {
  item.hasSerials = true;
  item.serials.push("");
  item.quantity = 0;
}

function removeSerial(item: TransferItem, idx: number) {
  item.serials.splice(idx, 1);
  if (item.serials.length === 0) {
    item.hasSerials = false;
    item.quantity = 1;
  }
}

function addItem() {
  items.value.push(newEmptyItem());
}

function removeItem(id: string) {
  const idx = items.value.findIndex((el) => el.fakeId === id);
  if (idx !== -1) items.value.splice(idx, 1);
}

function handleItemSelect(item: TransferItem, opt: any) {
  item.itemName = opt.label;
  item.inventoryType = opt.item?.inventoryType || "CONSUMABLE";
  item.hasSerials = item.inventoryType === "SERIALIZED";
  if (item.hasSerials) {
    item.serials = [""];
    item.quantity = 0;
  } else {
    item.serials = [];
    item.quantity = 1;
  }
}
</script>

<template>
  <InputParent
    :validation="{
      allValuesExist(values: TransferItem[]) {
        const err = validateArrayItems(values, errors, itemRules);
        return err ? [false, err] : [true, ''];
      },
    }"
    :name="props.name"
  >
    <div class="mt-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">Transfer Items</h3>
      </div>

      <component
        v-if="form"
        :is="form.Subscribe"
        :selector="(state: any) => [state.values[props.name]]"
      >
        <template #default="[formItems]">
          <div
            v-if="!formItems || formItems.length === 0"
            class="py-6 text-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 italic"
          >
            No items in this transfer. Items are loaded from the Store
            Requisition.
          </div>
          <div
            v-else
            tabindex="0"
            :data-name="props.name"
            class="space-y-4 rounded"
          >
            <div
              v-for="(item, index) in items"
              :key="item.fakeId"
              class="p-5 bg-gray-50/50 border border-gray-100 rounded-2xl relative group shadow-sm"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="flex flex-col gap-1.5 lg:col-span-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Item Name</label
                  >
                  <SelectInput
                    v-if="item.isManual"
                    v-model="item.item"
                    url="/inventory-items"
                    label_key="name"
                    value_key="_id"
                    searchable
                    placeholder="Select Item"
                    @select="(opt: any) => handleItemSelect(item, opt)"
                  />
                  <div
                    v-else
                    class="h-12 px-4 flex items-center bg-white rounded-xl border border-gray-200 text-gray-900 font-medium"
                  >
                    {{ item.itemName || "Loading..." }}
                  </div>
                </div>

                <!-- Quantity Logic -->
                <template v-if="item.hasSerials">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-gray-700">Quantity</label>
                    <div class="h-12 px-4 flex items-center bg-gray-50 rounded-xl border border-gray-200 text-gray-500 font-medium">
                      {{ item.serials.length }}
                    </div>
                  </div>
                </template>
                <template v-else>
                  <Input
                    v-model="item.quantity"
                    label="Quantity"
                    type="number"
                    placeholder="0.00"
                  />
                </template>

                <Input
                  v-model="item.price"
                  label="Unit Price"
                  :error="errors[`price_${item.fakeId}`]"
                  type="number"
                  placeholder="0.00"
                />

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700"
                    >Total Price</label
                  >
                  <div
                    class="h-12 px-4 flex items-center bg-white rounded-xl border border-gray-200 text-gray-900 font-bold"
                  >
                    {{
                      currencyFormatter(
                        (Number(item.price) || 0) *
                          (item.hasSerials
                            ? item.serials.length
                            : Number(item.quantity) || 0),
                      )
                    }}
                  </div>
                </div>

                <!-- Serialized Item Logic -->
                <template v-if="item.hasSerials">
                  <div class="col-span-full space-y-4">
                    <div class="flex items-center justify-between">
                      <span
                        class="text-sm font-bold text-gray-400 uppercase tracking-wider"
                        >Serial Numbers</span
                      >
                    </div>
                    <div
                      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                    >
                      <div
                        v-for="(sn, snIdx) in item.serials"
                        :key="snIdx"
                        class="flex items-center gap-2"
                      >
                        <div class="flex-1">
                          <!-- ISSUE: Select from available -->
                          <SelectInput
                            v-if="props.type === 'ISSUE'"
                            v-model="item.serials[snIdx]"
                            :url="`/inventory-items/${item.item}/availableSerialNumbers`"
                            label_key="serialNumber"
                            value_key="serialNumber"
                            placeholder="Select Serial"
                            searchable
                          />
                          <!-- RECEIVE: Manual Input -->
                          <Input
                            v-else
                            v-model="item.serials[snIdx]"
                            placeholder="Enter Serial #"
                          />
                        </div>
                        <button
                          v-if="item.serials.length > 1"
                          type="button"
                          @click="removeSerial(item, snIdx)"
                          class="size-10 flex items-center justify-center text-error-500 hover:bg-error-50 rounded-xl"
                        >
                          <i v-html="icons.delete" class="size-4" />
                        </button>
                      </div>
                    </div>
                    <InputError :error="errors[`serials_${item.fakeId}`]" />
                  </div>
                </template>


                <div class="col-span-full flex items-center justify-between">
                  <button
                    type="button"
                    @click="addSerial(item)"
                    class="text-xs font-bold px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors"
                  >
                    + Add Serial Number
                  </button>
                </div>

                <div class="col-span-full">
                  <Input
                    v-model="item.remark"
                    label="Remark"
                    placeholder="Enter remark"
                  />
                </div>
              </div>

              <button
                v-if="items.length > 1"
                type="button"
                class="absolute -top-2 -right-2 size-6 bg-white border border-gray-100 text-error-600 rounded-full shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-50"
                @click="removeItem(item.fakeId)"
              >
                <i v-html="icons.delete" class="*:size-3" />
              </button>
            </div>
          </div>
        </template>
      </component>
    </div>
  </InputParent>
</template>
