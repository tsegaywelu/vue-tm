import { defineStore } from "pinia";
import { ref } from "vue";
import { getConversation, type ChatMessage } from "@/api/aiChat.api";

const STORAGE_KEY = "ai_chat_session";
const TTL = 24 * 60 * 60 * 1000;

function readStorage(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { id, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > TTL) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return id as string;
  } catch {
    return null;
  }
}

function writeStorage(id: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ id, timestamp: Date.now() }));
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

export const useChatStore = defineStore("chat", () => {
  const messages = ref<ChatMessage[]>([]);
  const conversationId = ref<string | null>(readStorage());
  const isLoadingHistory = ref(false);

  async function init() {
    if (!conversationId.value) return;
    // Messages already in memory — same session, no fetch needed
    if (messages.value.length > 0) return;

    isLoadingHistory.value = true;
    const res = await getConversation(conversationId.value);
    isLoadingHistory.value = false;

    if (res.success && res.data) {
      messages.value = res.data.messages.filter(
        (m) => m.role === "user" || m.role === "assistant",
      );
    } else {
      // Expired on server — reset
      conversationId.value = null;
      clearStorage();
    }
  }

  function setConversationId(id: string) {
    conversationId.value = id;
    writeStorage(id);
  }

  function addMessage(msg: ChatMessage) {
    messages.value.push(msg);
  }

  function clear() {
    messages.value = [];
    conversationId.value = null;
    clearStorage();
  }

  return {
    messages,
    conversationId,
    isLoadingHistory,
    init,
    setConversationId,
    addMessage,
    clear,
  };
});
