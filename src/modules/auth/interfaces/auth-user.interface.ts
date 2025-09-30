export interface AuthUser {
  userId: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
}
