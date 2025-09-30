import { Column, Model, Table, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

export interface MessageCreationAttributes {
  text: string;
  userId: number;
}

@Table({
  tableName: 'message',
  timestamps: true,
})
export class Message extends Model<Message, MessageCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, field: 'message_id' })
  declare messageId: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare text: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'user_id' })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  declare createdAt: Date;
  declare updatedAt: Date;
}
