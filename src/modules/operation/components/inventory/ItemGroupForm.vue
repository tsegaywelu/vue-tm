<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Item Group Information"
        description="Basic details about the item group and its category."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="name"
            label="Name"
            :attributes="{
              placeholder: 'Enter item group name',
            }"
            :validation="{
              required,
            }"
          />
          <Select
            name="category"
            label="Category"
            :options="categoryOptions"
            :validation="{
              required,
            }"
          />
        </div>
        <div class="mt-6">
          <TextareaInput
            name="description"
            label="Description"
            :attributes="{
              placeholder: 'Enter description',
              rows: 3,
            }"
          />
        </div>
      </Colapsable>

      <!-- Action Footer -->
      <div class="pt-10 flex justify-end gap-4">
        <slot :form="form" name="submit-btn"></slot>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/SelectInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";
import { fetch_inventory_categories } from "../../api/inventory.api";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

// Fetch categories for the select input
const { data: categoriesResponse } = useQuery({
  queryKey: ["inventory-categories-all"],
  queryFn: () => fetch_inventory_categories({ limit: 100 }), // Get enough categories
});

const categoryOptions = computed(() => {
  const categories = categoriesResponse.value?.data?.results || 
                    categoriesResponse.value?.data?.result || 
                    categoriesResponse.value?.data || [];
  
  return (Array.isArray(categories) ? categories : []).map((cat: any) => ({
    label: cat.name,
    value: cat._id,
  }));
});

const handleSubmit = async (values: any) => {
  await props.onSubmit(values);
};
</script>
