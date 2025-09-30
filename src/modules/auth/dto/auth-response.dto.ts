export class AuthResponseDto {
  accessToken: string;
  user: {
    userId: number;
    email: string;
    name: string;
    role: 'admin' | 'user';
  };
}
