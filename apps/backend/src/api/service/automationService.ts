/**
 * Service layer for Automation feature.
 * Handles business logic for Automation CRUD operations.
 */

import { v4 as uuidv4 } from 'uuid';
import { Automation, AutomationPayload } from '../../shared/types/automationTypes';

// In-memory storage (replace with a database in production)
const automations: Automation[] = [];

/**
 * Creates a new automation.
 * @param payload - The automation data to create.
 * @returns The created automation.
 */
export function createAutomation(payload: AutomationPayload): Automation {
  const automation: Automation = {
    id: uuidv4(),
    name: payload.name,
    schedule: payload.schedule,
    campaignId: payload.campaignId,
    audienceId: payload.audienceId,
    status: payload.status,
  };
  automations.push(automation);
  return automation;
}

/**
 * Retrieves all automations.
 * @returns List of all automations.
 */
export function getAllAutomations(): Automation[] {
  return automations;
}

/**
 * Retrieves an automation by ID.
 * @param id - The automation ID.
 * @returns The automation if found, or undefined.
 */
export function getAutomationById(id: string): Automation | undefined {
  return automations.find(automation => automation.id === id);
}

/**
 * Updates an automation by ID.
 * @param id - The automation ID.
 * @param payload - The updated automation data.
 * @returns The updated automation, or undefined if not found.
 */
export function updateAutomation(id: string, payload: AutomationPayload): Automation | undefined {
  const index = automations.findIndex(automation => automation.id === id);
  if (index === -1) return undefined;

  const updatedAutomation = { ...automations[index], ...payload };
  automations[index] = updatedAutomation;
  return updatedAutomation;
}

/**
 * Deletes an automation by ID.
 * @param id - The automation ID.
 * @returns True if deleted, false if not found.
 */
export function deleteAutomation(id: string): boolean {
  const index = automations.findIndex(automation => automation.id === id);
  if (index === -1) return false;

  automations.splice(index, 1);
  return true;
}