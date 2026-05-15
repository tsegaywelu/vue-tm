<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "@tanstack/vue-form";
import { useMutation } from "@tanstack/vue-query";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { login, fetch_current_user } from "../api/auth.api";
import type { LoginMode, LoginCredentials } from "../auth.types";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import { icons } from "@/utils/icons";
import PasswordInput from "@/components/form/PasswordInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const auth_store = useAuthStore();
const toast_store = useToastStore();

const login_mode = ref<LoginMode>("carrier");
const error_message = ref("");

const initivalue = {
  username: "",
  password: "",
};

const loginMutation = useMutation({
  mutationFn: (credentials: LoginCredentials) =>
    login(login_mode.value, credentials),
});

const toggle_mode = (mode: LoginMode) => {
  login_mode.value = mode;
  error_message.value = "";
};

async function submitLogin(values: any) {
  const res = await loginMutation.mutateAsync(values);
  if (!res.success || !res.data) {
    error_message.value = res.error || "Login failed. Please try again.";
    toast_store.error(res.error || "Login failed.");
    return;
  }
  const payload = res.data?.data as any;
  const accessToken =
    payload.accessToken || payload.token || payload.access_token;
  const refreshToken = payload.refreshToken || payload.refresh_token;

  if (!accessToken) {
    error_message.value = "Invalid token received from server.";
    toast_store.error("Login failed: Invalid server response.");
    console.error("Login response missing token. Data:", payload);
    return;
  }

  auth_store.set_tokens(accessToken, refreshToken);

  const userRes = await fetch_current_user();
  if (userRes.success) {
    auth_store.set_user(userRes.data);
  } else {
    console.warn("Could not fetch user profile details", userRes.error);
  }

  toast_store.success("Welcome back! Login successful.");

  const redirectPath = router.currentRoute.value.query.redirect as string;
  router.push(redirectPath || auth_store.get_default_home_route());
}
</script>

<template>
  <div class="min-h-screen flex bg-white font-sans overflow-hidden">
    <div class="hidden lg:block lg:w-1/2 relative">
      <img
        src="/login_background.png"
        alt="Logistics Background"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      <div class="absolute bottom-20 left-12 text-white z-10">
        <h1 class="text-6xl font-black mb-4 leading-tight">
          Streamlining <br />
          Global Logistics.
        </h1>
        <p class="text-xl text-white/80 max-w-md">
          Empowering carriers and shippers with real-time tracking, transparent
          operations, and seamless communication.
        </p>
      </div>
    </div>

    <!-- Right Panel: Login Form -->
    <div
      class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-beige-light/30"
    >
      <div class="w-full max-w-md space-y-10">
        <!-- Logo & Header -->
        <div class="text-center">
          <div class="inline-block p-4 bg-white rounded-3xl shadow-soft mb-6">
            <i class="h-12 w-auto block" v-html="icons['raaz-logo']"></i>
          </div>
          <h2 class="text-4xl font-extrabold text-grey-900 tracking-tight">
            Welcome Back
          </h2>
          <p class="text-grey-500 mt-2">
            Enter your details to access your dashboard
          </p>
        </div>

        <!-- Mode Toggle -->
        <div class="flex p-1.5 bg-grey-100 rounded-2xl">
          <button
            @click="toggle_mode('carrier')"
            class="flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300"
            :class="
              login_mode === 'carrier'
                ? 'bg-white text-primary shadow-sm'
                : 'text-grey-500 hover:text-grey-700'
            "
          >
            Carrier Login
          </button>
          <button
            @click="toggle_mode('shipper')"
            class="flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300"
            :class="
              login_mode === 'shipper'
                ? 'bg-white text-primary shadow-sm'
                : 'text-grey-500 hover:text-grey-700'
            "
          >
            Shipper Login
          </button>
        </div>

        <!-- Login Form -->
        <Form
          :sanitize_bypass="['password']"
          :onSubmit="submitLogin"
          :values="initivalue"
          id="login-form"
          class="space-y-6"
        >
          <Input
            name="username"
            label="Username"
            :attributes="{ placeholder: 'Enter your username' }"
          >
            <template #left_component>
              <i class="size-5 block text-grey-400" v-html="icons.users"></i>
            </template>
          </Input>

          <PasswordInput
            name="password"
            label="Password"
            :attributes="{ placeholder: 'Enter your password' }"
          />

          <!-- Action Buttons -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                class="size-4 rounded border-grey-300 text-primary focus:ring-primary"
              />
              <span
                class="text-sm font-medium text-grey-600 group-hover:text-primary transition-colors"
                >Remember me</span
              >
            </label>
            <a
              href="#"
              class="text-sm font-bold text-primary hover:text-primary-dark transition-colors underline-offset-4 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <div
            v-if="error_message"
            class="p-4 bg-red-50 border border-red-100 rounded-2xl"
          >
            <p class="text-sm text-red-600 font-medium text-center">
              {{ error_message }}
            </p>
          </div>

          <SubmitButton
            class_name="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
            <i
              class="size-5 grid place-items-center"
              v-html="icons.arrowIcon"
            ></i>
          </SubmitButton>
        </Form>

        <!-- Help Center -->
        <p
          class="text-center text-sm text-grey-500 flex items-center justify-center gap-1"
        >
          <span>Need help?</span>
          <a
            href="#"
            class="font-bold text-primary hover:underline flex items-center gap-1"
          >
            <i class="size-4 block" v-html="icons.info"></i>
            <span>Contact Support</span>
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-soft {
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.05);
}
</style>
