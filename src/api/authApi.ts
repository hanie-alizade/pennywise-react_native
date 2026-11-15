import { request } from "./client";
import type {
  AuthResponse,
  Credentials,
  Me,
  Tokens,
} from "@/types";

export const authApi = {
  register(credentials: Credentials): Promise<AuthResponse> {
    return request<AuthResponse>("POST", "/auth/register", {
      body: credentials,
      auth: false,
    });
  },

  login(credentials: Credentials): Promise<AuthResponse> {
    return request<AuthResponse>("POST", "/auth/login", {
      body: credentials,
      auth: false,
    });
  },

  refresh(refreshToken: string): Promise<Tokens> {
    return request<Tokens>("POST", "/auth/refresh", {
      body: { refreshToken },
      auth: false,
    });
  },

  logout(): Promise<void> {
    return request<void>("POST", "/auth/logout", {
      auth: true,
    });
  },

  getMe(): Promise<Me> {
    return request<Me>("GET", "/me", {
      auth: true,
    });
  },
};
