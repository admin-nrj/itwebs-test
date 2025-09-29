import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { File } from './entities/file.entity';
import type { FilesRepositoryInterface } from '../../dal/interfaces/files-repository.interface';
import { FILES_REPOSITORY_TOKEN } from '../../dal/tokens/repository.tokens';

@Injectable()
export class FilesService {
  constructor(
    @Inject(FILES_REPOSITORY_TOKEN)
    private readonly filesRepository: FilesRepositoryInterface,
  ) {}

  async create(path: string, name: string): Promise<File> {
    return await this.filesRepository.createFile(path, name);
  }

  async findAll(): Promise<File[]> {
    return await this.filesRepository.findAll();
  }

  async findOne(fileId: number): Promise<File> {
    const file = await this.filesRepository.findById(fileId);
    if (!file) {
      throw new NotFoundException(`Файл с ID ${fileId} не найден`);
    }
    return file;
  }

  async remove(fileId: number): Promise<void> {
    const deleted = await this.filesRepository.delete(fileId);
    if (!deleted) {
      throw new NotFoundException(`Файл с ID ${fileId} не найден`);
    }
  }
}
