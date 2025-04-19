/**
 * Controller for Automation endpoints.
 * Handles request/response logic and delegates to services.
 */

import { Request, Response } from 'express';
import { createAutomation, getAllAutomations, getAutomationById, updateAutomation, deleteAutomation } from '../service/automationService';
import { AutomationPayload, AutomationResponse } from '../../shared/types/automationTypes';

/**
 * Creates a new automation.
 */
export function createAutomationHandler(req: Request, res: Response) {
  const payload: AutomationPayload = req.body;
  const automation = createAutomation(payload);
  const response: AutomationResponse = { data: automation, message: 'Automation created successfully' };
  res.status(201).json(response);
}

/**
 * Retrieves all automations.
 */
export function getAllAutomationsHandler(req: Request, res: Response) {
  const automations = getAllAutomations();
  const response: AutomationResponse = { data: automations };
  res.status(200).json(response);
}

/**
 * Retrieves an automation by ID.
 */
export function getAutomationByIdHandler(req: Request, res: Response) {
  const { id } = req.params;
  const automation = getAutomationById(id);
  if (!automation) {
    return res.status(404).json({ message: 'Automation not found' });
  }
  const response: AutomationResponse = { data: automation };
  res.status(200).json(response);
}

/**
 * Updates an automation by ID.
 */
export function updateAutomationHandler(req: Request, res: Response) {
  const { id } = req.params;
  const payload: AutomationPayload = req.body;
  const updatedAutomation = updateAutomation(id, payload);
  if (!updatedAutomation) {
    return res.status(404).json({ message: 'Automation not found' });
  }
  const response: AutomationResponse = { data: updatedAutomation, message: 'Automation updated successfully' };
  res.status(200).json(response);
}

/**
 * Deletes an automation by ID.
 */
export function deleteAutomationHandler(req: Request, res: Response) {
  const { id } = req.params;
  const deleted = deleteAutomation(id);
  if (!deleted) {
    return res.status(404).json({ message: 'Automation not found' });
  }
  res.status(204).send();
}