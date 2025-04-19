/**
 * Service layer for Audience feature.
 * Handles business logic for Audience CRUD operations using PostgreSQL.
 */

import pool from '../../config/db';
import { Audience, AudiencePayload } from '../../shared/types/audienceTypes';

/**
 * Creates a new audience.
 * @param payload - The audience data to create.
 * @returns The created audience.
 */
export async function createAudience(payload: AudiencePayload): Promise<Audience> {
  const query = `
    INSERT INTO audiences (name, first_name, last_name, email)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [payload.name, payload.firstName, payload.lastName, payload.email];
  const { rows } = await pool.query(query, values);
  return rows[0] as Audience;
}

/**
 * Retrieves all audiences.
 * @returns List of all audiences.
 */
export async function getAllAudiences(): Promise<Audience[]> {
  const query = 'SELECT * FROM audiences;';
  const { rows } = await pool.query(query);
  return rows as Audience[];
}

/**
 * Retrieves an audience by ID.
 * @param id - The audience ID.
 * @returns The audience if found, or undefined.
 */
export async function getAudienceById(id: number): Promise<Audience | undefined> {
  const query = 'SELECT * FROM audiences WHERE id = $1;';
  const { rows } = await pool.query(query, [id]);
  return rows.length > 0 ? (rows[0] as Audience) : undefined;
}

/**
 * Updates an audience by ID.
 * @param id - The audience ID.
 * @param payload - The updated audience data.
 * @returns The updated audience, or undefined if not found.
 */
export async function updateAudience(id: number, payload: AudiencePayload): Promise<Audience | undefined> {
  const query = `
    UPDATE audiences
    SET name = $1, first_name = $2, last_name = $3, email = $4
    WHERE id = $5
    RETURNING *;
  `;
  const values = [payload.name, payload.firstName, payload.lastName, payload.email, id];
  const { rows } = await pool.query(query, values);
  return rows.length > 0 ? (rows[0] as Audience) : undefined;
}

/**
 * Deletes an audience by ID.
 * @param id - The audience ID.
 * @returns True if deleted, false if not found.
 */
export async function deleteAudience(id: number): Promise<boolean> {
  const query = 'DELETE FROM audiences WHERE id = $1;';
  const { rowCount } = await pool.query(query, [id]);
  return rowCount ? rowCount > 0 : false;
}