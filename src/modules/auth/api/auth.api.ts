import { getApi } from "@/utils/getApi";
import type { LoginCredentials, AuthResponse, LoginMode } from "../auth.types";

const api = getApi("/auth");

export function login(mode: LoginMode, credentials: LoginCredentials) {
  const endpoint = mode === "carrier" ? "/signin/carrier" : "/signin/shipper";
  return api.post<AuthResponse>(endpoint, credentials);
}

export function fetch_current_user() {
  return api.addAuthenticationHeader().get<any>("/currentUser");
}

export function change_password(data: { oldPassword: string; newPassword: string }) {
  return api.addAuthenticationHeader().post("/changePassword", data);
}
