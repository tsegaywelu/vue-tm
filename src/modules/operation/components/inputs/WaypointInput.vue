<script setup lang="ts">
import SelectInput from "@/components/common/Select.vue";
import Input from "@/components/common/Input.vue";
import { inject, onMounted, ref, reactive, watch } from "vue";
import { genId } from "@/utils/utils";
import InputParent from "@/components/form/InputParent.vue";
import { required, number, validateArrayItems } from "@/utils/validations";
import { icons } from "@/utils/icons";

type Waypoint = {
  fakeId: string;
  name: string;
  distance: string;
  perDiemDays: string;
  TAT: string;
  AFU: string;
  otherAmount: string;
  isActive: boolean;
  isDefault: boolean;
  roadTypes: string[];
  terrainTypes: string[];
};

function newEmptyItem(): Waypoint {
  return {
    fakeId: genId.next().value as string,
    name: "",
    distance: "",
    perDiemDays: "",
    TAT: "",
    AFU: "",
    otherAmount: "",
    isActive: true,
    isDefault: false,
    roadTypes: [],
    terrainTypes: [],
  };
}

const props = defineProps<{
  name: string;
}>();

const formContext = inject<any>("formContext");
const form = formContext?.form;
const items = ref<Waypoint[]>([]);

// Reactive error map: keys like "name_0", "distance_0", etc.
const errors = reactive<Record<string, string>>({});

// Declarative validation rules per field
const itemRules = {
  name: { required },
  distance: { required, number },
};

onMounted(() => {
  const values: Waypoint[] = form?.getFieldValue(props.name);
  if (values && values.length > 0) {
    items.value = values.map((el) => {
      return {
        ...el,
        fakeId: genId.next().value as string,
      };
    });
  } else {
    items.value = [newEmptyItem()];
  }
});

watch(
  items,
  () => {
    form.setFieldValue(props.name, items.value);
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
      allValuesExist(values: Waypoint[]) {
        const err = validateArrayItems(values, errors, itemRules);
        return err ? [false, err] : [true, ''];
      },
    }"
    :name="props.name"
  >
    <div class="mt-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900">Waypoints</h3>
      </div>

      <div tabindex="0" :data-name="props.name" class="space-y-4 rounded">
        <div
          v-for="(item, index) in items"
          :key="item.fakeId"
          class="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl relative"
        >
          <div
            class="flex items-center gap-2 mb-4 text-sm font-bold text-gray-700"
          >
            <span
              class="inline-flex items-center justify-center bg-gray-200 w-6 h-6 rounded-full bg-brightBlue-dark text-xs"
            >
              {{ index + 1 }}
            </span>
            {{ item.name || "New Waypoint" }}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              v-model="item.name"
              label="Waypoint Name"
              :error="errors[`name_${item.fakeId}`]"
              :attributes="{
                placeholder: 'Enter name',
              }"
            />
            <Input
              v-model="item.distance"
              label="Distance"
              :error="errors[`distance_${item.fakeId}`]"
              type="number"
              :attributes="{
                placeholder: 'Enter distance',
              }"
            />
            <Input
              v-model="item.perDiemDays"
              label="Perdiem Days"
              :error="errors[`perDiemDays_${item.fakeId}`]"
              type="number"
              :attributes="{
                placeholder: 'Enter perdiem days',
              }"
            />
            <Input
              v-model="item.TAT"
              label="Turn Around Time (TAT)"
              :error="errors[`TAT_${item.fakeId}`]"
              type="number"
              :attributes="{
                placeholder: 'Enter TAT',
              }"
            />
            <Input
              v-model="item.AFU"
              label="Avg Fuel Usage (AFU)"
              :error="errors[`AFU_${item.fakeId}`]"
              type="number"
              :attributes="{
                placeholder: 'Enter AFU',
              }"
            />
            <Input
              v-model="item.otherAmount"
              label="Other Amount"
              :error="errors[`otherAmount_${item.fakeId}`]"
              type="number"
              :attributes="{
                placeholder: 'Enter other amount',
              }"
            />

            <SelectInput
              v-model="item.roadTypes"
              label="Road Types"
              :error="errors[`roadTypes_${item.fakeId}`]"
              url="/road-type"
              label_key="name"
              value_key="_id"
              multiple
              searchable
              :attributes="{ placeholder: 'Select road types' }"
            />

            <SelectInput
              v-model="item.terrainTypes"
              label="Terrain Types"
              :error="errors[`terrainTypes_${item.fakeId}`]"
              url="/terrain-type"
              label_key="name"
              value_key="_id"
              multiple
              searchable
              :attributes="{ placeholder: 'Select terrain types' }"
            />

            <div class="flex flex-col gap-6 mt-4 md:flex-row">
              <!-- Custom Toggle for Is Active -->
              <div
                class="cursor-pointer flex items-center gap-3 w-fit"
                @click="item.isActive = !item.isActive"
              >
                <div
                  class="relative transition-all duration-100 p-[1.33px] rounded-full h-4 w-7.5"
                  :class="
                    item.isActive
                      ? 'primary-gradient bg-blue-600'
                      : 'bg-[#F5F7F1]'
                  "
                >
                  <div
                    class="absolute rounded-full transition-all duration-100 h-[13.3px] w-[13.3px] bg-white"
                    :class="item.isActive ? 'left-[15px]' : 'left-px'"
                    style="
                      box-shadow:
                        0px 1.33px 2.67px -1.33px #0a0d120f,
                        0px 2.67px 4px -0.67px #0a0d121a;
                    "
                  ></div>
                </div>
                <span class="text-base text-gray-600 select-none"
                  >Is Active</span
                >
              </div>

              <!-- Custom Toggle for Is Default -->
              <div
                class="cursor-pointer flex items-center gap-3 w-fit"
                @click="item.isDefault = !item.isDefault"
              >
                <div
                  class="relative transition-all duration-100 p-[1.33px] rounded-full h-4 w-7.5"
                  :class="
                    item.isDefault
                      ? 'primary-gradient bg-blue-600'
                      : 'bg-[#F5F7F1]'
                  "
                >
                  <div
                    class="absolute rounded-full transition-all duration-100 h-[13.3px] w-[13.3px] bg-white"
                    :class="item.isDefault ? 'left-[15px]' : 'left-px'"
                    style="
                      box-shadow:
                        0px 1.33px 2.67px -1.33px #0a0d120f,
                        0px 2.67px 4px -0.67px #0a0d121a;
                    "
                  ></div>
                </div>
                <span class="text-base text-gray-600 select-none"
                  >Is Preferred</span
                >
              </div>
            </div>
          </div>

          <button
            v-if="items.length > 1"
            type="button"
            class="absolute size-5 top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
            @click="remove(item.fakeId)"
          >
            <span class="size-3" v-html="icons.times"></span>
          </button>
        </div>
      </div>

      <button
        type="button"
        class="mt-4 flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs"
        @click="add()"
      >
        Add Waypoint
      </button>
    </div>
  </InputParent>
</template>
