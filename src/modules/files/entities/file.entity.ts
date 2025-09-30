import { Column, Model, Table, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

export interface FileCreationAttributes {
  path: string;
  name: string;
}

@Table({
  tableName: 'file',
  timestamps: true,
})
export class File extends Model<File, FileCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    field: 'file_id',
  })
  declare fileId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'path',
  })
  declare path: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'name',
  })
  declare name: string;

  declare createdAt: Date;
  declare updatedAt: Date;
}
