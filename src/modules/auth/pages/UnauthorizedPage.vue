<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { icons } from "@/utils/icons";

const router = useRouter();
const auth_store = useAuthStore();

const goHome = () => {
  router.push("/");
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-beige-light/30 px-4">
    <div class="max-w-lg w-full bg-surface rounded-3xl p-10 text-center shadow-soft">
      <div class="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8">
        <i class="size-12 text-red-500 block" v-html="icons.shieldAlert"></i>
      </div>
      
      <h1 class="text-4xl font-extrabold text-grey-900 tracking-tight mb-4">
        Access Denied
      </h1>
      
      <p class="text-grey-500 text-lg mb-8 leading-relaxed">
        You don't have permission to access this page. If you believe this is a mistake, please contact your administrator to update your role permissions.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          @click="goBack"
          class="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-grey-700 bg-grey-100 hover:bg-grey-200 transition-colors"
        >
          Go Back
        </button>
        <button
          @click="goHome"
          class="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          Return to Home
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05);
}
</style>
