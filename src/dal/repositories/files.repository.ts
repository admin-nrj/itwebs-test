import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { File } from '../../modules/files/entities/file.entity';
import { FilesRepositoryInterface } from '../interfaces/files-repository.interface';

@Injectable()
export class FilesRepository implements FilesRepositoryInterface {
  constructor(
    @InjectModel(File)
    private readonly fileModel: typeof File,
  ) {}

  async findAll(): Promise<File[]> {
    return await this.fileModel.findAll();
  }

  async findById(id: number): Promise<File | null> {
    return await this.fileModel.findByPk(id);
  }

  async create(data: File): Promise<File> {
    return await this.fileModel.create(data);
  }

  async createFile(path: string, name: string): Promise<File> {
    return await this.fileModel.create({ path, name });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.fileModel.destroy({ where: { fileId: id } });
    return result > 0;
  }
}
