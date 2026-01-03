import type { Brand } from '@repo';

/**
 * Entity ID type for domain objects.
 * Will be extended with specific ID types (DocumentId, NoteId, etc.) in later phases.
 */
export type EntityId = Brand<string, 'EntityId'>;

/**
 * Creates a typed EntityId from a string.
 */
export function entityId(id: string): EntityId {
  return id as EntityId;
}

/**
 * Base interface for all domain entities.
 */
export interface Entity {
  readonly id: EntityId;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
