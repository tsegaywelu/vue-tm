<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import {
  sendMessage,
  deleteConversation,
  type ChatMessage,
} from "@/api/aiChat.api";

const emit = defineEmits<{ (e: "close"): void }>();

const messages = ref<ChatMessage[]>([]);
const inputText = ref("");
const conversationId = ref<string | null>(null);
const isSending = ref(false);
const messagesEl = ref<HTMLElement | null>(null);

watch(
  messages,
  () => {
    nextTick(() => {
      if (messagesEl.value)
        messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
    });
  },
  { deep: true },
);

async function send() {
  const text = inputText.value.trim();
  if (!text || isSending.value) return;

  messages.value.push({ role: "user", content: text });
  inputText.value = "";
  isSending.value = true;

  const res = await sendMessage(text, conversationId.value ?? undefined);

  if (res.success && res.data) {
    conversationId.value = res.data.conversationId;
    messages.value.push({ role: "assistant", content: res.data.reply });
  } else {
    messages.value.push({
      role: "assistant",
      content: "Something went wrong. Please try again.",
    });
  }

  isSending.value = false;
}

async function clearChat() {
  if (conversationId.value) await deleteConversation(conversationId.value);
  conversationId.value = null;
  messages.value = [];
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
}
</script>

<template>
  <div
    class="flex flex-col h-full bg-white border-l border-gray-200 overflow-hidden print-hide"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between px-4 py-3 bg-primary text-white shrink-0"
    >
      <div class="flex items-center gap-2">
        <div
          class="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
        </div>
        <span class="font-semibold text-sm">AI Assistant</span>
      </div>
      <div class="flex items-center gap-1">
        <button
          v-if="messages.length > 0"
          title="Clear chat"
          class="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          @click="clearChat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
        <button
          title="Close"
          class="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          @click="$emit('close')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div
      ref="messagesEl"
      class="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
    >
      <div
        v-if="messages.length === 0"
        class="flex-1 flex flex-col items-center justify-center text-center text-gray-400 gap-3 h-full py-12"
      >
        <div
          class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">How can I help you?</p>
          <p class="text-xs text-gray-400 mt-1">
            Ask me about shipments, orders, or vehicles.
          </p>
        </div>
      </div>

      <template v-for="(msg, i) in messages" :key="i">
        <div v-if="msg.role === 'user'" class="flex justify-end">
          <div
            class="max-w-[85%] bg-primary text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word"
          >
            {{ msg.content }}
          </div>
        </div>
        <div v-else-if="msg.role === 'assistant'" class="flex justify-start">
          <div
            class="max-w-[85%] bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word"
          >
            {{ msg.content }}
          </div>
        </div>
      </template>

      <div v-if="isSending" class="flex justify-start">
        <div
          class="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1"
        >
          <span
            class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style="animation-delay: 0ms"
          ></span>
          <span
            class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style="animation-delay: 150ms"
          ></span>
          <span
            class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style="animation-delay: 300ms"
          ></span>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="px-3 py-3 border-t border-gray-100 shrink-0">
      <div
        class="flex items-end gap-2 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2 focus-within:border-primary transition-colors"
      >
        <textarea
          v-model="inputText"
          placeholder="Type a message..."
          rows="1"
          class="flex-1 focus:shadow-none active:shadow-none! bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none max-h-24 leading-relaxed"
          :disabled="isSending"
          @keydown="onKeydown"
        ></textarea>
        <button
          class="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40"
          :class="
            inputText.trim()
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-gray-200 text-gray-400'
          "
          :disabled="!inputText.trim() || isSending"
          @click="send"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
      <p class="text-[10px] text-gray-400 text-center mt-1.5">
        Enter to send · Shift+Enter for newline
      </p>
    </div>
  </div>
</template>
