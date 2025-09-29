export interface BaseRepository<T, K = number> {
  findAll(): Promise<T[]>;
  findById(id: K): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  delete(id: K): Promise<boolean>;
}
