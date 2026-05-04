<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <div class="p-6">
        <ContractForm :form="form">
          <template #actions="{ addedRoutes, carrierId }">
            <Button variant="outline" @click="router.back()">Discard</Button>
            <SubmitButton
              :disabled="!carrierId || addedRoutes.length === 0"
            >
              Create Contract
            </SubmitButton>
          </template>
        </ContractForm>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';
import ContractForm from "../../components/settings/Contract/ContractForm.vue";
import Button from "@/components/Button.vue";
import Form from "@/components/form/Form.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { create_contract } from "../../api/settings.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();
const formId = "add-contract-form";

const initialValues = {
  carrier: '',
  routes: []
};



const mutation = useMutation({
  mutationFn: (data: any) => create_contract(data),
});

const handleSubmit = async (values: any) => {
  // Note: we'll get the addedRoutes from the form state or the component
  // But for now, let's assume we pass them through the form values if possible
  // However, ContractForm manages them internally in a ref.
  // I'll adjust ContractForm to sync with form state or just use the refs.
};
</script>
