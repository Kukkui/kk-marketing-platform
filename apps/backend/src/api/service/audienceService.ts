/**
 * Service layer for Audience feature.
 * Handles business logic for Audience CRUD operations.
 */

import { v4 as uuidv4 } from 'uuid';
import { Audience, AudiencePayload } from '../../shared/types/audienceTypes';

// In-memory storage (replace with a database in production)
const audiences: Audience[] = [];

/**
 * Creates a new audience.
 * @param payload - The audience data to create.
 * @returns The created audience.
 */
export function createAudience(payload: AudiencePayload): Audience {
  const audience: Audience = {
    id: uuidv4(),
    name: payload.name,
    subscriberCount: payload.subscriberCount,
  };
  audiences.push(audience);
  return audience;
}

/**
 * Retrieves all audiences.
 * @returns List of all audiences.
 */
export function getAllAudiences(): Audience[] {
  return audiences;
}

/**
 * Retrieves an audience by ID.
 * @param id - The audience ID.
 * @returns The audience if found, or undefined.
 */
export function getAudienceById(id: string): Audience | undefined {
  return audiences.find(audience => audience.id === id);
}

/**
 * Updates an audience by ID.
 * @param id - The audience ID.
 * @param payload - The updated audience data.
 * @returns The updated audience, or undefined if not found.
 */
export function updateAudience(id: string, payload: AudiencePayload): Audience | undefined {
  const index = audiences.findIndex(audience => audience.id === id);
  if (index === -1) return undefined;

  const updatedAudience = { ...audiences[index], ...payload };
  audiences[index] = updatedAudience;
  return updatedAudience;
}

/**
 * Deletes an audience by ID.
 * @param id - The audience ID.
 * @returns True if deleted, false if not found.
 */
export function deleteAudience(id: string): boolean {
  const index = audiences.findIndex(audience => audience.id === id);
  if (index === -1) return false;

  audiences.splice(index, 1);
  return true;
}