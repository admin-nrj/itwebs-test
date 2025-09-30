import { Expose } from 'class-transformer';
import { UserRole } from '../../../common/enums/user-role.enum';

export class UserResponseDto {
  @Expose()
  userId: number;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  role: UserRole;
  @Expose()
  isActive: boolean;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
