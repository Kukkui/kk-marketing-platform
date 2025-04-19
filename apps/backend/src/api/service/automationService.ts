/**
 * Service layer for Automation feature.
 * Handles business logic for Automation CRUD operations using PostgreSQL.
 */

import dayjs from 'dayjs';
import pool from '../../config/db';
import { Automation, AutomationPayload, AutomationDb } from '../../shared/types/automationTypes';

/**
 * Converts a database automation to the API format.
 * Fetches associated audiences and converts schedule to Dayjs.
 * @param dbAutomation - The automation data from the database.
 * @returns The formatted automation.
 */
async function formatAutomation(dbAutomation: AutomationDb): Promise<Automation> {
  const audienceQuery = `
    SELECT a.id, a.email
    FROM audiences a
    JOIN automation_audience aa ON a.id = aa.audience_id
    WHERE aa.automation_id = $1;
  `;
  const { rows: audiences } = await pool.query(audienceQuery, [dbAutomation.id]);

  return {
    id: dbAutomation.id,
    name: dbAutomation.name,
    schedule: dbAutomation.schedule ? dayjs(dbAutomation.schedule) : null,
    campaign: dbAutomation.campaign_id,
    audiences: audiences.map((a: { id: number; email: string }) => ({
      id: a.id,
      email: a.email,
    })),
  };
}

/**
 * Creates a new automation.
 * @param payload - The automation data to create.
 * @returns The created automation.
 */
export async function createAutomation(payload: AutomationPayload): Promise<Automation> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const automationQuery = `
      INSERT INTO automations (name, schedule, campaign_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const schedule = payload.schedule ? payload.schedule.toISOString() : null;
    const automationValues = [payload.name, schedule, payload.campaign];
    const { rows: automationRows } = await client.query(automationQuery, automationValues);
    const automation = automationRows[0] as AutomationDb;

    // Insert audience associations
    if (payload.audiences && payload.audiences.length > 0) {
      const audienceQuery = `
        INSERT INTO automation_audience (automation_id, audience_id)
        VALUES ($1, $2);
      `;
      for (const audience of payload.audiences) {
        await client.query(audienceQuery, [automation.id, audience.id]);
      }
    }

    await client.query('COMMIT');
    return await formatAutomation(automation);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
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
 * @param id - The automation ID.
 * @returns The automation if found, or undefined.
 */
export async function getAutomationById(id: number): Promise<Automation | undefined> {
  const query = 'SELECT * FROM automations WHERE id = $1;';
  const { rows } = await pool.query(query, [id]);
  if (rows.length === 0) return undefined;
  return await formatAutomation(rows[0] as AutomationDb);
}

/**
 * Updates an automation by ID.
 * @param id - The automation ID.
 * @param payload - The updated automation data.
 * @returns The updated automation, or undefined if not found.
 */
export async function updateAutomation(id: number, payload: AutomationPayload): Promise<Automation | undefined> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const automationQuery = `
      UPDATE automations
      SET name = $1, schedule = $2, campaign_id = $3
      WHERE id = $4
      RETURNING *;
    `;
    const schedule = payload.schedule ? payload.schedule.toISOString() : null;
    const automationValues = [payload.name, schedule, payload.campaign, id];
    const { rows: automationRows } = await client.query(automationQuery, automationValues);
    if (automationRows.length === 0) {
      await client.query('ROLLBACK');
      return undefined;
    }
    const automation = automationRows[0] as AutomationDb;

    // Update audience associations: delete existing and insert new
    await client.query('DELETE FROM automation_audience WHERE automation_id = $1;', [id]);
    if (payload.audiences && payload.audiences.length > 0) {
      const audienceQuery = `
        INSERT INTO automation_audience (automation_id, audience_id)
        VALUES ($1, $2);
      `;
      for (const audience of payload.audiences) {
        await client.query(audienceQuery, [id, audience.id]);
      }
    }

    await client.query('COMMIT');
    return await formatAutomation(automation);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Deletes an automation by ID.
 * @param id - The automation ID.
 * @returns True if deleted, false if not found.
 */
export async function deleteAutomation(id: number): Promise<boolean> {
  const query = 'DELETE FROM automations WHERE id = $1;';
  const { rowCount } = await pool.query(query, [id]);
  // Note: ON DELETE CASCADE in automation_audience will automatically remove associated entries
  return rowCount ? rowCount > 0 : false;
}