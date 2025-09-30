import { UserRole } from '../../../common/enums/user-role.enum';

export class UserResponseDto {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
