import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../modules/users/entities/user.entity';
import { UsersRepositoryInterface } from '../interfaces/users-repository.interface';

@Injectable()
export class UsersRepository implements UsersRepositoryInterface {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.findAll();
  }

  async findById(id: number): Promise<User | null> {
    return await this.userModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ where: { email } });
  }

  async create(data: User): Promise<User> {
    return await this.userModel.create(data);
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | null> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      return null;
    }
    return await user.update(data);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userModel.destroy({ where: { userId: id } });
    return result > 0;
  }
}
