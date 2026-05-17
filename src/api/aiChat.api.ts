import { getApi } from "@/utils/getApi";

const api = getApi("/v1/ai-chat");

export interface ChatMessage {
  role: "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: { id: string; type: string; function: { name: string; arguments: string } }[];
  tool_call_id?: string;
}

export interface SendMessageResponse {
  conversationId: string;
  reply: string;
}

export interface GetConversationResponse {
  conversationId: string;
  messages: ChatMessage[];
}

export function sendMessage(message: string, conversationId?: string) {
  api.addAuthenticationHeader();
  return api.post<SendMessageResponse>("/", { message, conversationId });
}

export function getConversation(conversationId: string) {
  api.addAuthenticationHeader();
  return api.get<GetConversationResponse>(`/${conversationId}`);
}

export function deleteConversation(conversationId: string) {
  api.addAuthenticationHeader();
  return api.delete(`/${conversationId}`);
}
