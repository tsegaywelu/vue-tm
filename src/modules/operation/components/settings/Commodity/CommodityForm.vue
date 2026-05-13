<template>
  <Colapsable
    title="Commodity Information"
    description="Provide details about the commodity."
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SelectInput
        name="shipper"
        label="Shipper"
        url="/shipper"
        label_key="name"
        value_key="_id"
        :validation="{ required }"
      />
      <Input
        name="name"
        label="Name"
        :validation="{ required }"
        :attributes="{
          placeholder:'Enter commodity name'
        }"
      />
    </div>
  </Colapsable>
</template>

<script setup lang="ts">
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";

defineProps<{}>();
</script>
