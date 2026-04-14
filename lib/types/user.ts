export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
};

export type AdminAccessResponse = {
  ok: true;
  user: { id: string; email: string; role: string };
};
