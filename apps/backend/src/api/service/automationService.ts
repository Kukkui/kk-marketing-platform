/**
 * Service layer for Automation feature.
 * Handles business logic for Automation CRUD operations using PostgreSQL.
 * Includes a cron job to check schedules and send emails.
 */

import cron from 'node-cron';
import dayjs from 'dayjs';
import pool from '../../config/db';
import { Automation, AutomationPayload, AutomationDb, Audience } from '../../shared/types/automationTypes';
import nodemailer from 'nodemailer';

// Email transporter setup (configure with your email service)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface CampaignDb {
  id: number;
  campaign_name: string;
  subject_line: string;
  email_content: string;
}

interface AudienceDb {
  id: number;
  email: string;
}

/**
 * Fetches a campaign by ID from the database.
 * @param campaignId - The campaign ID.
 * @returns The campaign if found, or undefined.
 */
async function getCampaignById(campaignId: number): Promise<CampaignDb | undefined> {
  const query = `
    SELECT id, campaign_name, subject_line, email_content
    FROM campaigns
    WHERE id = $1;
  `;
  const { rows } = await pool.query(query, [campaignId]);
  return rows.length > 0 ? rows[0] as CampaignDb : undefined;
}

/**
 * Fetches audiences by their IDs from the database.
 * @param audienceIds - Array of audience IDs.
 * @returns List of audiences.
 */
async function getAudiencesByIds(audienceIds: number[] | Audience[]): Promise<AudienceDb[]> {
  if (audienceIds.length === 0) return [];
  const query = `
    SELECT id, email
    FROM audiences
    WHERE id = ANY($1::integer[]);
  `;
  const { rows } = await pool.query(query, [audienceIds]);
  return rows as AudienceDb[];
}

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
    SET name = $1, schedule = $2, campaign_id = $3, audience_ids = $4, status = $5
    WHERE id = $6
    RETURNING *;
  `;
  const schedule = payload.schedule ? payload.schedule.toISOString() : null;
  const values = [payload.name, schedule, payload.campaign, payload.audienceIds, payload.status, id];
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

/**
 * Starts a cron job to check automations every minute and send emails if scheduled.
 */
export function startAutomationCron(): void {
  console.log('Starting automation cron job...');

  cron.schedule('0 * * * *', async () => { // REAL CRON JOB (every hour to save resources)
    console.log('Checking automations at:', new Date().toISOString());

    try {
      // Fetch all Running automations directly from the database
      const query = `
        SELECT * FROM automations
        WHERE status = $1;
      `;
      const { rows: dbAutomations } = await pool.query(query, ['Running']);
      const automations = await Promise.all(
        dbAutomations.map((dbAutomation: AutomationDb) => formatAutomation(dbAutomation))
      );

      // Get current time
      const now = dayjs();

      for (const automation of automations) {
        if (!automation.schedule) continue;

        const scheduleTime = dayjs(automation.schedule);

        // Check if the automation's schedule matches the current time (within the same minute)
        if (
          now.isSame(scheduleTime, 'hour') 
          && now.isSame(scheduleTime, 'day')
          && now.isSame(scheduleTime, 'month')
          && now.isSame(scheduleTime, 'year')
        ) {
          console.log(`Processing automation: ${automation.name} (ID: ${automation.id})`);

          // Fetch campaign and audience data
          const campaign = await getCampaignById(automation.campaign);
          const audiences = await getAudiencesByIds(automation.audiences);

          if (!campaign) {
            console.error(`Campaign not found for automation: ${automation.id}`);
            continue;
          }

          if (audiences.length === 0) {
            console.error(`No valid audience emails found for automation: ${automation.id}`);
            continue;
          }

          // Send email to each audience member
          for (const audience of audiences) {
            const mailOptions = {
              from: `KK Marketing Platform`,
              to: audience.email,
              subject: campaign.subject_line,
              html: campaign.email_content,
            };

            try {
              await transporter.sendMail(mailOptions);
              console.log(`Email sent to: ${audience.email} for automation: ${automation.id}`);
            } catch (error) {
              console.error(`Failed to send email to ${audience.email}:`, error);
            }
          }

          // Update automation status to Completed
          try {
            const updateQuery = `
              UPDATE automations
              SET status = $1
              WHERE id = $2
              RETURNING *;
            `;
            const { rows } = await pool.query(updateQuery, ['Completed', automation.id]);
            if (rows.length === 0) {
              console.error(`Failed to update automation ${automation.id}: Not found`);
            } else {
              console.log(`Automation ${automation.id} marked as Completed`);
            }
          } catch (error) {
            console.error(`Failed to update automation ${automation.id} status:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error in automation cron job:', error);
    }
  });
}