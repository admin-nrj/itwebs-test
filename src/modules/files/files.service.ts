import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { File } from './entities/file.entity';
import type { FilesRepositoryInterface } from '../../dal/interfaces/files-repository.interface';
import { FILES_REPOSITORY_TOKEN } from '../../dal/tokens/repository.tokens';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(
    @Inject(FILES_REPOSITORY_TOKEN)
    private readonly filesRepository: FilesRepositoryInterface,
  ) {}

  async create(path: string, name: string, buffer: Buffer): Promise<File> {
    await fs.mkdir(path, { recursive: true });
    const filePath = join(path, name);
    await fs.writeFile(filePath, buffer);
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
    const file = await this.filesRepository.findById(fileId);
    if (!file) {
      throw new NotFoundException(`Файл с ID ${fileId} не найден`);
    }

    const filePath = join(file.path, file.name);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }

    await this.filesRepository.delete(fileId);
  }
}
