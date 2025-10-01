import { UserRole } from '../../../common/enums/user-role.enum';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: number;
    email: string;
    name: string;
    role: UserRole;
  };
}
