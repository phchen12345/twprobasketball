import type { AuthUser } from "./user";

export type GoogleLoginResponse = {
  accessToken: string;
  csrfToken: string;
  refreshToken: string;
  user: AuthUser;
};
