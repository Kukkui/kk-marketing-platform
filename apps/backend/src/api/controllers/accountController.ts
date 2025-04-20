/**
 * Controller for Account endpoints.
 * Handles request/response logic and delegates to services.
 */

import { Request, Response } from 'express';
import { createAccount, getAllAccounts, getAccountById, updateAccount, deleteAccount, login } from '../service/accountService';
import { AccountPayload, AccountResponse, LoginResponse } from '../../shared/types/accountTypes';

/**
 * Creates a new account.
 */
export async function createAccountHandler(req: Request, res: Response) {
  const payload: AccountPayload = req.body;
  const account = await createAccount(payload);
  const response: AccountResponse = { data: account, message: 'Account created successfully' };
  res.status(201).json(response);
}

/**
 * Authenticates a user.
 */
export async function loginHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  const loginResponse: LoginResponse = await login(email, password);
  res.status(200).json(loginResponse);
}

/**
 * Retrieves all accounts.
 */
export async function getAllAccountsHandler(req: Request, res: Response) {
  const accounts = await getAllAccounts();
  const response: AccountResponse = { data: accounts };
  res.status(200).json(response);
}

/**
 * Retrieves an account by ID.
 */
export async function getAccountByIdHandler(req: Request, res: Response) {
  const { id } = req.params;
  const account = await getAccountById(Number(id));
  if (!account) {
    return res.status(404).json({ message: 'Account not found' });
  }
  const response: AccountResponse = { data: account };
  return res.status(200).json(response);
}

/**
 * Updates an account by ID.
 */
export async function updateAccountHandler(req: Request, res: Response) {
  const { id } = req.params;
  const payload: AccountPayload = req.body;
  const updatedAccount = await updateAccount(Number(id), payload);
  if (!updatedAccount) {
    return res.status(404).json({ message: 'Account not found' });
  }
  const response: AccountResponse = { data: updatedAccount, message: 'Account updated successfully' };
  return res.status(200).json(response);
}

/**
 * Deletes an account by ID.
 */
export async function deleteAccountHandler(req: Request, res: Response) {
  const { id } = req.params;
  const deleted = await deleteAccount(Number(id));
  if (!deleted) {
    return res.status(404).json({ message: 'Account not found' });
  }
  return res.status(204).send();
}