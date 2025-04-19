/**
 * Service layer for Automation feature.
 * Handles business logic for Automation CRUD operations using PostgreSQL.
 */

import dayjs from 'dayjs';
import pool from '../../config/db';
import { Automation, AutomationPayload, AutomationDb } from '../../shared/types/automationTypes';

/**
 * Validates that all audience IDs exist in the audiences table.
 * @param audienceIds - Array of audience IDs to validate.
 * @throws Error if any audience ID is invalid.
 */
async function validateAudienceIds(audienceIds: number[]): Promise<void> {
  if (audienceIds.length === 0) return;
  const query = `
    SELECT id
    FROM audiences
    WHERE id = ANY($1::integer[]);
  `;
  const { rows } = await pool.query(query, [audienceIds]);
  const foundIds = rows.map((row: { id: number }) => row.id);
  const invalidIds = audienceIds.filter((id) => !foundIds.includes(id));
  if (invalidIds.length > 0) {
    throw new Error(`Invalid audience IDs: ${invalidIds.join(', ')}`);
  }
}

/**
 * Converts a database automation to the API format.
 * Fetches associated audiences and converts schedule to Dayjs.
 * @param dbAutomation - The automation data from the database.
 * @returns The formatted automation.
 */
async function formatAutomation(dbAutomation: AutomationDb): Promise<Automation> {
  let audiences: { id: number; email: string }[] = [];
  if (dbAutomation.audience_ids && dbAutomation.audience_ids.length > 0) {
    const audienceQuery = `
      SELECT id, email
      FROM audiences
      WHERE id = ANY($1::integer[]);
    `;
    const { rows } = await pool.query(audienceQuery, [dbAutomation.audience_ids]);
    audiences = rows;
  }

  return {
    id: dbAutomation.id,
    name: dbAutomation.name,
    schedule: dbAutomation.schedule ? dayjs(dbAutomation.schedule) : null,
    campaign: dbAutomation.campaign_id,
    status: dbAutomation.status,
    audiences: audiences.map((a) => a?.id),
  };
}

/**
 * Creates a new automation.
 * @param payload - The automation data to create.
 * @returns The created automation.
 */
export async function createAutomation(payload: AutomationPayload): Promise<Automation> {
  // Validate audience IDs
  await validateAudienceIds(payload.audienceIds);

  const query = `
    INSERT INTO automations (name, schedule, campaign_id, audience_ids, status, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING *;
  `;
  const schedule = payload.schedule ? payload.schedule.toISOString() : null;
  const values = [payload.name, schedule, payload.campaign, payload.audienceIds, payload.status];
  const { rows } = await pool.query(query, values);
  const automation = rows[0] as AutomationDb;
  return await formatAutomation(automation);
}

/**
 * Retrieves all automations.
 * @returns List of all automations.
 */
export async function getAllAutomations(): Promise<Automation[]> {
  const query = 'SELECT * FROM automations;';
  const { rows: dbAutomations } = await pool.query(query);
  const automations = await Promise.all(
    dbAutomations.map((dbAutomation: AutomationDb) => formatAutomation(dbAutomation))
  );
  return automations;
}

/**
 * Retrieves an automation by ID.
 * @param id - The automation ID (UUID as string).
 * @returns The automation if found, or undefined.
 */
export async function getAutomationById(id: string): Promise<Automation | undefined> {
  const query = 'SELECT * FROM automations WHERE id = $1;';
  const { rows } = await pool.query(query, [id]);
  if (rows.length === 0) return undefined;
  return await formatAutomation(rows[0] as AutomationDb);
}

/**
 * Updates an automation by ID.
 * @param id - The automation ID (UUID as string).
 * @param payload - The updated automation data.
 * @returns The updated automation, or undefined if not found.
 */
export async function updateAutomation(id: string, payload: AutomationPayload): Promise<Automation | undefined> {
  // Validate audience IDs
  await validateAudienceIds(payload.audienceIds);

  const query = `
    UPDATE automations
    SET name = $1, schedule = $2, campaign_id = $3, audience_ids = $4
    WHERE id = $5
    RETURNING *;
  `;
  const schedule = payload.schedule ? payload.schedule.toISOString() : null;
  const values = [payload.name, schedule, payload.campaign, payload.audienceIds, id];
  const { rows } = await pool.query(query, values);
  if (rows.length === 0) return undefined;
  return await formatAutomation(rows[0] as AutomationDb);
}

/**
 * Deletes an automation by ID.
 * @param id - The automation ID (UUID as string).
 * @returns True if deleted, false if not found.
 */
export async function deleteAutomation(id: string): Promise<boolean> {
  const query = 'DELETE FROM automations WHERE id = $1;';
  const { rowCount } = await pool.query(query, [id]);
  return rowCount ? rowCount > 0 : false;
}