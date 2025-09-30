import { Column, Model, Table, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';
import { UserRole } from '../../../common/enums/user-role.enum';

export interface UserCreationAttributes {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  isActive?: boolean;
}

@Table({
  tableName: 'user',
  timestamps: true,
})
export class User extends Model<User, UserCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'user_id' })
  declare userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.ENUM(UserRole.ADMIN, UserRole.USER), allowNull: false, defaultValue: UserRole.USER })
  declare role: UserRole;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  declare createdAt: Date;
  declare updatedAt: Date;
}
