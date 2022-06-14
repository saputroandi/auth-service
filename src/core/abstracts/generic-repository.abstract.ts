export abstract class IGenericRepository<T> {
  abstract create(payload: T): Promise<T>;

  abstract getAll(): Promise<T[]>;

  abstract get(id: string): Promise<T>;

  abstract edit(id: string, payload: T): Promise<T>;

  abstract delete(id: string): Promise<T>;
}
