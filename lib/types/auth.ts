import type { AuthUser } from "./user";

export type GoogleLoginResponse = {
  accessToken: string;
  csrfToken: string;
  user: AuthUser;
};
