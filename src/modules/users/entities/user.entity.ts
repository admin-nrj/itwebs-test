import { Column, Model, Table, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

export interface UserCreationAttributes {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
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

  @Column({ type: DataType.ENUM('admin', 'user'), allowNull: false, defaultValue: 'user' })
  declare role: 'admin' | 'user';

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  declare createdAt: Date;
  declare updatedAt: Date;
}
