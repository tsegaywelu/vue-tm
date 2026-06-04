<script setup lang="ts">
import { inject, onMounted, ref, reactive, watch } from "vue";
import SelectInput from "@/components/common/Select.vue";
import Input from "@/components/common/Input.vue";
import InputParent from "@/components/form/InputParent.vue";
import { genId } from "@/utils/utils";
import { icons } from "@/utils/icons";
import { required, number, validateArrayItems } from "@/utils/validations";

type PurchaseItem = {
  fakeId: string;
  item: string;
  itemName: string;
  quantity: number | string;
  leadTime: string;
  remark: string;
};

function newEmptyItem(): PurchaseItem {
  return {
    fakeId: genId.next().value as string,
    item: "",
    itemName: "",
    quantity: 1,
    leadTime: "",
    remark: "",
  };
}

const props = defineProps<{
  name: string;
  srvRef?: string;
}>();

const formContext = inject<any>("formContext");
const form = formContext?.form;
const items = ref<PurchaseItem[]>([]);

const errors = reactive<Record<string, string>>({});

const itemRules = {
  item: { required },
  quantity: { required, number },
};

onMounted(() => {
  const values: any[] = form?.getFieldValue(props.name);
  if (values && values.length > 0) {
    items.value = values.map((el) => {
      return {
        ...el,
        fakeId: el.fakeId || (genId.next().value as string),
      };
    });
  }
});

watch(
  items,
  () => {
    if (form) form.setFieldValue(props.name, items.value);
  },
  { deep: true },
);

// Watch for external changes to form field (e.g. from handleSRVSelect)
watch(
  () => form?.state.values[props.name],
  (newVal) => {
    if (newVal && newVal.length > 0 && JSON.stringify(newVal) !== JSON.stringify(items.value)) {
      items.value = newVal.map((el: any) => ({
        ...el,
        fakeId: el.fakeId || (genId.next().value as string),
      }));
    }
  },
  { deep: true },
);


function add() {
  const err = validateArrayItems(items.value, errors, itemRules);
  if (err) return;
  items.value.push(newEmptyItem());
}

function remove(id: string) {
  const idx = items.value.findIndex((el) => el.fakeId == id);
  if (idx == -1) return;
  items.value.splice(idx, 1);
}
</script>

<template>
  <InputParent
    :validation="{
      allValuesExist(values: PurchaseItem[]) {
        const err = validateArrayItems(values, errors, itemRules);
        return err ? [false, err] : [true, ''];
      },
    }"
    :name="props.name"
  >
    <div class="mt-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">Items to Purchase</h3>
      </div>

      <component
        v-if="form"
        :is="form.Subscribe"
        :selector="(state: any) => [state.values[props.name]]"
      >
        <template #default="[formItems]">
          <div tabindex="0" :data-name="props.name" class="space-y-4 rounded">
            <div
              v-for="(item, index) in items"
              :key="item.fakeId"
              class="p-5 bg-gray-50/50 border border-gray-100 rounded-2xl relative group shadow-sm"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="flex flex-col gap-1.5 lg:col-span-1">
                  <SelectInput
                    v-model="item.item"
                    label="Item Name"
                    :error="errors[`item_${item.fakeId}`]"
                    url="/inventory-items"
                    label_key="name"
                    value_key="_id"
                    searchable
                    :display_value="item.itemName"
                    :disabled="true"
                    @select="(opt: any) => (item.itemName = opt.label)"
                  />
                </div>
                <Input
                  v-model="item.quantity"
                  label="Quantity"
                  :error="errors[`quantity_${item.fakeId}`]"
                  type="number"
                  placeholder="0.00"
                />
                <Input
                  v-model="item.leadTime"
                  label="Lead Time"
                  placeholder="e.g. 2 weeks"
                />
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-medium text-gray-700">SRV No</label>
                  <div class="h-12 px-4 flex items-center bg-gray-50 rounded-xl border border-gray-100 text-gray-500 font-medium">
                    {{ props.srvRef || '-' }}
                  </div>
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
                class="absolute -top-2 -right-2 size-6 bg-surface border border-gray-100 text-error-600 rounded-full shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-50"
                @click="remove(item.fakeId)"
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
