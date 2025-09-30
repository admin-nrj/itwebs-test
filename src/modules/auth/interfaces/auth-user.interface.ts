import { UserRole } from '../../../common/enums/user-role.enum';

export interface AuthUser {
  userId: number;
  email: string;
  name: string;
  role: UserRole;
}
