/**
 * Controller for Automation endpoints.
 * Handles request/response logic and delegates to services.
 */

import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { createAutomation, getAllAutomations, getAutomationById, updateAutomation, deleteAutomation } from '../service/automationService';
import { AutomationPayloadSchema } from '../../schema/automationSchemas';
import { AutomationResponse } from '../../shared/types/automationTypes';
import { z } from 'zod';

/**
 * Creates a new automation.
 */
export async function createAutomationHandler(req: Request, res: Response) {
  try {
    const payload = AutomationPayloadSchema.parse(req.body);
    const formattedPayload = {
      ...payload,
      schedule: payload.schedule ? dayjs(payload.schedule) : null,
    };
    const automation = await createAutomation(formattedPayload);
    const response: AutomationResponse = { data: automation, message: 'Automation created successfully' };
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
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
  const automation = await getAutomationById(id);
  if (!automation) {
    return res.status(404).json({ message: 'Automation not found' });
  }
  const response: AutomationResponse = { data: automation };
  return res.status(200).json(response);
}

/**
 * Updates an automation by ID.
 */
export async function updateAutomationHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const payload = AutomationPayloadSchema.parse(req.body);
    const formattedPayload = {
      ...payload,
      schedule: payload.schedule ? dayjs(payload.schedule) : null,
    };
    const updatedAutomation = await updateAutomation(id, formattedPayload);
    if (!updatedAutomation) {
      return res.status(404).json({ message: 'Automation not found' });
    }
    const response: AutomationResponse = { data: updatedAutomation, message: 'Automation updated successfully' };
    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Deletes an automation by ID.
 */
export async function deleteAutomationHandler(req: Request, res: Response) {
  const { id } = req.params;
  const deleted = await deleteAutomation(id);
  if (!deleted) {
    return res.status(404).json({ message: 'Automation not found' });
  }
  return res.status(204).send();
}