/**
 * Controller for Automation endpoints.
 * Handles request/response logic and delegates to services.
 */

import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { createAutomation, getAllAutomations, getAutomationById, updateAutomation, deleteAutomation } from '../service/automationService';
import { AutomationPayload, AutomationResponse } from '../../shared/types/automationTypes';

/**
 * Creates a new automation.
 */
export async function createAutomationHandler(req: Request, res: Response) {
  const payload: Omit<AutomationPayload, 'schedule'> & { schedule: string | null } = req.body;
  const formattedPayload: AutomationPayload = {
    ...payload,
    schedule: payload.schedule ? dayjs(payload.schedule) : null,
  };
  const automation = await createAutomation(formattedPayload);
  const response: AutomationResponse = { data: automation, message: 'Automation created successfully' };
  res.status(201).json(response);
}

/**
 * Retrieves all automations.
 */
export async function getAllAutomationsHandler(req: Request, res: Response) {
  const automations = await getAllAutomations();
  const response: AutomationResponse = { data: automations };
  res.status(200).json(response);
}

/**
 * Retrieves an automation by ID.
 */
export async function getAutomationByIdHandler(req: Request, res: Response) {
  const { id } = req.params;
  const automation = await getAutomationById(parseInt(id, 10));
  if (!automation) {
    return res.status(404).json({ message: 'Automation not found' });
  }
  const response: AutomationResponse = { data: automation };
  res.status(200).json(response);
}

/**
 * Updates an automation by ID.
 */
export async function updateAutomationHandler(req: Request, res: Response) {
  const { id } = req.params;
  const payload: Omit<AutomationPayload, 'schedule'> & { schedule: string | null } = req.body;
  const formattedPayload: AutomationPayload = {
    ...payload,
    schedule: payload.schedule ? dayjs(payload.schedule) : null,
  };
  const updatedAutomation = await updateAutomation(parseInt(id, 10), formattedPayload);
  if (!updatedAutomation) {
    return res.status(404).json({ message: 'Automation not found' });
  }
  const response: AutomationResponse = { data: updatedAutomation, message: 'Automation updated successfully' };
  res.status(200).json(response);
}

/**
 * Deletes an automation by ID.
 */
export async function deleteAutomationHandler(req: Request, res: Response) {
  const { id } = req.params;
  const deleted = await deleteAutomation(parseInt(id, 10));
  if (!deleted) {
    return res.status(404).json({ message: 'Automation not found' });
  }
  res.status(204).send();
}