<template>
  <div class="flex flex-col gap-6">
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
    <div>
      <TextareaInput
        name="description"
        label="Description"
        :attributes="{
          placeholder: 'Enter description',
          rows: 3,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/SelectInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import { required } from "@/utils/validations";
import { fetch_inventory_categories } from "../../api/inventory.api";

// Fetch categories for the select input
const { data: categoriesResponse } = useQuery({
  queryKey: ["inventory-categories-all"],
  queryFn: () => fetch_inventory_categories({ limit: 100 }),
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
</script>
