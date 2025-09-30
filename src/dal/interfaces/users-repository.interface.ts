import { User } from '../../modules/users/entities/user.entity';
import { BaseRepository } from './base-repository.interface';

export interface UsersRepositoryInterface extends BaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  updateUser(id: number, data: Partial<User>): Promise<User | null>;
}
