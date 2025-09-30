import { plainToInstance, ClassConstructor } from 'class-transformer';
import type { Model } from 'sequelize-typescript';

function toPlain<Entity>(entity: Entity): unknown {
  if (entity && typeof entity === 'object' && 'get' in (entity as Record<string, unknown>)) {
    const model = entity as unknown as Model;
    if (typeof model.get === 'function') {
      return model.get({ plain: true });
    }
  }

  if (entity && typeof entity === 'object' && 'toJSON' in (entity as Record<string, unknown>)) {
    const json = (entity as unknown as { toJSON: () => unknown }).toJSON;
    if (typeof json === 'function') {
      return json.call(entity);
    }
  }

  return entity;
}

export function toDto<Dto, Entity>(dtoClass: ClassConstructor<Dto>, entity: Entity): Dto {
  const plain = toPlain(entity);
  return plainToInstance(dtoClass, plain, { excludeExtraneousValues: true });
}

export function toDtoArray<Dto, Entity>(dtoClass: ClassConstructor<Dto>, entities: Entity[]): Dto[] {
  return entities.map((entity) => toDto(dtoClass, entity));
}
