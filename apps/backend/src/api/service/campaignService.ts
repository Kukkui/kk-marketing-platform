/**
 * Service layer for Campaign feature.
 * Handles business logic for Campaign CRUD operations using PostgreSQL.
 */

import pool from '../../config/db';
import { Campaign, CampaignPayload } from '../../shared/types/campaignTypes';

/**
 * Creates a new campaign.
 * @param payload - The campaign data to create.
 * @returns The created campaign.
 */
export async function createCampaign(payload: CampaignPayload): Promise<Campaign> {
  const query = `
    INSERT INTO campaigns (campaign_name, subject_line, email_content, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *;
  `;
  const values = [payload.campaignName, payload.subjectLine, payload.emailContent];
  const { rows } = await pool.query(query, values);
  return rows[0] as Campaign;
}

/**
 * Retrieves all campaigns.
 * @returns List of all campaigns.
 */
export async function getAllCampaigns(): Promise<Campaign[]> {
  const query = 'SELECT * FROM campaigns;';
  const { rows } = await pool.query(query);
  return rows as Campaign[];
}

/**
 * Retrieves a campaign by ID.
 * @param id - The campaign ID.
 * @returns The campaign if found, or undefined.
 */
export async function getCampaignById(id: number): Promise<Campaign | undefined> {
  const query = 'SELECT * FROM campaigns WHERE id = $1;';
  const { rows } = await pool.query(query, [id]);
  return rows.length > 0 ? (rows[0] as Campaign) : undefined;
}

/**
 * Updates a campaign by ID.
 * @param id - The campaign ID.
 * @param payload - The updated campaign data.
 * @returns The updated campaign, or undefined if not found.
 */
export async function updateCampaign(id: number, payload: CampaignPayload): Promise<Campaign | undefined> {
  const query = `
    UPDATE campaigns
    SET campaign_name = $1, subject_line = $2, email_content = $3
    WHERE id = $4
    RETURNING *;
  `;
  const values = [payload.campaignName, payload.subjectLine, payload.emailContent, id];
  const { rows } = await pool.query(query, values);
  return rows.length > 0 ? (rows[0] as Campaign) : undefined;
}

/**
 * Deletes a campaign by ID.
 * @param id - The campaign ID.
 * @returns True if deleted, false if not found.
 */
export async function deleteCampaign(id: number): Promise<boolean> {
  const query = 'DELETE FROM campaigns WHERE id = $1;';
  const { rowCount } = await pool.query(query, [id]);
  return rowCount ? rowCount > 0 : false;
}