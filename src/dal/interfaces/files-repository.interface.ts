import { File } from '../../modules/files/entities/file.entity';
import { BaseRepository } from './base-repository.interface';

export interface FilesRepositoryInterface extends BaseRepository<File> {
  createFile(path: string, name: string): Promise<File>;
}
